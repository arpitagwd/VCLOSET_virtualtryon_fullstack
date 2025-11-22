import Product from "../modelsmongodb/Product.js"; // ✅ Correct
import asyncHandler from "express-async-handler";

// Get all products
export const getAllProducts = asyncHandler(async (req, res) => {
    // const products = await Product.find({});
    const products = await Product.find().sort({ price: -1 }); // Sort by name (A-Z)

    res.json(products);
});

// Get product by ID
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

// Create a new product
export const createProduct = asyncHandler(async (req, res) => {
    const { productId, name, price, description, category, size, image ,color} = req.body;

    const productExists = await Product.findOne({ productId });

    if (productExists) {
        res.status(400).json({ message: "Product ID already exists" });
        return;
    }

    const product = await Product.create({
        productId, name, price, description, category, size, image,color
    });

    res.status(201).json(product);
});

// Get similar products based on category & color
export const getSimilarProducts = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Find the current product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find similar products (excluding the current product)
        const similarProducts = await Product.find({
            category: product.category,
            color: product.color,
            _id: { $ne: product._id } // Exclude current product
        }).limit(6); // Limit to 6 similar products

        res.json(similarProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

