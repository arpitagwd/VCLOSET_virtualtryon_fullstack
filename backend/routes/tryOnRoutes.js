import express from "express";
import { createTryOnSession, getUserTryOns } from "../controllers/tryOnController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTryOnSession);
router.get("/", protect, getUserTryOns);

export default router;
