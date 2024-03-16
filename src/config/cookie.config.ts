import { CookieOptions } from "express";

const { DOMAIN } = process.env;
export const cookieOptions: CookieOptions = {
  domain: DOMAIN,
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export const cookieAccessToken = "accessToken";
export const cookieRefreshToken = "refreshToken";

export const cookieClientOptions: CookieOptions = {
  domain: DOMAIN,
  httpOnly: false,
  secure: true,
  sameSite: "none",
};
export const cookieClient = "user";
