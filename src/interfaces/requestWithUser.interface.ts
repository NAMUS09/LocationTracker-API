import { Request } from "express";
import { IUser } from "../models/user.model";

export default interface RequestWithUser extends Request {
  user: IUser;
}
