import { Error } from "mongoose";
import { User } from "../../models";
import { IUser } from "../../models/user.model";
import logger from "../logger";

const generateAccessAndRefereshTokens = async (userId: string) => {
  try {
    const user = (await User.findById(userId)) as IUser;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    logger("00003", "", error.message, "Uncaught Exception", "");
    throw new Error("Failed to generate tokens");
  }
};

export default generateAccessAndRefereshTokens;
