import { z } from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Department name must be at least 2 characters"),

    code: z
      .string()
      .trim()
      .min(2, "Department code must be at least 2 characters")
      .max(10, "Department code cannot exceed 10 characters"),

    description: z
      .string()
      .trim()
      .max(100, "Description cannot exceed 100 characters"),

    status: z.enum(["Active", "Inactive"]),
  }),

  params: z.object({}).default({}),

  query: z.object({}).default({}),
});

export const updateDepartmentSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Department name must be at least 2 characters")
      .optional(),

    code: z
      .string()
      .trim()
      .min(2, "Department code must be at least 2 characters")
      .max(10, "Department code cannot exceed 10 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(100, "Description cannot exceed 100 characters")
      .optional(),

    status: z.enum(["Active", "Inactive"]).optional(),
  }),

  params: z.object({
    id: z.string().min(1, "Department ID is required"),
  }),

  query: z.object({}).default({}),
});
