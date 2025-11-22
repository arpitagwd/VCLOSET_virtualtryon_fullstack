import express from "express";
import { createOrder, getUserOrders  } from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
// router.post("/confirm", confirmOrder); // Route for confirming orders and sending WhatsApp messages

export default router;
