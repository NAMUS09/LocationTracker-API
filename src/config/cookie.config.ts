import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export const cookieAccessToken = "accessToken";
export const cookieRefreshToken = "refreshToken";
