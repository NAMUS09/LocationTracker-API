import { Location } from "../../../models/index.js";
import { errorHelper } from "../../../utils/index.js";

export default async (req, res) => {
  const userId = req.user._id;

  var locations = await Location.find({ userId: userId }).catch((err) => {
    console.log(err.message);
    return res.status(500).json(errorHelper("00008", req, err.message));
  });

  res.status(200).json({
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
