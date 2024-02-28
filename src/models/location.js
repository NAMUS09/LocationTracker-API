import mongoose from "mongoose";
const { Schema, model } = mongoose;

const locationSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Location = model("Location", locationSchema);

export default Location;

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the location.
 *         latitude:
 *           type: number
 *           description: The latitude coordinate of the location.
 *         longitude:
 *           type: number
 *           description: The longitude coordinate of the location.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the location was recorded.
 */
