import { Token } from "../../../../models/index.js";
import { validateRefreshToken } from "../../../validators/user.validator.js";
import {
  errorHelper,
  getText,
  ipHelper,
  generateAccessAndRefereshTokens,
} from "../../../../utils/index.js";
import {
  cookieOptions,
  cookieAccessToken,
  cookieRefreshToken,
  refreshTokenSecretKey,
} from "../../../../config/index.js";
import pkg from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../../../../models/user.model.js";
import { IToken } from "../../../../models/token.model.js";
import { RequestWithUser } from "../../../../interfaces/index";
const { verify } = pkg;

export default async (req: RequestWithUser, res: Response) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  const { error } = validateRefreshToken({
    refreshToken: incomingRefreshToken,
  });
  if (error)
    return res
      .status(400)
      .json(errorHelper("00059", req, error.details[0].message));

  try {
    req.user = verify(incomingRefreshToken, refreshTokenSecretKey) as IUser;

    const userToken = (await Token.findOne({ userId: req.user._id })) as IToken;

    if (userToken.refreshToken !== incomingRefreshToken || !userToken)
      return res.status(404).json(errorHelper("00061", req));

    if (userToken.expiresIn <= Date.now() || !userToken.status)
      return res.status(400).json(errorHelper("00062", req));

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      req.user._id!
    );

    await Token.updateOne(
      { userId: req.user._id },
      {
        $set: {
          refreshToken: refreshToken,
          createdByIp: ipHelper(req),
          createdAt: Date.now(),
          expires: Date.now() + 604800000,
          status: true,
        },
      }
    );

    return res
      .status(200)
      .cookie(cookieAccessToken, accessToken, cookieOptions)
      .cookie(cookieRefreshToken, refreshToken, cookieOptions)
      .json({
        resultMessage: { en: getText("en", "00065") },
        resultCode: "00065",
        accessToken,
        refreshToken,
      });
  } catch (err) {
    return res.status(400).json(errorHelper("00063", req, err.message));
  }
};

/**
 * @swagger
 * /user/refresh-token:
 *    post:
 *      summary: Refreshes the Access Token
 *      requestBody:
 *        description: Valid Refresh Token
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                refreshToken:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: The token is refreshed successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
 *                          accessToken:
 *                              type: string
 *                          refreshToken:
 *                              type: string
 *        "400":
 *          description: Please provide refresh token.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "500":
 *          description: An internal server error occurred, please try again.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 */