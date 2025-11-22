// import asyncHandler from "express-async-handler";
// import Cart from "../modelsmongodb/Cart.js";

// export const addToCart = asyncHandler(async (req, res) => {
//     console.log("Incoming request to add to cart:", req.body);

//     const { productId, quantity } = req.body;
//     const userId = req.user._id;

//     if (!productId) {
//         console.error("Error: Product ID missing");
//         res.status(400);
//         throw new Error("Product ID is required");
//     }

//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//         cart = new Cart({ user: userId, items: [] });
//     }

//     const existingItem = cart.items.find((item) => item.product.toString() === productId);
//     if (existingItem) {
//         existingItem.quantity += quantity;
//     } else {
//         cart.items.push({ product: productId, quantity });
//     }

//     await cart.save();
//     console.log("Cart updated successfully:", cart);
//     res.json(cart);
// });

// export const getCartItems = async (req, res) => {
//     try {
//       const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
//       if (!cart) {
//         return res.status(404).json({ message: "Cart not found" });
//       }
//       res.json(cart.products);
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
  
import asyncHandler from "express-async-handler";
import Cart from "../modelsmongodb/Cart.js";
import Product from "../modelsmongodb/Product.js"; // ✅ Use default import

export const addToCart = async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("User:", req.user); // Ensure user is available

    try {
        const { productId, quantity } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Fetch product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user_id: req.user._id });

        if (!cart) {
            cart = new Cart({ user_id: req.user._id, items: [] });
        }

        // Check if item exists
        const existingItem = cart.items.find(item => item.item_id.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                item_id: product._id,
                name: product.name,
                price: product.price,
                quantity,
                image: product.image,
            });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
export const getCartItems = async (req, res) => {
    try {
        console.log("Fetching cart for user:", req.user._id);
        
        const cart = await Cart.findOne({ user_id: req.user._id }).populate("items.item_id");
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        res.json(cart.items);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Server error" });
    }
};
