import type { NextFunction, Request, Response } from "express";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "./department.service.js";
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentParams,
} from "./department.schema.js";

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

    const department = await createDepartment(
      validatedData.body as CreateDepartmentInput,
    );

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
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
    const departments = await getAllDepartments();

    res.status(200).json({
      success: true,
      message: "Departments retrieved successfully",
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = req.validated;

    if (!validatedData) {
      throw new Error("Validated request data is missing");
    }

    const params = validatedData.params as DepartmentParams;

    const department = await getDepartmentById(params.id);

    res.status(200).json({
      success: true,
      message: "Department retrieved successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = req.validated;

    if (!validatedData) {
      throw new Error("Validated request data is missing");
    }

    const params = validatedData.params as DepartmentParams;

    const department = await updateDepartment(
      params.id,
      validatedData.body as UpdateDepartmentInput,
    );

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = req.validated;

    if (!validatedData) {
      throw new Error("Validated request data is missing");
    }

    const params = validatedData.params as DepartmentParams;

    await deleteDepartment(params.id);

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
