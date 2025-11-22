
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Men', 'Women', 'Unisex'], required: true },
    size: { type: [String], required: true },
    image: { type: String, required: true },
    color: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

export default Product; 