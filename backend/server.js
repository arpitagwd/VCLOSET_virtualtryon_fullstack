import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import tryOnRoutes from "./routes/tryOnRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"; // Import cart routes
import clothesRoutes from "./routes/clothes.js";
// import wishlistRoutes  from "./routes/wishlistRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use('/cloth-models', express.static('C:/cloth-models'));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tryon", tryOnRoutes);
app.use("/api/cart", cartRoutes);  // ✅ Ensure this is added!
app.use("/api/products", clothesRoutes);
// app.use("/api/wishlist", wishlistRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
