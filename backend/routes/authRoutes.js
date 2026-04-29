import { Router } from "express";
import {
    login,
    getMe,
    logout
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/authMW.js";

const router = Router();

router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);

export default router;