import prisma from "../../config/prisma.js";

import { AppError } from "../../utils/app.error.js";

type CreateDesignationInput = {
  name: string;
  status: "Active" | "Inactive";
};

type UpdateDesignationInput = {
  name?: string;
  status?: "Active" | "Inactive";
};

export const createDesignation = async (data: CreateDesignationInput) => {
  const existingDesignation = await prisma.designation.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingDesignation) {
    throw new AppError("A designation with this name already exists", 409);
  }

  const designation = await prisma.designation.create({
    data: {
      name: data.name,
      status: data.status,
    },
  });

  return designation;
};

export const getAllDesignations = async () => {
  const designations = await prisma.designation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return designations;
};

export const updateDesignation = async (
  designationId: string,
  data: UpdateDesignationInput,
) => {
  const designation = await prisma.designation.findUnique({
    where: {
      id: designationId,
    },
  });

  if (!designation) {
    throw new AppError("Designation not found", 404);
  }

  if (data.name) {
    const existingDesignation = await prisma.designation.findFirst({
      where: {
        name: data.name,
        id: {
          not: designationId,
        },
      },
    });

    if (existingDesignation) {
      throw new AppError("A designation with this name already exists", 409);
    }
  }

  const updatedDesignation = await prisma.designation.update({
    where: {
      id: designationId,
    },
    data,
  });

  return updatedDesignation;
};
