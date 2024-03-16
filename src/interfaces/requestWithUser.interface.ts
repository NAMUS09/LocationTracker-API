import { Request } from "express";
import { IUser } from "../models/user.model.js";

export default interface RequestWithUser extends Request {
  user: IUser;
}
