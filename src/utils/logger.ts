import { Log } from "../models/index";
import ipHelper from "./helpers/ip-helper";
import { Request } from "express";

export default async (
  code: string,
  userId: string,
  errorMessage: string,
  level: string,
  req: Request | "" = ""
) => {
  let ip = "no-ip";
  if (req && req !== null && typeof req !== "undefined") {
    ip = ipHelper(req);
  }
  ip = ipHelper(req);
  let log = new Log({
    resultCode: code,
    level: level,
    errorMessage: errorMessage,
    ip: ip,
  });

  if (userId !== "" && userId) log.userId = userId;

  await log.save().catch((err) => {
    console.log("Logging is failed: " + err);
  });
};
