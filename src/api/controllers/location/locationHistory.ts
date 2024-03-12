import RequestWithUser from "../../../interfaces/requestWithUser.interface.js";
import { Location } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import { Response } from "express";

export default async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user._id;

    let { limit, page } = req.body;

    limit ??= 5; // Number of documents to fetch per request
    page ??= 1;
    const skip = (page - 1) * limit; // Calculate the offset based on the current page

    const locations = await Location.aggregate([
      { $match: { userId: userId } },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          CapturedOn: { $toDate: "$createdAt" },
        },
      },
      {
        $project: {
          userId: 0,
          updatedAt: 0,
          __v: 0,
          createdAt: 0,
        },
      },
    ]);

    console.log(locations);

    logger("00093", req.user._id!, getText("en", "00093"), "Info", req);

    return res.status(200).json({
      resultMessage: { en: getText("en", "00093") },
      resultCode: "00093",
      page,
      locations,
    });
  } catch (error) {
    return res.status(500).json(errorHelper("00008", req, error.message));
  }
};

/**
 * @swagger
 * /location/location-history:
 *    post:
 *      summary: location history of the user
 *      security:
 *          - Authorization: []
 *      tags:
 *        - Location
 *      requestBody:
 *        description: Request body for pagination, specifying record limit and current page.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                limit:
 *                  type: number
 *                  nullable: true
 *                  default: null
 *                page:
 *                  type: number
 *                  nullable: true
 *                  default: null
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
