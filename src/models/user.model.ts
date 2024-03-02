import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  accessTokenExpiry,
  jwtSecretKey,
  refreshTokenExpiry,
  refreshTokenSecretKey,
} from "../config";

const { Schema, model } = mongoose;

export interface IUser extends Document {
  _id?: string;
  email: string;
  password: string;
  username?: string;
  name: string;
  language: "en";
  gender?: "male" | "female" | "other";
  birthDate?: Date;
  lastLoginDate?: number;
  isPasswordCorrect(password: any): Promise<boolean>;
  generateAccessToken(): unknown;
  generateRefreshToken(): unknown;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["en"],
      default: "en",
    },
    //NOTE: You can change the gender options acc. to your needs in the app.
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    birthDate: {
      type: Date,
    },
    lastLoginDate: {
      type: Date,
    },
    //NOTE: In case the user delete its account, you can store its non-personalized information anonymously.
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    jwtSecretKey,
    {
      expiresIn: accessTokenExpiry,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecretKey,
    {
      expiresIn: refreshTokenExpiry,
    }
  );
};

const User = model("User", userSchema);
export default User;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         language:
 *           type: string
 *           enum: ['en']
 *         gender:
 *           type: string
 *           enum: ['male', 'female', 'other']
 *         birthDate:
 *           type: string
 *         deletedAt:
 *           type: string
 */
