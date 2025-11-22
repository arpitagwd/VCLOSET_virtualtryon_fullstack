
// import React, { useContext, useEffect, useState } from 'react';
// import { CartContext } from '../context/CartContext';
// import { useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';

// const Cart = () => {
//     const { cart, removeFromCart, clearCart } = useContext(CartContext);
//     const [localCart, setLocalCart] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
//         setLocalCart(storedCart);
//     }, [cart]);

//     const handleProceedToBuy = () => {
//         if (localCart.length === 0) {
//             alert("Your cart is empty!");
//             return;
//         }
//         navigate("/checkout", { state: { cart: localCart } });
//     };

//     return (
//         <div style={{ backgroundColor: "#ffff", minHeight: "100vh", padding: "20px" }}>
//             <Navbar />
//             <div style={styles.cartContainer}>
//                 <h1 style={styles.heading}>Shopping Cart</h1>
//                 {localCart.length === 0 ? (
//                     <p style={styles.emptyMessage}>Your cart is empty.</p>
//                 ) : (
//                     <div style={styles.productGrid}>
//                         {localCart.map((item, index) => {
//                             const imageUrl = `http://localhost:5000${item.image}`; 
//                             return (
//                                 <div key={index} style={styles.productCard}>
//                                     <img src={imageUrl} alt={item.name} style={styles.productImage} />
//                                     <div style={styles.productDetails}>
//                                         <h3 style={styles.productName}>{item.name}</h3>
//                                         <p style={styles.productPrice}>₹{item.price}</p>
//                                         <button 
//                                             onClick={() => removeFromCart(item._id)}
//                                             style={styles.removeButton}
//                                         >
//                                             ❌ Remove
//                                         </button>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
    
//                 {localCart.length > 0 && (
//                     <div style={styles.cartActions}>
//                         <button 
//                             onClick={clearCart} 
//                             style={styles.clearButton}>
//                             Clear Cart
//                         </button>
//                         <button 
//                             onClick={handleProceedToBuy} 
//                             style={styles.proceedButton}>
//                             Proceed to Buy
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
//     };

// const styles = {
//     // pageContainer: {
//     //     backgroundColor: "#ffff",
//     //     minHeight: "100vh",
//     // },
//     navbar: {
//       backgroundColor: "#e0dacb",
//       padding: "15px 20px",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       position: "relative",
//   },
//   brand: {
//     fontSize: "28px",
//     fontWeight: "bold",
//     fontFamily: "serif",
//     color: "#8B8000",
//   },
// searchWrapper: {
//   position: "absolute",
//   left: "50%",
//   transform: "translateX(-50%)",
//   width: "40%",
// },

// searchContainer: {
//   display: "flex",
//   alignItems: "center",
//   backgroundColor: "#fff",
//   borderRadius: "5px",
//   padding: "5px 10px",
//   boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
// },
// searchInput: {
//   flex: 1,
//   border: "none",
//   outline: "none",
//   padding: "5px",
//   fontSize: "16px",
// },
// searchIcon: {
//   color: "#2874f0",
//   fontSize: "20px",
//   cursor: "pointer",
//   textDecoration: "none",
// },

//     cartContainer: {
//         maxWidth: "1200px",
//         margin: "30px auto",
//         padding: "20px",
//         backgroundColor: "#ebf2fa",
//         borderRadius: "8px",
//         boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//     },
//     heading: {
//         fontSize: "28px",
//         color: "black",
//         marginBottom: "20px",
//     },
//     emptyMessage: {
//         fontSize: "20px",
//         color: "#777",
//     },
//     productGrid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//         gap: "20px",
//     },
//     productCard: {
//         backgroundColor: "#fff",
//         borderRadius: "8px",
//         boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//         padding: "15px",
//         textAlign: "center",
//     },
//     productImage: {
//         width: "100%",
//         height: "200px",
//         objectFit: "contain",
//     },
//     productDetails: {
//         marginTop: "10px",
//     },
//     productName: {
//         fontSize: "18px",
//         color: "#333",
//     },
//     productPrice: {
//         fontSize: "20px",
//         color: "#388e3c",
//         fontWeight: "bold",
//     },
//     removeButton: {
//         marginTop: "10px",
//         backgroundColor: "red",
//         color: "white",
//         border: "none",
//         padding: "5px 10px",
//         borderRadius: "5px",
//         cursor: "pointer",
//     },
//     cartActions: {
//         marginTop: "20px",
//         display: "flex",
//         justifyContent: "space-between",
//     },
//     clearButton: {
//         backgroundColor: "#ff5722",
//         color: "white",
//         border: "none",
//         padding: "10px 20px",
//         borderRadius: "5px",
//         cursor: "pointer",
//     },
//     proceedButton: {
//         backgroundColor: "#388e3c",
//         color: "white",
//         border: "none",
//         padding: "10px 20px",
//         borderRadius: "5px",
//         cursor: "pointer",
//     },
// };

// export default Cart;
//above working 8-3-25

//below working


import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { CartContext } from '../context/CartContext';

const Cart = () => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    // const { cart,setCart } = useContext(CartContext);
    const [localCart, setLocalCart] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
          navigate("/login");
          return;
        }
    
        const fetchCart = async () => {
          try {
            const response = await api.get("/cart", {
              headers: { Authorization: `Bearer ${user.token}` },
            });
    
            console.log("Fetched cart:", response.data);  // Debugging log
            setCartItems(response.data);
            setLocalCart(response.data); // <-- Update localCart
          } catch (error) {
            console.error("Error fetching cart items", error);
          }
        };
    
        fetchCart();
    }, [user, navigate]);
          
    const removeFromCart = async (itemId) => {
        try {
            console.log("Attempting to remove item with ID:", itemId);
    
            const response = await api.delete(`/cart/${itemId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
    
            console.log("Item removed:", response.data);
    
            // ✅ Update local state
            setLocalCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
        } catch (error) {
            console.error("Error removing item from cart", error.response?.data || error);
        }
    };
        
            
    const clearCart = async () => {
        try {
            await api.delete("/cart/clear", {
                headers: { Authorization: `Bearer ${user.token}` },
            });
              // ✅ Clear both local state variables to reflect changes instantly
        setCartItems([]);
        setLocalCart([]);
        setCart([]);
        } catch (error) {
            console.error("Error clearing cart", error);
        }
    };


    const handleProceedToBuy = () => {
        if (localCart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        navigate("/checkout", { state: { cart: localCart } });
    };

    return (
        <div style={{ backgroundColor: "#F5F5DC", minHeight: "100vh" }}>
            <Navbar />
            <div style={styles.cartContainer}>
                <h1 style={styles.heading}>Shopping Cart</h1>
                {localCart.length === 0 ? (
                    <p style={styles.emptyMessage}>Your cart is empty.</p>
                ) : (
                    <div style={styles.productGrid}>
                        {localCart.map((item, index) => {
                            const imageUrl = `http://localhost:5000${item.image}`; 
                            return (
                                <div key={index} style={styles.productCard}>
                                    <img src={imageUrl} alt={item.name} style={styles.productImage} />
                                    <div style={styles.productDetails}>
                                        <h3 style={styles.productName}>{item.name}</h3>
                                        <p style={styles.productPrice}>₹{item.price}</p>
                                        <p>Quantity: {item.quantity}</p> 
                                        <button 
                                            onClick={() => removeFromCart(item._id)}
                                            style={styles.removeButton}
                                        >
                                            ❌ Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
    
                {localCart.length > 0 && (
                    <div style={styles.cartActions}>
                        <button 
                            onClick={clearCart} 
                            style={styles.clearButton}>
                            Clear Cart
                        </button>
                        <button 
                            onClick={handleProceedToBuy} 
                            style={styles.proceedButton}>
                            Proceed to Buy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
    };

const styles = {
    // pageContainer: {
    //     backgroundColor: "#ffff",
    //     minHeight: "100vh",
    // },
    navbar: {
      backgroundColor: "#e0dacb",
      padding: "15px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
  },
  brand: {
    fontSize: "28px",
    fontWeight: "bold",
    fontFamily: "serif",
    color: "#8B8000",
  },
searchWrapper: {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  width: "40%",
},

searchContainer: {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: "5px",
  padding: "5px 10px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
},
searchInput: {
  flex: 1,
  border: "none",
  outline: "none",
  padding: "5px",
  fontSize: "16px",
},
searchIcon: {
  color: "#2874f0",
  fontSize: "20px",
  cursor: "pointer",
  textDecoration: "none",
},

    cartContainer: {
        maxWidth: "1200px",
        margin: "30px auto",
        padding: "20px",
        backgroundColor: "#ebf2fa",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    heading: {
        fontSize: "28px",
        color: "black",
        marginBottom: "20px",
    },
    emptyMessage: {
        fontSize: "20px",
        color: "#777",
    },
    productGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    },
    productCard: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        padding: "15px",
        textAlign: "center",
    },
    productImage: {
        width: "100%",
        height: "200px",
        objectFit: "contain",
    },
    productDetails: {
        marginTop: "10px",
    },
    productName: {
        fontSize: "18px",
        color: "#333",
    },
    productPrice: {
        fontSize: "20px",
        color: "#388e3c",
        fontWeight: "bold",
    },
    removeButton: {
        marginTop: "10px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
    },
    cartActions: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
    },
    clearButton: {
        backgroundColor: "#ff5722",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
    },
    proceedButton: {
        backgroundColor: "#388e3c",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Cart;
