import { RequestHandler, Router } from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/user/index.js";
import { auth } from "../middlewares/index.js";
import getUser from "../controllers/user/get-user.js";

const router = Router();

// AUTH
router.post("/register", register as unknown as RequestHandler);
router.post("/login", login as unknown as RequestHandler);
router.get(
  "/logout",
  auth as unknown as RequestHandler,
  logout as unknown as RequestHandler
);
router.post("/refresh-token", refreshToken as unknown as RequestHandler);
// router.post("/forgot-password", auth, forgotPassword);

// EDIT
// router.post("/change-password", auth, changePassword);

router.get(
  "/",
  auth as unknown as RequestHandler,
  getUser as unknown as RequestHandler
);
// router.delete("/", auth, deleteUser);

export default router;
