import type { NextFunction, Request, Response } from "express";

import { getDashboardData } from "./dashboard.service.js";

export const getDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const dashboardData = await getDashboardData();

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};