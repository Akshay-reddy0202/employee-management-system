import { env } from "../config/env.js";

const durationToMilliseconds = (duration: string): number => {
    const match = duration.match(/^(\d+)([smhd])$/);
  
    if (!match) {
      throw new Error(`Invalid token duration: ${duration}`);
    }
  
    const [, value, unit] = match;
  
    const durationValue = Number(value);
  
    const unitInMilliseconds = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
  
    return durationValue * unitInMilliseconds[unit as keyof typeof unitInMilliseconds];
  };
  
  export const getRefreshTokenExpiresAt = (): Date => {
    const expiresInMilliseconds = durationToMilliseconds(
      env.JWT_REFRESH_EXPIRES,
    );
  
    return new Date(Date.now() + expiresInMilliseconds);
  };
  
  export const getRefreshTokenMaxAge = (): number => {
    return durationToMilliseconds(env.JWT_REFRESH_EXPIRES);
  };