import jwt from "jsonwebtoken";
import { User, Token } from "../../../models/index";
import { errorHelper } from "../../../utils/index";
import { jwtSecretKey } from "../../../config/index";
import { Response, NextFunction } from "express";
import { IUser } from "../../../models/user.model";
import { RequestWithUser } from "../../../interfaces/index";

export default async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json(errorHelper("00006", req));

    const decodedToken = jwt.verify(token, jwtSecretKey) as IUser;

    const user = (await User.findById(decodedToken._id).select(
      "-password"
    )) as IUser;

    if (!user) return res.status(401).json(errorHelper("00007", req));

    const tokenExists = await Token.exists({
      userId: user._id,
      status: true,
    });
    if (!tokenExists) return res.status(401).json(errorHelper("00011", req));

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json(errorHelper("00012", req, err.message));
  }
};
