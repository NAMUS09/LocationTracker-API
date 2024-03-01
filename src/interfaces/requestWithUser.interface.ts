import { Request } from "express";
import { IUser } from "../models/user";

export default interface RequestWithUser extends Request {
  user: IUser;
}
