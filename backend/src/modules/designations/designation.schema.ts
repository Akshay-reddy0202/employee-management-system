import { z } from "zod";

export const createDesignationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Designation name must be at least 2 characters"),

    status: z.enum(["Active", "Inactive"]),
  }),

  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const updateDesignationSchema = z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(2, "Designation name must be at least 2 characters")
        .optional(),
  
      status: z.enum(["Active", "Inactive"]).optional(),
    }),
  
    params: z.object({
      id: z.string().min(1, "Designation ID is required"),
    }),
  
    query: z.object({}).default({}),
  });