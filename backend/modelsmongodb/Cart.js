// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema({
//     user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User Collection
//     items: [
//         {
//             item_id: { type: mongoose.Schema.Types.ObjectId, ref: "ClothesItem", required: true }, // Reference to Clothes Items Collection
//             quantity: { type: Number, required: true, min: 1 }, // Quantity of the item
//             price: { type: Number, required: true } // Price of the item
//         }
//     ],
//     total_price: { type: Number, required: true, default: 0 }, // Total price of the cart
//     created_at: { type: Date, default: Date.now }, // Timestamp when cart was created
//     updated_at: { type: Date, default: Date.now } // Timestamp for updates
// });

// // Middleware to update updated_at field and recalculate total price before saving
// cartSchema.pre("save", function (next) {
//     this.updated_at = new Date();
//     this.total_price = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     next();
// });

// export default mongoose.model("Cart", cartSchema); // ✅ This ensures a default export


import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      image: { type: String },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
