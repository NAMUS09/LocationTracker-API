import { RequestHandler, Router } from "express";
import { locationHistory, saveLocation } from "../controllers/location/index";
import { auth } from "../middlewares/index";

const router = Router();

// Protected Routes
router.post(
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
