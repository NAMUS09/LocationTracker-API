import { Request } from "express";

export default (req: Request | ""): string => {
  if (req === "") return "";

  return req.headers["x-forwarded-for"]
    ? (req.headers["x-forwarded-for"] as string).split(/, /)[0]
    : req.ip || "";
};
