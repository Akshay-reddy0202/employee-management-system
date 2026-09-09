import type { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/app.error.js";

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Unauthorized", 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        new AppError("You do not have permission to perform this action", 403),
      );
      return;
    }

    next();
  };
};
