import { Router } from "express";
import { locationHistory } from "../controllers/location/index.js";
import { auth } from "../middlewares/index.js";

const router = Router();

// Protected Routes
router.get("/location-history", auth, locationHistory);

export default router;
