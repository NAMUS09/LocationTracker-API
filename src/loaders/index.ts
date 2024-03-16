import mongooseLoader from "./mongoose.js";
import expressLoader from "./express.js";
import { Express } from "express";

export default async (app: Express) => {
  await mongooseLoader();
  expressLoader(app);
};
