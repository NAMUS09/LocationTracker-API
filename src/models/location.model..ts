import mongoose, { Document } from "mongoose";
const { Schema, model } = mongoose;

export interface ILocation extends Document {
  userId: string;
  latitude: string;
  longitude: string;
}

const locationSchema = new Schema(
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

const Location = model<ILocation>("Location", locationSchema);

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
