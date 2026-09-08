import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { errorResponse } from "../utils/api.response.js";
import { AppError } from "../utils/app.error.js";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return errorResponse(res, {
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  if (error instanceof multer.MulterError) {
    let message = "File upload failed";

    if (error.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds the 5MB limit";
    } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field in upload request";
    }

    return errorResponse(res, {
      statusCode: 400,
      message,
    });
  }

  console.error(error);

  return errorResponse(res, {
    statusCode: 500,
    message: "Internal server error",
  });
};
