import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    loginDateTime: { type: Date, required: true, default: Date.now },
    logoutDateTime: { type: Date },
    deviceId: { type: String, required: true },
    status: { type: String, enum: ["logged_in", "logged_out"], default: "logged_in" },
});

export const LoginSession = mongoose.model("LoginSession", loginSchema);
