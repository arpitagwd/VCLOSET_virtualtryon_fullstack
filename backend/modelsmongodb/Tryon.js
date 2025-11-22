import mongoose from "mongoose";

const tryOnSchema = new mongoose.Schema({
    tryId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    // startTime: { type: Date, default: Date.now },
    duration: { type: Number, required: true },
    // metadata: { type: Object },
}, { timestamps: true });

// Middleware to validate duration
tryOnSchema.pre("save", function (next) {
    if (this.duration < 1) {
        return next(new Error("Duration must be at least 1 second."));
    }
    next();
});

export const TryOn = mongoose.model("TryOn", tryOnSchema);
