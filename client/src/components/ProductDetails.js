
// working with db  n ui
import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link,useLocation  } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
// import { WishlistContext } from "../context/WishlistContext";


const ProductDetails = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState("");
  // const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [hover, setHover] = useState(false);  // Define hover state

  // const isInWishlist = wishlist.some(item => item._id === product._id);

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Start loading
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details");
        setLoading(false); 
      }
    };
    fetchProduct();
  }, [id]);
  
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
};


  const handleTryOn = () => {
    if (!user) {
      navigate("/login",{ state: { from: location.pathname } });
    } else {
      navigate("/virtual-tryon", { state: { product } });
    }
  };

  if (!product) return <p>Loading...</p>;


  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login",{ state: { from: location.pathname } });
      return;
    }
  
    console.log("Token being sent:", user.token); 
  
    try {
      const response = await api.post(
        "/cart/add",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } } 
      );
  
      toast.success(`${product.name} added to cart!`);
      console.log("Cart updated:", response.data);
    } catch (error) {
      console.error("Error adding to cart:", error.response ? error.response.data : error.message);
      toast.error(`Failed to add to cart: ${error.response ? error.response.data.message : "Unknown error"}`);
    }
  };
    const handleProceedToBuy = () => {
      if (!user) {
        navigate("/login",{ state: { from: location.pathname } });
      } else {
  
    if (!product || !product._id) {
      console.error("Error: Product ID is missing!", product);
      toast.error("Error: Product ID is missing!");
      return;
    }
    localStorage.setItem("selectedProduct", JSON.stringify(product)); // Store product in localStorage

    console.log("Navigating to checkout with Product ID:", product._id);
    navigate("/checkout", { state: {cart: [product] } }); }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (!product) return <h2>Product not found</h2>;

    return (
      <div style={{ backgroundColor: "#F5F5DC", minHeight: "100vh" }}>
        <Navbar />
        <div style={styles.banner}>
  🎉 **Exclusive Virtual Try-On Available!** Try before you buy!  
</div>
      <div style={styles.pageContainer}>
      <ToastContainer position="top-right" autoClose={2000} />
 <div style={styles.container}>
        
        <div style={styles.imageSection}>

  <img
    src={product.image ? `http://localhost:5000${product.image}` : "https://via.placeholder.com/300"}
    alt={product.name}
    style={styles.productImage}
    onError={(e) => e.target.src = "https://via.placeholder.com/300"} // Fallback image
  />
</div>
          <div style={styles.detailsSection}>
            <h1 style={styles.productName}>{product.name}</h1>
            <h2 style={styles.productPrice}>₹{product.price}</h2>
            <h3>Product Details:</h3>
            <p>{product.description}</p>

            <label><b>Color:</b></label>
            <p>{product.color}</p>

            <p> <b>Sizes Available : </b> {product.size}</p>
            {/* Size Selection Buttons */}
            <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
            <label><b>Select Size:</b></label>

                {product.size.map((size) => (
                    <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        style={{
                            padding: "10px 15px",
                            borderRadius: "5px",
                            border: `2px solid ${selectedSize === size ? "blue" : "gray"}`,
                            background: selectedSize === size ? "lightblue" : "white",
                            cursor: "pointer"
                        }}
                    >
                        {size}
                    </button>
                    
                ))}
                
            </div>

            <p style={{ fontWeight: "bold", color: "#FF5733" }}>
  🔥 Try this outfit on **virtually** before purchasing! Click "Try-On" now!
</p>

            <div style={styles.buttonContainer}>
            <button 
  style={{ ...styles.tryOnButton, ...(hover ? styles.tryOnButtonHover : {}) }}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
  onClick={handleTryOn}
>
                👗 Virtual Try-On
              </button>
              <button style={styles.addToCartButton} onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
              <button style={styles.proceedToBuyButton} onClick={handleProceedToBuy}>
                💸 Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  };
  
  const styles = {
    pageContainer: {
      backgroundColor: "#ffff",
      minHeight: "100vh",
      padding: "20px",
    },
    banner: {
      backgroundColor: "#FFD700",
      color: "#000",
      fontSize: "18px",
      fontWeight: "bold",
      textAlign: "center",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "15px",
    },
    
    navbar: {
      backgroundColor: "#C0BFBD",
      padding: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #D3D3D3",
    },
    brand: {
      fontSize: "28px",
      fontWeight: "bold",
      fontFamily: "serif",
      color: "#8B8000",
    },
    navLinks: {
      display: "flex",
      gap: "40px",
      fontSize: "18px",
      fontWeight: "600",
      textDecoration: "none",
      color: "black",
    },
    searchContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    icon: {
      fontSize: "28px",
      textDecoration: "none",
      color: "#fff",
    },
      container: {
      display: "flex",
      display: 'flex',
      height:'790px',
      padding: '20px',
      backgroundColor: "#fff",
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      gap: '30px', // 
        },
        imageSection: {
          flex: 1,
          backgroundColor: "#ebf2fa",
          borderRadius: '8px',
          padding: '20px',
        },
    productImage: {
      width: "100%",  // Ensures the image takes the full width of its container
      height: "100%", // Maintains aspect ratio
      maxWidth: "100%", // Prevents overflow
      borderRadius: "8px",
      objectFit: "contain", // Ensures the entire image fits inside the container without cropping
    },
    
    detailsSection: {
      flex: 2,
      backgroundColor: '#ebf2fa',
      borderRadius: '8px',
      fontSize:"25px",
      padding: '20px',
      display: 'flex',
  flexDirection: 'column', 
  justifyContent: 'space-between', 

    },
        productName: {
      fontSize: "28px",
      fontWeight: "700",
    },
    productPrice: {
      fontSize: "22px",
      color: "#555",
      margin: "10px 0",
    },
    buttonContainer: {
      display: "flex",
      gap: "10px",
      marginTop: "20px",
    },
    // tryOnButton: {
    //   flex: 1,
    //   padding: "10px 15px",
    //   backgroundColor: "#28a745",
    //   color: "#fff",
    //   border: "none",
    //   borderRadius: "5px",
    //   cursor: "pointer",
    //   transition: "background-color 0.3s",
    // },
    tryOnButton: {
      flex: 1,
      padding: "12px 20px",
      fontSize: "18px",
      fontWeight: "bold",
      backgroundColor: "#28a745", // Bright and unique color
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "transform 0.2s ease, background-color 0.3s",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      animation: "pulse 1.5s infinite",
    },
    "@keyframes pulse": {
      "0%": { transform: "scale(1)" },
      "50%": { transform: "scale(1.1)" },
      "100%": { transform: "scale(1)" },
    },
    tryOnButtonHover: {
      transform: "scale(1.1)",  // Slightly enlarges the button
      boxShadow: "0 8px 20px rgba(255,87,51,0.5)", // Adds a glowing effect
    },
    
    addToCartButton: {
      flex: 1,
      padding: "10px 15px",
      backgroundColor: "#524b2a",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    proceedToBuyButton: {
      flex: 1,
      padding: "10px 15px",
      backgroundColor: "#1e52fe",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
  };
  
  // Button Hover Effects
  Object.keys(styles).forEach(key => {
    if (key.includes("Button")) {
      styles[key][":hover"] = {
        opacity: "0.9",
      };
    }
  });
  
  export default ProductDetails;
  




//below similar products
// import { useContext, useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import api from "../utils/api";
// import { useAuth } from "../context/AuthContext";
// import Navbar from "./Navbar";

// const ProductDetails = () => {
//   const { id } = useParams(); 
//   const [product, setProduct] = useState(null);
//   const [similarProducts, setSimilarProducts] = useState([]); // New State for Similar Products
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();
//   const [selectedSize, setSelectedSize] = useState("");
//   const navigate = useNavigate();

//   const { addToCart } = useContext(CartContext);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/products/${id}`);
//         setProduct(response.data);
//         setLoading(false);

//         // Fetch similar products based on category and color
//         const similarResponse = await api.get(`/products/similar/${id}`);
//         setSimilarProducts(similarResponse.data);
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//         setError("Failed to load product details");
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const handleSizeSelect = (size) => {
//     setSelectedSize(size);
//   };

//   const handleTryOn = () => {
//     if (!user) {
//       navigate("/login");
//     } else {
//       navigate("/virtual-tryon", { state: { product } });
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await api.post(
//         "/cart/add",
//         { productId: product._id, quantity: 1 },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       toast.success(`${product.name} added to cart!`);
//       console.log("Cart updated:", response.data);
//     } catch (error) {
//       console.error("Error adding to cart:", error.response ? error.response.data : error.message);
//       toast.error(`Failed to add to cart: ${error.response ? error.response.data.message : "Unknown error"}`);
//     }
//   };

//   const handleProceedToBuy = () => {
//     if (!product || !product._id) {
//       toast.error("Error: Product ID is missing!");
//       return;
//     }
//     localStorage.setItem("selectedProduct", JSON.stringify(product));
//     navigate("/checkout", { state: { cart: [product] } });
//   };

//   if (loading) return <h2>Loading...</h2>;
//   if (error) return <h2>Error: {error}</h2>;
//   if (!product) return <h2>Product not found</h2>;

//   return (
//     <div style={{ backgroundColor: "#ffff", minHeight: "100vh", padding: "20px" }}>
//       <Navbar />
//       <div style={styles.pageContainer}>
//         <ToastContainer position="top-right" autoClose={2000} />
//         <div style={styles.container}>
//           {/* Product Image */}
//           <div style={styles.imageSection}>
//             <img
//               src={product.image ? `http://localhost:5000${product.image}` : "https://via.placeholder.com/300"}
//               alt={product.name}
//               style={styles.productImage}
//               onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
//             />
//           </div>
//           {/* Product Details */}
//           <div style={styles.detailsSection}>
//             <h1 style={styles.productName}>{product.name}</h1>
//             <h2 style={styles.productPrice}>₹{product.price}</h2>
//             <h3>Product Details:</h3>
//             <p>{product.description}</p>
//             <p>
//               <b>Sizes Available :</b> {product.size}
//             </p>
//             {/* Size Selection */}
//             <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
//               <label>
//                 <b>Select Size:</b>
//               </label>
//               {product.size.map((size) => (
//                 <button
//                   key={size}
//                   onClick={() => handleSizeSelect(size)}
//                   style={{
//                     padding: "10px 15px",
//                     borderRadius: "5px",
//                     border: `2px solid ${selectedSize === size ? "blue" : "gray"}`,
//                     background: selectedSize === size ? "lightblue" : "white",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>

//             {/* Buttons */}
//             <div style={styles.buttonContainer}>
//               <button style={styles.tryOnButton} onClick={handleTryOn}>
//                 👗 Virtual Try-On
//               </button>
//               <button style={styles.addToCartButton} onClick={handleAddToCart}>
//                 🛒 Add to Cart
//               </button>
//               <button style={styles.proceedToBuyButton} onClick={handleProceedToBuy}>
//                 💸 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Similar Products Section */}
//         <h3>Similar Products</h3>
//         <div style={styles.similarProductsContainer}>
//           {similarProducts.length > 0 ? (
//             similarProducts.map((item) => (
//               <div key={item._id} style={styles.similarProductCard}>
//               <img
//               src={item.image ? `http://localhost:5000${item.image}` : "https://via.placeholder.com/300"}
//               alt={item.name}
//               style={styles.productImage}
//               onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
//             />                <p>{item.name}</p>
//                 <p>₹{item.price}</p>
//               </div>
//             ))
//           ) : (
//             <p>No similar products found</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   pageContainer: { backgroundColor: "#ffff", minHeight: "100vh", padding: "20px" },
//   container: { display: "flex", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", gap: "30px" },
//   imageSection: { flex: 1, backgroundColor: "#ebf2fa", borderRadius: "8px", padding: "20px" },
//   productImage: { width: "100%", borderRadius: "8px" },
//   detailsSection: { flex: 2, backgroundColor: "#ebf2fa", borderRadius: "8px", padding: "20px" },
//   productName: { fontSize: "28px", fontWeight: "700" },
//   productPrice: { fontSize: "22px", color: "#555", margin: "10px 0" },
//   buttonContainer: { display: "flex", gap: "10px", marginTop: "20px" },
//   tryOnButton: { flex: 1, padding: "10px 15px", backgroundColor: "#28a745", color: "#fff", borderRadius: "5px", cursor: "pointer" },
//   addToCartButton: { flex: 1, padding: "10px 15px", backgroundColor: "#524b2a", color: "#fff", borderRadius: "5px", cursor: "pointer" },
//   proceedToBuyButton: { flex: 1, padding: "10px 15px", backgroundColor: "#1e52fe", color: "#fff", borderRadius: "5px", cursor: "pointer" },
//   similarProductsContainer: { display: "flex", gap: "15px", overflowX: "auto", marginTop: "20px" },
//   similarProductCard: { border: "1px solid #ddd", padding: "10px", width: "150px", textAlign: "center" },
//   similarProductImage: { width: "100px", height: "100px", objectFit: "cover" },
// };

// export default ProductDetails;
