import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "./department.controller.js";
import {
  createDepartmentSchema,
  idParamSchema,
  updateDepartmentSchema,
} from "./department.schema.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("Admin"),
  validate(createDepartmentSchema),
  create,
);
router.get("/", authenticate, getAll);
router.get("/:id", authenticate, validate(idParamSchema), getById);
router.patch(
  "/:id",
  authenticate,
  authorize("Admin"),
  validate(updateDepartmentSchema),
  update,
);
router.delete(
  "/:id",
  authenticate,
  authorize("Admin"),
  validate(idParamSchema),
  remove,
);
export default router;
