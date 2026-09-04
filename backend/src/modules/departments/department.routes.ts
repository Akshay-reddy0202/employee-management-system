import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { create, getAll, getById, remove, update } from "./department.controller.js";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "./department.schema.js";

const router = Router();

router.post("/", validate(createDepartmentSchema), create);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", validate(updateDepartmentSchema), update);
router.delete("/:id", remove);
export default router;
