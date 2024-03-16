export { default as swaggerConfig } from "./swagger.config.js";
export {
  cookieOptions,
  cookieAccessToken,
  cookieRefreshToken,
} from "./cookie.config.js";
import { CorsOptions } from "cors";
import { config } from "dotenv";

config();

//NOTE: If you are running the project in an instance, you should store these secret keys in its configuration settings.
// This type of storing secret information is only experimental and for the purpose of local running.

const {
  DB_URI,
  PORT,
  JWT_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  APP_ORIGIN,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} = process.env;

export const port = PORT || 3000;
export const jwtSecretKey = JWT_SECRET_KEY!;
export const refreshTokenSecretKey = REFRESH_TOKEN_SECRET_KEY!;
export const accessTokenExpiry = ACCESS_TOKEN_EXPIRY!;
export const refreshTokenExpiry = REFRESH_TOKEN_EXPIRY!;
export const dbUri = DB_URI!;
export const appOrigin = APP_ORIGIN;

export const corsOptions: CorsOptions = {
  origin: APP_ORIGIN,
  credentials: true,
};

export const apiVersion = "v1";
export const prefix = "/api/" + apiVersion;

export const specs = "/docs";
