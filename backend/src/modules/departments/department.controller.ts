import type { NextFunction, Request, Response } from "express";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "./department.service.js";

type DepartmentParams = {
  id: string;
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const department = await createDepartment(req.body);

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
  req: Request<DepartmentParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const department = await getDepartmentById(req.params.id);

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
  req: Request<DepartmentParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const department = await updateDepartment(req.params.id, req.body);

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
  req: Request<DepartmentParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await deleteDepartment(req.params.id);

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
