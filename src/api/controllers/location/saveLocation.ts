import RequestWithUser from "../../../interfaces/requestWithUser.interface.js";
import { Location } from "../../../models/index.js";
import { ILocation } from "../../../models/location.model.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import { validateLocation } from "../../validators/location.validator.js";
import { Response } from "express";

export default async (req: RequestWithUser, res: Response) => {
  const { error } = validateLocation(req.body);
  if (error) {
    const code = error.details[0].message.includes("longitude")
      ? "00095"
      : "00096";
    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }

  try {
    const {
      longitude,
      latitude,
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
    } = req.body as ILocation;

    const location = new Location({
      userId: req.user._id,
      accuracy,
      altitude,
      altitudeAccuracy,
      longitude,
      latitude,
      heading,
    });

    await location.save();

    logger("00093", req.user._id!, getText("en", "00094"), "Info", req);

    return res.status(200).json({
      resultMessage: { en: getText("en", "00094") },
      resultCode: "00094",
    });
  } catch (error) {
    return res.status(500).json(errorHelper("00008", req, error.message));
  }
};

/**
 * @swagger
 * /location/save-location:
 *    post:
 *      summary: save the location of the user
 *      security:
 *          - Authorization: []
 *      requestBody:
 *        description: All required information about the user
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                longitude:
 *                  type: string
 *                  required: true
 *                latitude:
 *                  type: string
 *                  required: true
 *                accuracy:
 *                  type: number
 *                  nullable: true
 *                  default: null
 *                altitude:
 *                  type: number
 *                  nullable: true
 *                  default: null
 *                altitudeAccuracy:
 *                  type: number
 *                  nullable: true
 *                  default: null
 *                heading:
 *                  type: number
 *                  nullable: true
 *                  default: null
 *      tags:
 *        - Location
 *      responses:
 *        "200":
 *          description: location saved successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
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
