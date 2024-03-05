import RequestWithUser from "../../../interfaces/requestWithUser.interface.js";
import { Location } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import { Response } from "express";

export default async (req: RequestWithUser, res: Response) => {
  const userId = req.user._id;

  var locations = await Location.find(
    { userId: userId },
    "-__v -userId -updatedAt"
  ).catch((err) => {
    return res.status(500).json(errorHelper("00008", req, err.message));
  });

  logger("00093", req.user._id!, getText("en", "00093"), "Info", req);

  return res.status(200).json({
    resultMessage: { en: getText("en", "00093") },
    resultCode: "00093",
    locations,
  });
};

/**
 * @swagger
 * /location/location-history:
 *    get:
 *      summary: location history of the user
 *      security:
 *          - Authorization: []
 *      tags:
 *        - Location
 *      responses:
 *        "200":
 *          description: All location history fetched successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
 *                          locations:
 *                              type: array
 *                              items:
 *                                $ref: '#/components/schemas/Location'
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
