import { RequestHandler, Router } from "express";
import {
  locationHistory,
  saveLocation,
} from "../controllers/location/index.js";
import { auth } from "../middlewares/index.js";

const router = Router();

// Protected Routes
router.get(
  "/location-history",
  auth as unknown as RequestHandler,
  locationHistory as unknown as RequestHandler
);
router.post(
  "/save-location",
  auth as any,
  saveLocation as unknown as RequestHandler
);

export default router;
