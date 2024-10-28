import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/authController.js";
import  verifyToken  from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/multerMiddleware.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", upload.single("profileImage"), signup);

router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
