import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/app.error.js";
import prisma from "../config/prisma.js";

type JwtPayload = {
  id: string;
};

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    next(new AppError("Access token is required or invalid", 401));
    return;
  }

  const token = authorizationHeader.split(" ")[1];

  let decodedToken: JwtPayload;
  try {
    decodedToken = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    next(new AppError("Invalid or expired access token", 401));
    return;
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id: decodedToken.id,
      },

      select: {
        id: true,
        employeeId: true,
        role: true,
        status: true,
      },
    });

    if (!employee || employee.status !== "Active") {
      next(new AppError("Account is inactive or no longer exists", 401));
      return;
    }

    req.user = {
      id: employee.id,
      employeeId: employee.employeeId,
      role: employee.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
