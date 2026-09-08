import { NextFunction, Request, Response } from "express";
import {
  registerEmployee,
  loginEmployee,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  logoutEmployee,
} from "./auth.service.js";
import { sendPasswordResetEmail } from "../../services/email.service.js";
import {
  clearRefreshTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../config/cookie.js";
import { AppError } from "../../utils/app.error.js";
import type { RegisterEmployeeInput } from "./auth.schema.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const employee = await registerEmployee(
      req.validated!.body as RegisterEmployeeInput,
    );

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await loginEmployee(req.body);

    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        employee: result.employee,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Authenticated user retrieved successfully",
    data: req.user,
  });
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }

    const result = await refreshAccessToken(refreshToken);

    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const resetToken = await forgotPassword(req.body.emailID);

    if (resetToken) {
      await sendPasswordResetEmail(req.body.emailID, resetToken);
    }

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email address, a password reset link has been sent",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await resetPassword(req.body.token, req.body.password);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await logoutEmployee(refreshToken);
    }

    res.clearCookie("refreshToken", clearRefreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
