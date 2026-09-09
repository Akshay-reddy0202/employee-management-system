import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1),

  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),

  JWT_ACCESS_EXPIRES: z.string().min(1, "JWT_ACCESS_EXPIRES is required"),

  JWT_REFRESH_EXPIRES: z.string().min(1, "JWT_REFRESH_EXPIRES is required"),

  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),

  SMTP_PORT: z.coerce.number().default(587),

  SMTP_USER: z.string().min(1, "SMTP_USER is required"),

  SMTP_PASSWORD: z.string().min(1, "SMTP_PASSWORD is required"),

  SMTP_FROM: z.string().min(1, "SMTP_FROM is required"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),

  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),

  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = parsedEnv.data;
