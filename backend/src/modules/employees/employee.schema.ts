import z from "zod";

export const employeeSchema = z.object({
  body: z.object({}).default({}),

  params: z.object({}).default({}),

  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    pageSize: z.coerce.number().int().min(1).max(100).default(20),

    search: z.string().trim().optional(),

    departmentId: z.string().trim().min(1).optional(),

    designationId: z.string().trim().min(1).optional(),
  }),
});

export const updateEmployeeSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Employee ID is required"),
  }),

  body: z
    .object({
      managerId: z.string().trim().min(1).nullable().optional(),

      departmentId: z.string().trim().min(1).optional(),

      designationId: z.string().trim().min(1).optional(),

      salary: z.coerce.number().positive().optional(),

      joiningDate: z.coerce.date().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),

  query: z.object({}),
});

export type UpdateEmployeeBody = z.infer<typeof updateEmployeeSchema>["body"];

export type UpdateEmployeeParams = z.infer<
  typeof updateEmployeeSchema
>["params"];
