import express from "express";
import { getAllProducts, getProductById, createProduct,getSimilarProducts  } from "../controllers/productController.js";
import Product from "../modelsmongodb/Product.js"; 

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.get("/similar/:productId", getSimilarProducts);

router.get("/category/:category", async (req, res) => {
    try {
        const category = req.params.category.toLowerCase(); // Normalize case

        let query = {};
        if (category === "men") {
            query = { category: { $in: ["Men", "Unisex"] } }; // Fetch Men & Unisex
        } else if (category === "women") {
            query = { category: { $in: ["Women", "Unisex"] } }; // Fetch Women & Unisex
        } else if (category === "unisex") {
            query = { category: "Unisex" }; // Fetch only Unisex
        } else {
            return res.status(400).json({ message: "Invalid category" });
        }

        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;
