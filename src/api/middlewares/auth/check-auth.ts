import pkg from "mongoose";
import jwt from "jsonwebtoken";
import { User, Token } from "../../../models/index.js";
import { errorHelper } from "../../../utils/index.js";
import { jwtSecretKey } from "../../../config/index.js";
import { Response, NextFunction } from "express";
import { IUser } from "../../../models/user.js";
import { RequestWithUser } from "../../../interfaces/index.js";

const { Types } = pkg;
const { verify } = jwt;

export default async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json(errorHelper("00006", req));

  try {
    req.user = verify(token, jwtSecretKey!) as IUser;
    if (!Types.ObjectId.isValid(req.user._id!))
      return res.status(400).json(errorHelper("00007", req));

    const exists = await User.exists({
      _id: req.user._id,
    }).catch((err) => {
      return res.status(500).json(errorHelper("00008", req, err.message));
    });

    if (!exists) return res.status(400).json(errorHelper("00009", req));

    const tokenExists = await Token.exists({
      userId: req.user._id,
      status: true,
    }).catch((err) => {
      return res.status(500).json(errorHelper("00010", req, err.message));
    });

    if (!tokenExists) return res.status(401).json(errorHelper("00011", req));

    next();
  } catch (err) {
    return res.status(401).json(errorHelper("00012", req, err.message));
  }
};
