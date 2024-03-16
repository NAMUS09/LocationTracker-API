import mongooseLoader from "./mongoose";
import expressLoader from "./express";
import { Express } from "express";

export default async (app: Express) => {
  await mongooseLoader();
  expressLoader(app);
};
