import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/app.error.js";

type JwtPayload = {
  id: string;
  employeeId: string;
  role: string;
};

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    next(new AppError("Access token is required or invalid", 401));
    return;
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = {
      id: decodedToken.id,
      employeeId: decodedToken.employeeId,
      role: decodedToken.role,
    };

    next();
  } catch {
    next(new AppError("Invalid or expired access token", 401));
  }
};
