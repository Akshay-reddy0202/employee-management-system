import type { NextFunction, Request, Response } from "express";
import {
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
  removeProfileImage,
} from "./profile.service.js";
import type { UpdateProfileBody } from "./profile.schema.js";
import { AppError } from "../../utils/app.error.js";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const employee = await getMyProfile(req.user!.id);

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.validated) {
      throw new Error("Validated request data is missing");
    }

    const employee = await updateMyProfile(
      req.user!.id,
      req.validated.body as UpdateProfileBody,
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileImageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError("Profile image is required", 400);
    }

    const employee = await updateProfileImage(req.user!.id, req.file);

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const removeProfileImageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const employee = await removeProfileImage(req.user!.id);

    res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};
