import { Log } from "../models/index.js";
import ipHelper from "./helpers/ip-helper.js";
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
