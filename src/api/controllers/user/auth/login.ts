import { User, Token } from "../../../../models/index.js";
import { validateLogin } from "../../../validators/user.validator.js";
import {
  cookieAccessToken,
  cookieOptions,
  cookieRefreshToken,
} from "../../../../config/index.js";
import {
  errorHelper,
  getText,
  logger,
  generateAccessAndRefereshTokens,
} from "../../../../utils/index.js";
import RequestWithUser from "../../../../interfaces/requestWithUser.interface.js";
import { Response } from "express";
import { IUser } from "../../../../models/user.model.js";
import {
  cookieClient,
  cookieClientOptions,
} from "../../../../config/cookie.config.js";

export default async (req: RequestWithUser, res: Response) => {
  const { error } = validateLogin(req.body);
  if (error) {
    let code = "00038";
    if (error.details[0].message.includes("email")) code = "00039";
    else if (error.details[0].message.includes("password")) code = "00040";

    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }

  try {
    const { email, password } = req.body;
    const user = (await User.findOne({
      email,
    }).select("+password")) as IUser;

    if (!user || !user._id)
      return res.status(404).json(errorHelper("00042", req));

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid)
      return res.status(400).json(errorHelper("00045", req));

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    // update lastlogin date
    await User.updateOne(
      { userId: user._id },
      { $set: { lastLoginDate: Date.now() } }
    );

    //NOTE: 604800000 ms is equal to 7 days. So, the expiry date of the token is 7 days after.
    await Token.updateOne(
      { userId: user._id },
      {
        $set: {
          refreshToken: refreshToken,
          status: true,
          expiresIn: Date.now() + 604800000,
          createdAt: Date.now(),
        },
      },
      { upsert: true }
    ).catch((err) => {
      console.log(err.message);
      return res.status(500).json(errorHelper("00046", req, err.message));
    });

    logger("00047", user._id, getText("en", "00047"), "Info", req);

    const cookieClientValues = { _id: user._id, email };

    return res
      .status(200)
      .cookie(cookieAccessToken, accessToken, cookieOptions)
      .cookie(cookieRefreshToken, refreshToken, cookieOptions)
      .cookie(cookieClient, cookieClientValues, cookieClientOptions)
      .json({
        resultMessage: { en: getText("en", "00047") },
        resultCode: "00047",
        user,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    return res.status(500).json(errorHelper("00041", req, error.message));
  }
};

/**
 * @swagger
 * /user/login:
 *    post:
 *      summary: Login
 *      requestBody:
 *        description: Email and password information to login
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: You logged in successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
 *                          user:
 *                              $ref: '#/components/schemas/User'
 *                          accessToken:
 *                              type: string
 *                          refreshToken:
 *                              type: string
 *        "400":
 *          description: Please provide all the required fields!
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
