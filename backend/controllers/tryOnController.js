import { TryOn } from "../modelsmongodb/Tryon.js";
import asyncHandler from "express-async-handler";

// Create a new Try-On session
export const createTryOnSession = asyncHandler(async (req, res) => {
    const { itemId, duration } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: "User not found" });
    }

    const tryOnSession = await TryOn.create({
        tryId: `TRY-${Date.now()}`,
        userId: req.user._id,
        itemId,
        duration,
    });
    console.log("✅ Try-On session created:", tryOnSession);

    // Emit real-time update via WebSocket
    io.emit(`tryon_update_${req.user._id}`, tryOnSession); // Send update to frontend

    res.status(201).json({ message: "Try-On session started", session: tryOnSession });
});

// Get user's Try-On sessions
export const getUserTryOns = asyncHandler(async (req, res) => {
    const sessions = await TryOn.find({ userId: req.user._id }).populate("itemId");
    res.status(200).json(sessions);
});
