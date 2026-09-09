import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { updateProfileSchema } from "./profile.schema.js";
import {
  getProfile,
  updateProfile,
  updateProfileImageController,
  removeProfileImageController,
} from "./profile.controller.js";
import { profileImageUpload } from "../../middleware/upload.middleware.js";

const router = Router();

router.get("/", authenticate, getProfile);
router.patch("/", authenticate, validate(updateProfileSchema), updateProfile);
router.patch(
  "/image",
  authenticate,
  profileImageUpload.single("profileImage"),
  updateProfileImageController,
);
router.delete("/image", authenticate, removeProfileImageController);

export default router;
