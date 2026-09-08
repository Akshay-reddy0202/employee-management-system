import prisma from "../../config/prisma.js";
import { AppError } from "../../utils/app.error.js";

type GetEmployeesInput = {
  page: number;
  pageSize: number;
  search?: string;
  departmentId?: string;
  designationId?: string;
};

type UpdateEmployeeInput = {
  managerId?: string | null;
  departmentId?: string;
  designationId?: string;
  salary?: number;
  status?: "Active" | "Inactive";
  joiningDate?: Date;
};

export const getAllEmployees = async (data: GetEmployeesInput) => {
  const { page, pageSize, search, departmentId, designationId } = data;

  const skip = (page - 1) * pageSize;

  const where = {
    ...(search
      ? {
          OR: [
            {
              fullName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              employeeId: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(departmentId ? { departmentId } : {}),

    ...(designationId ? { designationId } : {}),
  };

  const [employees, totalCount] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        employeeId: true,
        fullName: true,
        emailID: true,
        role: true,
        dateOfBirth: true,
        salary: true,
        status: true,
        joiningDate: true,

        department: {
          select: {
            name: true,
          },
        },

        designation: {
          select: {
            name: true,
          },
        },

        manager: {
          select: {
            fullName: true,
          },
        },
      },
    }),

    prisma.employee.count({
      where,
    }),
  ]);

  return {
    employees,
    totalCount,
    page,
    pageSize,
  };
};

export const updateEmployee = async (id: string, data: UpdateEmployeeInput) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
  });

  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  if (data.departmentId) {
    const department = await prisma.department.findUnique({
      where: {
        id: data.departmentId,
      },
    });

    if (!department) {
      throw new AppError("Department not found", 404);
    }
  }

  if (data.designationId) {
    const designation = await prisma.designation.findUnique({
      where: {
        id: data.designationId,
      },
    });

    if (!designation) {
      throw new AppError("Designation not found", 404);
    }
  }

  if (data.managerId) {
    if (data.managerId === id) {
      throw new AppError("An employee cannot be their own manager", 400);
    }
    const manager = await prisma.employee.findUnique({
      where: {
        id: data.managerId,
      },
    });

    if (!manager) {
      throw new AppError("Manager not found", 404);
    }
  }

  const dataToUpdate = {
    ...data,

    ...(data.status === "Inactive" && {
      refreshTokenHash: null,
      refreshTokenExpires: null,
    }),
  };

  const updatedEmployee = await prisma.employee.update({
    where: {
      id,
    },

    data: dataToUpdate,

    select: {
      id: true,
      employeeId: true,
      fullName: true,
      emailID: true,
      role: true,
      status: true,
      salary: true,
      joiningDate: true,

      department: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },

      designation: {
        select: {
          id: true,
          name: true,
        },
      },

      manager: {
        select: {
          id: true,
          employeeId: true,
          fullName: true,
        },
      },

      updatedAt: true,
    },
  });

  return updatedEmployee;
};
