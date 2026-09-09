import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import { getEmployees, updateEmployee } from "./employee.controller.js";
import { employeeSchema, updateEmployeeSchema } from "./employee.schema.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.get("/", authenticate, validate(employeeSchema), getEmployees);
router.patch(
  "/:id",
  authenticate,
  authorize("Admin"),
  validate(updateEmployeeSchema),
  updateEmployee,
);

export default router;
