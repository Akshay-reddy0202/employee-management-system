import prisma from "../../config/prisma.js";
import type { UpdateProfileBody } from "./profile.schema.js";
import { AppError } from "../../utils/app.error.js";
import {
  uploadProfileImage,
  deleteProfileImage,
} from "../../services/cloudinary.service.js";

export const getMyProfile = async (employeeId: string) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },

    select: {
      id: true,
      employeeId: true,
      fullName: true,
      emailID: true,
      phoneNumber: true,
      address: true,
      profileImageUrl: true,
      skills: true,

      role: true,
      status: true,
      theme: true,

      dateOfBirth: true,
      joiningDate: true,
      salary: true,

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
    },
  });

  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  return employee;
};

export const updateMyProfile = async (
  employeeId: string,
  data: UpdateProfileBody,
) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  const updatedEmployee = await prisma.employee.update({
    where: {
      id: employeeId,
    },

    data,

    select: {
      id: true,
      employeeId: true,
      fullName: true,
      emailID: true,
      phoneNumber: true,
      address: true,
      skills: true,

      role: true,
      status: true,
      theme: true,

      dateOfBirth: true,
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

export const updateProfileImage = async (
  employeeId: string,
  file: Express.Multer.File,
) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
    select: {
      profileImagePublicId: true,
    },
  });

  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  const uploadedImage = await uploadProfileImage(file.buffer);

  const updatedEmployee = await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      profileImageUrl: uploadedImage.secureUrl,
      profileImagePublicId: uploadedImage.publicId,
    },
    select: {
      id: true,
      fullName: true,
      profileImageUrl: true,
    },
  });

  if (employee.profileImagePublicId) {
    await deleteProfileImage(employee.profileImagePublicId);
  }

  return updatedEmployee;
};

export const removeProfileImage = async (
  employeeId: string,
) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
    select: {
      profileImagePublicId: true,
    },
  });

  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  if (!employee.profileImagePublicId) {
    throw new AppError("Profile image not found", 404);
  }

  await deleteProfileImage(employee.profileImagePublicId);

  const updatedEmployee = await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      profileImageUrl: null,
      profileImagePublicId: null,
    },
    select: {
      id: true,
      fullName: true,
      profileImageUrl: true,
    },
  });

  return updatedEmployee;
};