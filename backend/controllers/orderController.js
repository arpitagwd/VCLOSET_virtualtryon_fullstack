import { Order } from "../modelsmongodb/Order.js";
import asyncHandler from "express-async-handler";
// import sendWhatsAppMessage from "../utils/sendWhatsapp.js";


// export const confirmOrder = asyncHandler( async (req, res) => {
//     const { userPhoneNumber, orderId, totalAmount } = req.body;

//     try {
//         const message = `Your order #${orderId} has been confirmed! Total: ₹${totalAmount}. Thank you for shopping with VCloset.`;
        
//         await sendWhatsAppMessage(userPhoneNumber, message);

//         res.status(200).json({ success: true, message: "Order confirmed and WhatsApp notification sent" });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Order confirmed but failed to send WhatsApp notification" });
//     }
// });



// Create an order
export const createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress, billingAddress, totalAmount, paymentMethod } = req.body;

    const order = await Order.create({
        userId: req.user._id,
        orderId: `ORD-${Date.now()}`,
        items,
        shippingAddress,
        billingAddress,
        useSameAddress: shippingAddress === billingAddress,
        totalAmount,
        paymentMethod,
    });

    res.status(201).json(order);
});

// // Get user's orders
// export const getUserOrders = asyncHandler(async (req, res) => {
//     const orders = await Order.find({ userId: req.user._id }).populate("items.productId");
//     res.json(orders);
// });

export const getUserOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate("items.productId", "name price") // Populate product details
            .sort({ createdAt: -1 }); // Show latest orders first

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found." });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error. Could not fetch orders." });
    }
});

