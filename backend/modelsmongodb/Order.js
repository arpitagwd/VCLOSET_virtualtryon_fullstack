import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, unique: true, required: true },
    items: [
        { 
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true }
        }
    ],
    shippingAddress: { type: String, required: true },
    billingAddress: { type: String, required: true },
    useSameAddress: { type: Boolean, default: true },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: "Processing" }, // New field for tracking status

    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
    paymentMethod: { type: String, enum: ["Credit Card", "PayPal", "COD"], required: true },
    trackingNumber: { type: String, unique: true, sparse: true },
});

export const Order = mongoose.model("Order", orderSchema);
