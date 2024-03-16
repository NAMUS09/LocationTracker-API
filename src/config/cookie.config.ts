import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: true,
};

export const cookieAccessToken = "accessToken";
export const cookieRefreshToken = "refreshToken";

export const cookieClientOptions: CookieOptions = {
  domain: ".vercel.app",
  httpOnly: false,
  secure: true,
  sameSite: "none",
};
export const cookieClient = "user";
