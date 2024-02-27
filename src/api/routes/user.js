import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/user/index.js";
import { auth } from "../middlewares/index.js";

const router = Router();

// AUTH
router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/refresh-token", refreshToken);
// router.post("/forgot-password", auth, forgotPassword);

// EDIT
// router.post("/change-password", auth, changePassword);

// router.get("/", auth, getUser);
// router.delete("/", auth, deleteUser);

export default router;
