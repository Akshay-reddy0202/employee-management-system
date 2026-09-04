import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { create, getAll, update } from "./designation.controller.js";
import {
  createDesignationSchema,
  updateDesignationSchema,
} from "./designation.schema.js";

const router = Router();

router.post("/", validate(createDesignationSchema), create);
router.get("/", getAll);
router.patch("/:id", validate(updateDesignationSchema), update);
export default router;
