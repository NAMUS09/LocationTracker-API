import { Express } from "express";
import cors from "cors";
import compression from "compression";
import bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "../api/routes/index.js";
import { logger } from "../utils/index.js";
import { jwtSecretKey } from "../config/index.js";
import errorHandler from "../middlewares/error.js";
import { appOrigin, corsOptions, prefix } from "../config/index.js";
import { CustomError, RequestWithUser } from "../interfaces/index.js";

export default (app: Express) => {
  process.on("uncaughtException", async (error: Error) => {
    // console.log(error);
    logger("00001", "", error.message, "Uncaught Exception", "");
  });

  process.on("unhandledRejection", async (ex: Error) => {
    // console.log(ex);
    logger("00002", "", ex.message, "Unhandled Rejection", "");
  });

  if (!jwtSecretKey) {
    logger("00003", "", "Jwtprivatekey is not defined", "Process-Env", "");
    process.exit(1);
  }

  app.enable("trust proxy");
  app.use(cors(corsOptions));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan("combined"));
  app.use(helmet());
  app.use(compression());
  app.use(express.static("public"));
  app.use(cookieParser());
  app.disable("x-powered-by");
  app.disable("etag");

  app.use(prefix, routes);

  app.get("/", (_req: Request, res: Response) => {
    return res
      .status(200)
      .json({
        resultMessage: {
          en: "Project is successfully working...",
        },
        resultCode: "00004",
      })
      .end();
  });

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin!);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Content-Security-Policy-Report-Only", "default-src: https:");

    // Set Access-Control-Allow-Credentials to true
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      res.setHeader(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  });

  app.use((_req: Request, _res: Response, next: NextFunction) => {
    const error = new Error("Endpoint could not find!") as CustomError;
    error.status = 404;
    next(error);
  });

  // Error handling
  app.use(errorHandler);
};
