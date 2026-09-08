import { env } from "./env.js";
import { getRefreshTokenMaxAge } from "../utils/token-expiry.js";

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/auth",
  maxAge: getRefreshTokenMaxAge(),
};

export const clearRefreshTokenCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/auth",
};
