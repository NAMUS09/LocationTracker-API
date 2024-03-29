import { User } from "../../../../models/index.js";
import { validateRegister } from "../../../validators/user.validator.js";
import { Response } from "express";
import {
  errorHelper,
  logger,
  getText,
  generateRandomCode,
} from "../../../../utils/index.js";
import RequestWithUser from "../../../../interfaces/requestWithUser.interface.js";

export default async (req: RequestWithUser, res: Response) => {
  const { error } = validateRegister(req.body);
  if (error) {
    let code = "00025";
    if (error.details[0].message.includes("email")) code = "00026";
    else if (error.details[0].message.includes("password")) code = "00027";
    else if (error.details[0].message.includes("name")) code = "00028";

    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }

  const exists = await User.exists({ email: req.body.email }).catch((err) => {
    return res.status(500).json(errorHelper("00031", req, err.message));
  });

  if (exists) return res.status(409).json(errorHelper("00032", req));

  const { name, email, password, language } = req.body;

  let username = "";
  let tempName = "";
  let existsUsername = true;

  if (name.includes(" ")) {
    tempName = name.trim().split(" ").slice(0, 1).join("").toLowerCase();
  } else {
    tempName = name.toLowerCase().trim();
  }

  do {
    username = tempName + generateRandomCode(4);
    var findUser = await User.exists({ username: username }).catch((err) => {
      return res.status(500).json(errorHelper("00033", req, err.message));
    });
    existsUsername = findUser !== null;
  } while (existsUsername);

  const user = new User({
    email,
    password,
    name,
    username,
    language,
    lastLoginDate: Date.now(),
  });

  try {
    const savedUser = await user.save();

    const fetchUser = await User.findById({ _id: savedUser.id }).select(
      "-password"
    );
    //savedUser.password = null;
    logger(
      "00035",
      user._id as unknown as string,
      getText("en", "00035"),
      "Info",
      req
    );

    return res.status(200).json({
      resultMessage: { en: getText("en", "00035") },
      resultCode: "00035",
      fetchUser,
    });
  } catch (err) {
    return res.status(500).json(errorHelper("00034", req, err.message));
  }
};

/**
 * @swagger
 * /user/register:
 *    post:
 *      summary: Registers the user
 *      requestBody:
 *        description: All required information about the user
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
 *                name:
 *                  type: string
 *                language:
 *                  type: string
 *                  enum: ['en']
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: You registered successfully.
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
