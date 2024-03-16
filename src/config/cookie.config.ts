import { CookieOptions } from "express";

const { DOMAIN } = process.env;
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
};

export const cookieAccessToken = "accessToken";
export const cookieRefreshToken = "refreshToken";

export const cookieClientOptions: CookieOptions = {
  httpOnly: false,
  secure: true,
  sameSite: "lax",
};
export const cookieClient = "user";
