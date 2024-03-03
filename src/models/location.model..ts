import mongoose, { Document } from "mongoose";
const { Schema, model } = mongoose;

export interface ILocation extends Document {
  userId: string;
  accuracy?: number | null;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  latitude: number;
  longitude: number;
}

const locationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accuracy: {
      type: Number,
    },
    altitude: {
      type: Number,
    },
    altitudeAccuracy: {
      type: Number,
    },
    heading: { type: Number },
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
 *         accuracy:
 *           type: number
 *         altitude:
 *           type: number
 *         altitudeAccuracy:
 *           type: number
 *         heading:
 *           type: number
 *         latitude:
 *           type: number
 *           description: The latitude coordinate of the location.
 *         longitude:
 *           type: number
 *           description: The longitude coordinate of the location.
 */
