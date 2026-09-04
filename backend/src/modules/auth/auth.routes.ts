import { Router } from "express";
import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.schema.js";
import {
  forgotPasswordController,
  getCurrentUser,
  login,
  logout,
  refresh,
  register,
  resetPasswordController,
} from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, getCurrentUser);
router.post("/refresh", validate(refreshTokenSchema), refresh);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController,
);
router.post("/logout", validate(logoutSchema), logout);

export default router;
