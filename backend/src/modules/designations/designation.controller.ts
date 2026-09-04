import type { NextFunction, Request, Response } from "express";

import {
  createDesignation,
  getAllDesignations,
  updateDesignation,
} from "./designation.service.js";
import { success } from "zod";

type DesignationParams = {
  id: string;
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const designation = await createDesignation(req.body);

    res.status(201).json({
      success: true,
      message: "Designation created successfully",
      data: designation,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const designations = await getAllDesignations();

    res.status(200).json({
      success: true,
      message: "Designations retrieved successfully",
      data: designations,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request<DesignationParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const designation = await updateDesignation(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Designation upadted successfully",
      data: designation,
    });
  } catch (error) {
    next(error);
  }
};
