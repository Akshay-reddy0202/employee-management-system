import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      role: z.enum(["Admin", "Employee"], {
        message: "Please select a valid role",
      }),

      fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name cannot exceed 100 characters"),
      emailID: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address"),

      dateOfBirth: z.string().min(1, "Date of birth is required"),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters"),

      confirmPassword: z.string(),

      termsAccepted: z.literal(true, {
        message: "You must accept the Terms & Conditions",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),

  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    employeeId: z.string().trim().min(1, "Employee ID is required"),

    password: z.string().min(1, "Password is required"),
  }),
  params: z.object({}).default({}),

  query: z.object({}).default({}),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),

  params: z.object({}).default({}),

  query: z.object({}).default({}),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    emailID: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),
  }),

  params: z.object({}).default({}),

  query: z.object({}).default({}),
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().min(1, "Reset token is required"),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters"),

      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),

  params: z.object({}).default({}),

  query: z.object({}).default({}),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),

  params: z.object({}).default({}),

  query: z.object({}).default({}),
});
