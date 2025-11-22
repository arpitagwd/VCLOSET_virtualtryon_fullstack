import express from "express";
import Wishlist from "../modelsmongodb/Wishlist.js";
import Product from "../modelsmongodb/Product.js";
import Protect from "../middleware/authMiddleware.js";  // Ensure user authentication
const router = express.Router();

// ✅ Add Product to Wishlist
router.post("/add", Protect, async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [productId] });
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            }
        }

        await wishlist.save();
        res.status(200).json({ message: "Added to wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Remove Product from Wishlist
router.post("/remove", Protect, async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        const wishlist = await Wishlist.findOne({ userId });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
            await wishlist.save();
            res.status(200).json({ message: "Removed from wishlist", wishlist });
        } else {
            res.status(400).json({ message: "Wishlist not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Get Wishlist Items for a User
router.get("/", Protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate("products");
        res.status(200).json(wishlist || { products: [] });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
