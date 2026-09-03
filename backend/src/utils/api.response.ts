import type { Response } from "express";

type PaginationMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

type ApiErrorResponse = {
  success: false;
  message: string;
};

type SuccessResponseOptions<T> = {
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

type ErrorResponseOptions = {
  statusCode: number;
  message: string;
};

export const successResponse = <T>(
  res: Response,
  options: SuccessResponseOptions<T>,
): Response<ApiSuccessResponse<T>> => {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message: options.message,
    data: options.data,
    ...(options.meta && { meta: options.meta }),
  };

  return res.status(options.statusCode).json(response);
};

export const errorResponse = <T>(
  res: Response,
  options: ErrorResponseOptions,
): Response<ApiErrorResponse> => {
  const response: ApiErrorResponse = {
    success: false,
    message: options.message,
  };
  return res.status(options.statusCode).json(response);
};
