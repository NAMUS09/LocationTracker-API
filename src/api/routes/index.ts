import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import { specs, swaggerConfig } from "../../config/index.js";
import user from "./user";
import location from "./location";

const router = Router();

const specDoc = swaggerJsdoc(swaggerConfig);

router.use(
  specs,
  serve,
  setup(specDoc, {
    swaggerUrl: specs,
  })
);

router.use("/user", user);
router.use("/location", location);

export default router;
