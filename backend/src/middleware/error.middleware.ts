import type { ErrorRequestHandler } from "express";
import { errorResponse } from "../utils/api.response.js";
import { AppError } from "../utils/app.error.js";

export const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return errorResponse(res, {
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  console.error(error);

  return errorResponse(res, {
    statusCode: 500,
    message: "Internal server error",
  });
};
