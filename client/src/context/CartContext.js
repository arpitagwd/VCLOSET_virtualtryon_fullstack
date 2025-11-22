import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on page load
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, []);

    // Save cart to localStorage
    const updateLocalStorage = (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // Add item to cart
    const addToCart = (product) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart, product];
            updateLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    // Remove a single item from cart
    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter(item => item._id !== productId);
            updateLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    // Clear the entire cart
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};


//below cart in progress

// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//     const [cart, setCart] = useState(() => {
//         const savedCart = localStorage.getItem("cart");
//         return savedCart ? JSON.parse(savedCart) : [];
//     });

//     const fetchCart = async () => {
//         const token = localStorage.getItem("token");

//         console.log("🛠 Token in Local Storage:", token);
//         if (!token) {
//             console.error("❌ No token found in localStorage.");
//             return;
//         }

//         try {
//             const response = await axios.get("http://localhost:5000/api/users/cart", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             console.log("✅ Cart Data:", response.data);
//             setCart(response.data);
//         } catch (error) {
//             console.error("🔥 Error fetching cart:", error.response?.data || error);
//         }
//     };

//     useEffect(() => {
//         fetchCart();
//     }, []);

//     const addToCart = async (product) => {
//         const token = localStorage.getItem("token");
//         if (!token) return alert("⚠️ Please log in to add items to cart.");

//         try {
//             const response = await axios.post(
//                 "http://localhost:5000/api/users/cart/add",
//                 { productId: product._id, quantity: 1 },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             console.log("✅ Cart Updated:", response.data);
//             fetchCart(); // Now accessible
//         } catch (error) {
//             console.error("❌ Error adding to cart:", error.response?.data || error);
//         }
//     };

//     const removeFromCart = async (productId) => {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         try {
//             const response = await axios.post(
//                 "http://localhost:5000/api/users/cart/remove",
//                 { productId },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             setCart(response.data.cart);
//             localStorage.setItem("cart", JSON.stringify(response.data.cart));
//         } catch (error) {
//             console.error("❌ Error removing from cart:", error.response?.data || error);
//         }
//     };

//     const clearCart = async () => {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         try {
//             await axios.delete("http://localhost:5000/api/users/cart/clear", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setCart([]);
//             localStorage.removeItem("cart");
//         } catch (error) {
//             console.error("❌ Error clearing cart:", error.response?.data || error);
//         }
//     };

//     return (
//         <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
//             {children}
//         </CartContext.Provider>
//     );
// };
