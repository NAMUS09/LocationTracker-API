import { ErrorRequestHandler, NextFunction, Response } from "express";
import { logger } from "../utils";
import { RequestWithUser } from "../interfaces";

export const errorHandler = <ErrorRequestHandler>(
  function (error, req: RequestWithUser, res: Response, next: NextFunction) {
    res.status(error.status || 500);
    let resultCode = "00015";
    let level = "External Error";
    if (error.status === 500) {
      resultCode = "00013";
      level = "Server Error";
    } else if (error.status === 404) {
      resultCode = "00014";
      level = "Client Error";
    }
    logger(resultCode, req?.user?._id ?? "", error.message, level, req);

    res.json({
      resultMessage: {
        en: error.message,
      },
      resultCode: resultCode,
    });

    //next(error);
  }
);

export default errorHandler;
