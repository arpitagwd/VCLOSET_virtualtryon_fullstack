import express from "express";
import { addToCart, getCartItems } from "../controllers/cartController.js"; 
import protect from "../middleware/authMiddleware.js"; 
import Cart from "../modelsmongodb/Cart.js";

const router = express.Router();

router.post("/add", protect, addToCart);  // Ensure this is present
router.get("/", protect, getCartItems);

// Clear entire cart for a user
router.delete("/clear", protect, async (req, res) => {
    try {
        console.log("🔄 Received request to clear cart for user:", req.user._id);
        
        const cart = await Cart.findOne({ user_id: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Clear the entire items array
        cart.items = [];
        await cart.save();

        console.log("✅ Cart cleared successfully for user:", req.user._id);
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error("❌ Error clearing cart:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.delete("/:id", protect, async (req, res) => {
    try {
        console.log(`🗑️ Received request to delete cart item with ID: ${req.params.id}`);
        console.log(`🔑 User ID from token: ${req.user._id}`);

        // Find the cart for the user (use `user_id`)
        const cart = await Cart.findOne({ user_id: req.user._id });

        if (!cart) {
            console.error(`❌ Cart not found for user: ${req.user._id}`);
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the index of the item in the cart
        const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.id);

        if (itemIndex === -1) {
            console.error(`❌ Item ID ${req.params.id} not found in cart`);
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);
        await cart.save();

        console.log(`✅ Item ${req.params.id} removed from cart`);
        res.json({ message: "Item removed from cart" });

    } catch (error) {
        console.error("🚨 Error removing item from cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


export default router;
