import pkg from "jsonwebtoken";
const { sign } = pkg;
import { jwtSecretKey, refreshTokenSecretKey } from "../../config/index.js";

export function signAccessToken(userId: string) {
  const accessToken = sign({ _id: userId }, jwtSecretKey!, {
    expiresIn: "1h",
  });
  return accessToken;
}
export function signRefreshToken(userId: string) {
  const refreshToken = sign({ _id: userId }, refreshTokenSecretKey!, {
    expiresIn: "7d",
  });
  return refreshToken;
}
export function signConfirmCodeToken(userId: string, confirmCode: string) {
  const confirmCodeToken = sign(
    { _id: userId, code: confirmCode },
    jwtSecretKey!,
    {
      expiresIn: "5m",
    }
  );
  return confirmCodeToken;
}
