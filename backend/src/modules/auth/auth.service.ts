import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import { AppError } from "../../utils/app.error.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokens.js";
import { env } from "../../config/env.js";
import crypto from "crypto";
import { getRefreshTokenExpiresAt } from "../../utils/token-expiry.js";

type RegisterEmployeeInput = {
  role: "Admin" | "Employee";
  fullName: string;
  emailID: string;
  dateOfBirth: string;
  password: string;
};

type loginEmployeeInput = {
  employeeId: string;
  password: string;
};

type TokenPayload = {
  id: string;
  employeeId: string;
  role: string;
};

export const registerEmployee = async (data: RegisterEmployeeInput) => {
  const existingEmployee = await prisma.employee.findUnique({
    where: { emailID: data.emailID },
  });

  if (existingEmployee) {
    throw new AppError("An employee with this email already exists", 409);
  }

  const sequenceResult = await prisma.$queryRaw<
    { nextval: bigint }[]
  >`SELECT nextval('employee_seq')`;

  const employeeNumber = Number(sequenceResult[0].nextval);

  const nextEmployeeId = `E${String(employeeNumber).padStart(4, "0")}`;

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const employee = await prisma.employee.create({
    data: {
      employeeId: nextEmployeeId,
      fullName: data.fullName,
      emailID: data.emailID,
      password: hashedPassword,
      role: data.role,
      dateOfBirth: new Date(data.dateOfBirth),
    },

    select: {
      id: true,
      employeeId: true,
      fullName: true,
      emailID: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return employee;
};

export const loginEmployee = async (data: loginEmployeeInput) => {
  const employee = await prisma.employee.findUnique({
    where: {
      employeeId: data.employeeId,
    },
  });

  if (!employee) {
    throw new AppError("Invalid employeeId or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    employee.password,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid employeeId or password", 401);
  }

  if (employee.status !== "Active") {
    throw new AppError(
      "Your account is inactive. Please contact the administrator",
      403,
    );
  }

  const tokenPayload = {
    id: employee.id,
    employeeId: employee.employeeId,
    role: employee.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const refreshTokenExpires = getRefreshTokenExpiresAt();
  await prisma.employee.update({
    where: {
      id: employee.id,
    },
    data: {
      refreshTokenHash,
      refreshTokenExpires,
    },
  });
  return {
    employee: {
      id: employee.id,
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      emailID: employee.emailID,
      role: employee.role,
      status: employee.status,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decodedToken = jwt.verify(
      refreshToken,
      env.JWT_REFRESH_SECRET,
    ) as TokenPayload;

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const employee = await prisma.employee.findFirst({
      where: {
        id: decodedToken.id,
        status: "Active",
        refreshTokenHash,
        refreshTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!employee) {
      throw new AppError(
        "Invalid or expired refresh token, or account is inactive",
        401,
      );
    }

    const tokenPayload = {
      id: employee.id,
      employeeId: employee.employeeId,
      role: employee.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await prisma.employee.update({
      where: {
        id: employee.id,
      },
      data: {
        refreshTokenHash: newRefreshTokenHash,
        refreshTokenExpires: getRefreshTokenExpiresAt(),
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired refresh token", 401);
  }
};

export const forgotPassword = async (emailID: string) => {
  const employee = await prisma.employee.findUnique({
    where: { emailID },
  });

  if (!employee) {
    return null;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await prisma.employee.update({
    where: {
      id: employee.id,
    },
    data: {
      passwordResetToken: hashedResetToken,
      passwordResetExpires,
    },
  });
  return resetToken;
};

export const resetPassword = async (token: string, password: string) => {
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const employee = await prisma.employee.findFirst({
    where: {
      passwordResetToken: hashedResetToken,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!employee) {
    throw new AppError("Invalid or expired password reset token", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.employee.update({
    where: {
      id: employee.id,
    },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      refreshTokenHash: null,
      refreshTokenExpires: null,
    },
  });
};

export const logoutEmployee = async (refreshToken: string): Promise<void> => {
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await prisma.employee.updateMany({
    where: {
      refreshTokenHash,
    },
    data: {
      refreshTokenHash: null,
      refreshTokenExpires: null,
    },
  });
};
