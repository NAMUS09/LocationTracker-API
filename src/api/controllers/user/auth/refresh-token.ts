import { Token } from "../../../../models/index";
import { validateRefreshToken } from "../../../validators/user.validator";
import {
  errorHelper,
  getText,
  ipHelper,
  generateAccessAndRefereshTokens,
  removeToken,
} from "../../../../utils/index";
import {
  cookieOptions,
  cookieAccessToken,
  cookieRefreshToken,
  refreshTokenSecretKey,
} from "../../../../config/index";
import pkg from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../../../../models/user.model";
import { IToken } from "../../../../models/token.model";
import { RequestWithUser } from "../../../../interfaces/index";
import {
  cookieClient,
  cookieClientOptions,
} from "../../../../config/cookie.config";

const { verify } = pkg;

export default async (req: RequestWithUser, res: Response) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    const { error } = validateRefreshToken({
      refreshToken: incomingRefreshToken,
    });

    if (error) {
      errorHelper("00059", req, error.details[0].message);
      throw new Error(`${error.details[0].message}`);
    }

    req.user = verify(incomingRefreshToken, refreshTokenSecretKey) as IUser;

    const userToken = (await Token.findOne({ userId: req.user._id })) as IToken;

    if (!userToken || userToken.refreshToken !== incomingRefreshToken) {
      errorHelper("00061", req);
      throw new Error(getText("en", "00061"));
    }

    if (userToken.expiresIn <= Date.now() || !userToken.status) {
      errorHelper("00062", req);
      throw new Error(getText("en", "00062"));
    }

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
    if (req.user._id) await removeToken(req.user._id);

    return res
      .status(401)
      .clearCookie(cookieAccessToken, cookieOptions)
      .clearCookie(cookieRefreshToken, cookieOptions)
      .clearCookie(cookieClient, cookieClientOptions)
      .json(errorHelper("00063", req, err.message));
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
