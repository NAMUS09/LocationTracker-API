import { Error } from "mongoose";
import { Token, User } from "../../models/index.js";
import { IUser } from "../../models/user.model.js";
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

const removeToken = async (userId: string) => {
  try {
    await Token.updateOne(
      { userId: userId },
      {
        $unset: { refreshToken: 1 },
        $set: { status: false, expiresIn: Date.now() },
      },
      { new: true }
    );

    return true;
  } catch (error) {
    logger("00003", "", error.message, "Uncaught Exception", "");
    throw new Error("Failed to remove tokens");
  }
};

export { generateAccessAndRefereshTokens, removeToken };
