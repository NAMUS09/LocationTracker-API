import mongoose, { Document } from "mongoose";
const { Schema, model } = mongoose;

export interface IToken extends Document {
  userId: string;
  refreshToken: string;
  expiresIn: number;
  createdByIp: string;
  status: boolean;
}

const tokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, required: true },
    expiresIn: { type: Date, required: true },
    createdByIp: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Token = model<IToken>("Token", tokenSchema);

export default Token;
