import { Request, Response, NextFunction } from "express";
import type {
  UpdateEmployeeBody,
  UpdateEmployeeParams,
} from "./employee.schema.js";
import {
  getAllEmployees,
  updateEmployee as updateEmployeeService,
} from "./employee.service.js";

type GetEmployeesInput = {
  page: number;
  pageSize: number;
  search?: string;
  departmentId?: string;
  designationId?: string;
};

type GetEmployeesRequest = Request & {
  query: GetEmployeesInput;
};

export const getEmployees = async (
  req: GetEmployeesRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await getAllEmployees(
      req.validated!.query as GetEmployeesInput,
    );
    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: result.employees,
      page: result.page,
      pageSize: result.pageSize,
      totalCount: result.totalCount,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = req.validated;

    if (!validatedData) {
      throw new Error("Validated request data is missing");
    }

    const params = validatedData.params as UpdateEmployeeParams;

    const body = validatedData.body as UpdateEmployeeBody;

    const employee = await updateEmployeeService(params.id, body);

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};
