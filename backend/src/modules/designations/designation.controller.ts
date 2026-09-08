import type { NextFunction, Request, Response } from "express";
import {
  createDesignation,
  getAllDesignations,
  updateDesignation,
} from "./designation.service.js";
import type {
  CreateDesignationInput,
  UpdateDesignationInput,
  DesignationParams,
} from "./designation.schema.js";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = req.validated;

    if (!validatedData) {
      throw new Error("Validated request data is missing");
    }

    const designation = await createDesignation(
      validatedData.body as CreateDesignationInput,
    );

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
    const validatedData = req.validated;

    if (!validatedData) {
      throw new Error("Validated request data is missing");
    }

    const params = validatedData.params as DesignationParams;

    const designation = await updateDesignation(
      params.id,
      validatedData.body as UpdateDesignationInput,
    );

    res.status(200).json({
      success: true,
      message: "Designation upadted successfully",
      data: designation,
    });
  } catch (error) {
    next(error);
  }
};
