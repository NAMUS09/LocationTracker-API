import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  domain: ".vercel.app",
  httpOnly: true,
  secure: true,
  sameSite: "none",
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
