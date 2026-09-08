import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z
    .object({
      skills: z.array(z.string().trim()).optional(),

      address: z.string().trim().optional(),

      phoneNumber: z.string().trim().optional(),
    })
    .refine(
      (data) => Object.values(data).some((value) => value !== undefined),
      {
        message: "At least one field is required to update the profile",
      },
    ),

  params: z.object({}),

  query: z.object({}),
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>["body"];
