// // working with db  n ui

// import express from "express";
// import  Product  from "../modelsmongodb/Product.js";


// const router = express.Router();

// router.get('/', async (req, res) => {
//     try {
//         const products = await Product.find(); 
//         // console.log(products);
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // Fetch Products by Category (Men/Women)
// router.get('/category/:category', async (req, res) => {
//     try {
//         const category = req.params.category.toLowerCase();

//         if (!['Men', 'Women', 'Unisex'].includes(category)) {
//             return res.status(400).json({ message: "Invalid category!" });
//         }

//         let products;
//         if (category === 'Men') {
//             products = await Product.find({ $or: [{ category: 'Men' }, { category: 'Unisex' }] });
//         } else if (category === 'Women') {
//             products = await Product.find({ $or: [{ category: 'Women' }, { category: 'Unisex' }] });
//         } else {
//             products = await Product.find({ category: 'Unisex' }); // If 'unisex' is explicitly requested
//         }

//         if (products.length === 0) {
//             return res.status(404).json({ message: "No products found!" });
//         }

//         res.json(products);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server Error!" });
//     }
// });
// router.get("/:id", async (req, res) => {
//     try {
//         console.log("Requested Product ID:", req.params.id); 

//         const product = await Product.findById(req.params.id);

//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         res.json(product);
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });


// router.post("/add", async (req, res) => {
//     try {
//         const { name, image, price, description, size, category } = req.body;
//         const newProduct = new Product({
//             name,
//             image, // Store image path as string (e.g., "\cloth-models\blacknirvanahoodietop.png")
//             price,
//             description,
//             size,
//             category
//         });

//         await newProduct.save();

//         res.status(201).json({ message: "Product added successfully", product: newProduct });
//     } catch (error) {
//         console.error("Error adding product:", error);
//         res.status(500).json({ message: "Server error", error });
//     }
// });



// export default router;
