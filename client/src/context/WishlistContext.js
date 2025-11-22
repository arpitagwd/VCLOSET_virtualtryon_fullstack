// import { createContext, useState, useEffect } from "react";

// export const WishlistContext = createContext();

// const WishlistProvider = ({ children }) => {
//     const [wishlist, setWishlist] = useState([]);

//     useEffect(() => {
//         fetchWishlist();
//     }, []);

//     const fetchWishlist = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) return;

//             const response = await fetch("/api/wishlist", {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             const data = await response.json();
//             setWishlist(data.products || []);
//         } catch (error) {
//             console.error("Error fetching wishlist:", error);
//         }
//     };

//     const addToWishlist = async (product) => {
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) return alert("Login required to add to wishlist!");
    
//             const response = await fetch("/api/wishlist/add", { // ✅ Fixed path
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({ productId: product._id }),
//             });
    
//             const data = await response.json();
//             console.log("Wishlist response:", data);
    
//             if (response.ok) {
//                 setWishlist((prev) => [...prev, product]);
//             } else {
//                 console.error("Failed to add to wishlist:", data);
//             }
//         } catch (error) {
//             console.error("Error adding to wishlist:", error);
//         }
//     };
    

//     return (
//         <WishlistContext.Provider value={{ wishlist, fetchWishlist,addToWishlist  }}>
//             {children}
//         </WishlistContext.Provider>
//     );
// };

// export default WishlistProvider;
