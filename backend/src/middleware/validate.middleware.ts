import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app.error.js";
import { z } from "zod";

type RequestSchema = z.ZodObject<{
  body: z.ZodType;
  params: z.ZodType;
  query: z.ZodType;
}>;

export const validate = (schema: RequestSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(
        new AppError(
          result.error.issues[0]?.message ?? "validation failed",
          400,
        ),
      );
      return;
    }

    next();
  };
};
