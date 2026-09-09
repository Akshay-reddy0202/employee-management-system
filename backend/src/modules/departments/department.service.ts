import prisma from "../../config/prisma.js";
import { AppError } from "../../utils/app.error.js";

type CreateDepartmentInput = {
  name: string;
  code: string;
  description?: string;
  status: "Active" | "Inactive";
};

type UpdateDepartmentInput = {
  name?: string;
  code?: string;
  description?: string;
  status?: "Active" | "Inactive";
};

export const createDepartment = async (data: CreateDepartmentInput) => {
  const existingDepartment = await prisma.department.findFirst({
    where: {
      OR: [{ name: data.name }, { code: data.code }],
    },
  });

  if (existingDepartment) {
    throw new AppError(
      "A department with this name or code already exists",
      409,
    );
  }

  const department = await prisma.department.create({
    data: {
      name: data.name,
      code: data.code,
      description: data.description,
      status: data.status,
    },
  });

  return department;
};

export const getAllDepartments = async () => {
  const departments = await prisma.department.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return departments;
};

export const getDepartmentById = async (departmentId: string) => {
  const department = await prisma.department.findUnique({
    where: { id: departmentId },
    include: {
      employees: {
        select: {
          id: true,
          employeeId: true,
          fullName: true,
          designation: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!department) {
    throw new AppError("Department not found", 404);
  }
  return department;
};

export const updateDepartment = async (
  departmentId: string,
  data: UpdateDepartmentInput,
) => {
  const department = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
  });

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  if (data.name || data.code) {
    const existingDepartment = await prisma.department.findFirst({
      where: {
        id: {
          not: departmentId,
        },
        OR: [
          ...(data.name ? [{ name: data.name }] : []),
          ...(data.code ? [{ code: data.code }] : []),
        ],
      },
    });

    if (existingDepartment) {
      throw new AppError(
        "A department with this name or code already exists",
        409,
      );
    }
  }
  const updatedDepartment = await prisma.department.update({
    where: {
      id: departmentId,
    },
    data,
  });

  return updatedDepartment;
};

export const deleteDepartment = async (departmentId: string) => {
  const department = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
    include: {
      _count: {
        select: {
          employees: true,
        },
      },
    },
  });

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  if (department._count.employees > 0) {
    throw new AppError(
      "Cannot delete a department that has employees assigned to it",
      409,
    );
  }

  await prisma.department.delete({
    where: {
      id: departmentId,
    },
  });
};
