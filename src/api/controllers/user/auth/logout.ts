import {
  cookieAccessToken,
  cookieClient,
  cookieClientOptions,
  cookieOptions,
  cookieRefreshToken,
} from "../../../../config/cookie.config";
import RequestWithUser from "../../../../interfaces/requestWithUser.interface.js";

import { getText, logger, removeToken } from "../../../../utils/index.js";
import { Response } from "express";

export default async (req: RequestWithUser, res: Response) => {
  const userId = req.user._id;

  //remove token
  await removeToken(userId);

  logger("00050", userId, getText("en", "00050"), "Info", req);

  return res
    .status(200)
    .clearCookie(cookieAccessToken, cookieOptions)
    .clearCookie(cookieRefreshToken, cookieOptions)
    .clearCookie(cookieClient, cookieClientOptions)
    .json({
      resultMessage: { en: getText("en", "00050") },
      resultCode: "00050",
    });
};

/**
 * @swagger
 * /user/logout:
 *    get:
 *      summary: Logout the User
 *      security:
 *          - Authorization: []
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: Successfully logged out.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "401":
 *          description: Invalid token.
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
