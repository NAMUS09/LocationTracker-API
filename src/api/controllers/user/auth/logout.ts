import {
  cookieAccessToken,
  cookieOptions,
  cookieRefreshToken,
} from "../../../../config/cookie.config.js";
import RequestWithUser from "../../../../interfaces/requestWithUser.interface.js";
import { Token } from "../../../../models/index.js";
import { errorHelper, getText, logger } from "../../../../utils/index.js";
import { Response } from "express";

export default async (req: RequestWithUser, res: Response) => {
  await Token.updateOne(
    { userId: req.user._id },
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      $set: { status: false, expiresIn: Date.now() },
      new: true,
    }
  ).catch((err) => {
    return res.status(500).json(errorHelper("00049", req, err.message));
  });

  logger("00050", req.user._id!, getText("en", "00050"), "Info", req);

  return res
    .status(200)
    .clearCookie(cookieAccessToken, cookieOptions)
    .clearCookie(cookieRefreshToken, cookieOptions)
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
