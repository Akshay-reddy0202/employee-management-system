import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import { updateProfileSchema } from "./profile.schema.js";
import { getProfile, updateProfile } from "./profile.controller.js";

const router = Router();

router.get("/", authenticate, getProfile);

router.patch("/", authenticate, validate(updateProfileSchema), updateProfile);

export default router;
