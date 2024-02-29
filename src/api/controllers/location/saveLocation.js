import { Location } from "../../../models/index.js";
import { errorHelper, logger } from "../../../utils/index.js";
import { validateLocation } from "../../validators/location.validator.js";

export default async (req, res) => {
  const { error } = validateLocation(req.body);
  if (error) {
    const code = error.details[0].message.includes("longitude")
      ? "00095"
      : "00096";
    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }

  let location = new Location({
    userId: req.user._id,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
  });

  location = await location.save().catch((err) => {
    return res.status(500).json(errorHelper("00008", req, err.message));
  });

  logger("00093", user._id, getText("en", "00094"), "Info", req);

  res.status(200).json({
    resultMessage: { en: getText("en", "00094") },
    resultCode: "00094",
  });
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
 *                latitude:
 *                  type: string
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
