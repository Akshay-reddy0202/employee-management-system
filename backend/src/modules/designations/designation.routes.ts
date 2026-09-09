import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { create, getAll, update } from "./designation.controller.js";
import {
  createDesignationSchema,
  updateDesignationSchema,
} from "./designation.schema.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("Admin"),
  validate(createDesignationSchema),
  create,
);
router.get("/", authenticate, getAll);
router.patch(
  "/:id",
  authenticate,
  authorize("Admin"),
  validate(updateDesignationSchema),
  update,
);
export default router;
