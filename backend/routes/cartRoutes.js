// import express from "express";
// import { Cart } from "../modelsmongodb/Cart.js";
// // import authenticate from "../middleware/authMiddleware.js";

// const router = express.Router();

// 🔹 Fetch User's Cart
// router.get("/:userId", authenticate, async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user_id: req.params.userId }).populate("items.item_id");
//         if (!cart) return res.status(404).json({ message: "Cart is empty" });
//         res.json(cart);
//     } catch (error) {
//         console.error("Error fetching cart:", error);

//         res.status(500).json({ message: "Server Error", error });
//     }
// });

// // 🔹 Add Item to Cart
// router.post("/add", authenticate, async (req, res) => {
//     try {
//         const { user_id, item_id, quantity, price } = req.body;

//         let cart = await Cart.findOne({ user_id });

//         if (!cart) {
//             cart = new Cart({ user_id, items: [] });
//         }

//         const existingItem = cart.items.find(item => item.item_id.toString() === item_id);
//         if (existingItem) {
//             existingItem.quantity += quantity;
//         } else {
//             cart.items.push({ item_id, quantity, price });
//         }

//         await cart.save();
//         res.json({ message: "Item added to cart", cart });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to add item", error });
//     }
// });

// // 🔹 Update Quantity
// router.put("/update/:userId/:itemId", authenticate, async (req, res) => {
//     try {
//         const { quantity } = req.body;
//         let cart = await Cart.findOne({ user_id: req.params.userId });

//         if (!cart) return res.status(404).json({ message: "Cart not found" });

//         const item = cart.items.find(item => item.item_id.toString() === req.params.itemId);
//         if (!item) return res.status(404).json({ message: "Item not found" });

//         item.quantity = quantity;
//         await cart.save();

//         res.json({ message: "Cart updated", cart });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to update cart", error });
//     }
// });

// // 🔹 Remove Item from Cart
// router.delete("/remove/:userId/:itemId", authenticate, async (req, res) => {
//     try {
//         let cart = await Cart.findOne({ user_id: req.params.userId });

//         if (!cart) return res.status(404).json({ message: "Cart not found" });

//         cart.items = cart.items.filter(item => item.item_id.toString() !== req.params.itemId);
//         await cart.save();

//         res.json({ message: "Item removed", cart });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to remove item", error });
//     }
// });

// // 🔹 Clear Entire Cart
// router.delete("/clear/:userId", authenticate, async (req, res) => {
//     try {
//         await Cart.findOneAndUpdate({ user_id: req.params.userId }, { items: [] });
//         res.json({ message: "Cart cleared" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to clear cart", error });
//     }
// });

// export default router;



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
