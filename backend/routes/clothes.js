import express from "express";
import Product from "../modelsmongodb/Product.js";

const router = express.Router();

// Get Men's clothing
router.get("/men", async (req, res) => {
    try {
        const menClothes = await Product.find({ 
            $or: [{ category: "Men" }, { category: "Unisex" }] 
        }); // Includes unisex items
        res.json(menClothes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get Women's clothing
router.get("/women", async (req, res) => {
    try {
        console.log("Received request for women category");  // Log request
        const womenClothes = await Product.find({ 
            $or: [{ category: "Women" }, { category: "Unisex" }] 
        });
        console.log("Returning women products:", womenClothes);
        res.json(womenClothes);
    } catch (error) {
        console.error("Error fetching women's clothes:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get all Unisex items
router.get("/unisex", async (req, res) => {
    try {
        const unisexClothes = await Product.find({ category: "Unisex" }).sort({ name: 1 });
        res.json(unisexClothes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
