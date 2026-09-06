import type { NextFunction, Request, Response } from "express";
import { getMyProfile, updateMyProfile } from "./profile.service.js";
import type { UpdateProfileBody } from "./profile.schema.js";

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
