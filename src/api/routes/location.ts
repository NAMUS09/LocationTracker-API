import { Router } from "express";
import {
  locationHistory,
  saveLocation,
} from "../controllers/location/index.js";
import { auth } from "../middlewares/index.js";

const router = Router();

// Protected Routes
router.get("/location-history", auth as any, locationHistory);
router.post("/save-location", auth as any, saveLocation);

export default router;
