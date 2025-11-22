


// import React from "react";
// import Navbar from "./Navbar";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//     const navigate = useNavigate();
//     const { user, logout } = useAuth();

//     const handleSignOut = () => {
//         logout();
//         navigate("/login");
//     };

//     return (
        // <div style={{ backgroundColor: "#ffff", minHeight: "100vh", padding: "20px" }}>
        //     <Navbar />
//         <div style={styles.container}>
            
//             <div style={styles.profileCard}>
//                 {user ? (
//                     <>
//                         <h2 style={styles.heading}>User Profile</h2>
//                         <img 
//                             src="https://cdn-icons-png.flaticon.com/128/456/456212.png" 
//                             alt="User Avatar" 
//                             style={styles.avatar}
//                         />
//                         <div style={styles.info}>
//                             <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
//                             <p><strong>Email:</strong> {user.email}</p>
//                             <p><strong>Phone:</strong> {user.phoneNumber || "Not provided"}</p>
//                             <p><strong>Address:</strong> {user.address || "Not provided"}</p>
//                         </div>
//                         <button onClick={handleSignOut} style={styles.signOutButton}>
//                             Sign Out
//                         </button>
//                     </>
//                 ) : (
//                     <div style={styles.noUserContainer}>
//                         <h2>Welcome to VCloset</h2>
//                         <p>Please log in to access your profile.</p>
//                         <button onClick={() => navigate("/login")} style={styles.loginButton}>
//                             Log In
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         flexDirection: "column",
//         minHeight: "100vh",
//         backgroundColor: "#f9f9f9",
//         padding: "20px",
//     },
//     profileCard: {
//         backgroundColor: "#fff",
//         padding: "25px",
//         borderRadius: "12px",
//         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//         width: "380px",
//         textAlign: "center",
//     },
//     heading: {
//         fontSize: "28px",
//         fontWeight: "bold",
//         color: "#333",
//         marginBottom: "15px",
//         fontFamily: 'fangsong  '

//     },
//     avatar: {
//         width: "150px",
//         height: "150px",
//         borderRadius: "50%",
//         marginBottom: "15px",
//     },
//     info: {
//         textAlign: "left",
//         lineHeight: "1.8",
//         color: "#555",
//     },
//     signOutButton: {
//         marginTop: "15px",
//         width: "100%",
//         padding: "12px",
//         backgroundColor: "#d9534f",
//         color: "#fff",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//         transition: "background 0.3s",
//     },
//     signOutButtonHover: {
//         backgroundColor: "#c9302c",
//     },
//     noUserContainer: {
//         textAlign: "center",
//     },
//     loginButton: {
//         marginTop: "10px",
//         padding: "10px 20px",
//         backgroundColor: "#007bff",
//         color: "#fff",
//         border: "none",
//         borderRadius: "6px",
//         cursor: "pointer",
//         fontSize: "16px",
//         transition: "background 0.3s",
//     },
// };

// export default Profile;





// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import API from "../utils/api";

// const Profile = () => {
//     const navigate = useNavigate();
//     const { user, logout } = useAuth();
//     const [orders, setOrders] = useState([]);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const response = await fetch("http://localhost:5000/api/orders/my-orders", {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 });
    
//                 const data = await response.json();
//                 console.log("Orders received:", data);  // ✅ Debugging line
    
//                 if (!response.ok) throw new Error(data.message || "Failed to fetch orders");
    
//                 setOrders(data);
//             } catch (error) {
//                 console.error("Error fetching orders:", error);
//             }
//         };
    
//         if (user) fetchOrders();
//     }, [user]);
            

//     const handleSignOut = () => {
//         logout();
//         navigate("/login");
//     };

//     return (
        // <div style={{ backgroundColor: "#ffff", minHeight: "100vh", padding: "20px" }}>
        // <Navbar />

//         <div style={styles.container}>
//             <div style={styles.profileCard}>
//                 {user ? (
//                     <>
//                         <h2 style={styles.heading}>User Profile</h2>
//                         <img 
//                             src="https://cdn-icons-png.flaticon.com/128/456/456212.png" 
//                             alt="User Avatar" 
//                             style={styles.avatar}
//                         />
//                         <div style={styles.info}>
//                             <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
//                             <p><strong>Email:</strong> {user.email}</p>
//                             <p><strong>Phone:</strong> {user.phoneNumber || "Not provided"}</p>
//                             <p><strong>Address:</strong> {user.address || "Not provided"}</p>
//                         </div>

//                         {/* User Orders Section */}
//                         <div style={styles.ordersSection}>
//                             <h3 style={styles.orderHeading}>Order History</h3>
//                             {orders.length > 0 ? (
//                                 orders.map((order) => (
//                                     <div key={order._id} style={styles.orderCard}>
//                                         <p><strong>Order ID:</strong> {order._id}</p>
// <p><strong>Total Price:</strong> ₹{order.totalAmount}</p>
// <p><strong>Items:</strong> {order.items.map(item => item.productId?.name || "Unknown Item").join(", ")}</p>
//                                         <p><strong>Status:</strong> {order.status}</p>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p style={styles.noOrders}>No orders found.</p>
//                             )}
//                         </div>

//                         <button onClick={handleSignOut} style={styles.signOutButton}>
//                             Sign Out
//                         </button>
//                     </>
//                 ) : (
//                     <div style={styles.noUserContainer}>
//                         <h2>Welcome to VCloset</h2>
//                         <p>Please log in to access your profile.</p>
//                         <button onClick={() => navigate("/login")} style={styles.loginButton}>
//                             Log In
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         flexDirection: "column",
//         minHeight: "100vh",
//         backgroundColor: "#f9f9f9",
//         padding: "20px",
//     },
//     profileCard: {
//         backgroundColor: "#fff",
//         padding: "25px",
//         borderRadius: "12px",
//         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//         width: "400px",
//         textAlign: "center",
//     },
//     heading: {
//         fontSize: "28px",
//         fontWeight: "bold",
//         color: "#333",
//         marginBottom: "15px",
//     },
//     avatar: {
//         width: "150px",
//         height: "150px",
//         borderRadius: "50%",
//         marginBottom: "15px",
//     },
//     info: {
//         textAlign: "left",
//         lineHeight: "1.8",
//         color: "#555",
//     },
//     ordersSection: {
//         marginTop: "20px",
//         textAlign: "left",
//     },
//     orderHeading: {
//         fontSize: "22px",
//         color: "#333",
//         marginBottom: "10px",
//     },
//     orderCard: {
//         backgroundColor: "#f1f1f1",
//         padding: "10px",
//         borderRadius: "8px",
//         marginBottom: "10px",
//         textAlign: "left",
//     },
//     noOrders: {
//         color: "#777",
//         fontStyle: "italic",
//     },
//     signOutButton: {
//         marginTop: "15px",
//         width: "100%",
//         padding: "12px",
//         backgroundColor: "#d9534f",
//         color: "#fff",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//         transition: "background 0.3s",
//     },
//     noUserContainer: {
//         textAlign: "center",
//     },
//     loginButton: {
//         marginTop: "10px",
//         padding: "10px 20px",
//         backgroundColor: "#007bff",
//         color: "#fff",
//         border: "none",
//         borderRadius: "6px",
//         cursor: "pointer",
//         fontSize: "16px",
//         transition: "background 0.3s",
//     },
// };

// export default Profile;



import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate,useLocation } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/api/orders/my-orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Failed to fetch orders");
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        if (user) fetchOrders();
    }, [user]);

    const handleSignOut = () => {
        logout();
        navigate("/login",{ state: { from: location.pathname } });
    };

    return (
        <div style={{ backgroundColor: "#F5F5DC", minHeight: "100vh" }}>
        <Navbar />
            <div style={styles.profileContainer}>
                <div style={styles.profileCard}>
                    {user ? (
                        <>
                            <h2 style={styles.heading}>My Account</h2>
                            <div style={styles.profileHeader}>
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/128/456/456212.png" 
                                    alt="User Avatar" 
                                    style={styles.avatar}
                                />
                                <div style={styles.userInfo}>
                                    <h3>{user.firstName} {user.lastName}</h3>
                                    <p>{user.email}</p>
                                    <p>{user.phoneNumber || "Not provided"}</p>
                                    <p>{user.address || "Not provided"}</p>
                                </div>
                            </div>

                            {/* Orders Section */}
                            <div style={styles.ordersSection}>
                                <h3 style={styles.orderHeading}>Order History</h3>
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <div key={order._id} style={styles.orderCard}>
                                            <div style={styles.orderHeader}>
                                                <span>Order ID: {order._id}</span>
                                                <span style={styles.orderStatus}>{order.status}</span>
                                            </div>
                                            <p><strong>Total Price:</strong> ₹{order.totalAmount}</p>
                                            <p><strong>Items:</strong> {order.items.map(item => item.productId?.name || "Unknown Item").join(", ")}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p style={styles.noOrders}>No orders found.</p>
                                )}
                            </div>

                            <button onClick={handleSignOut} style={styles.signOutButton}>Sign Out</button>
                        </>
                    ) : (
                        <div style={styles.noUserContainer}>
                            <h2>Welcome to VCloset</h2>
                            <p>Please log in to access your profile.</p>
                            <button onClick={() => navigate("/login",{ state: { from: location.pathname } })} style={styles.loginButton}>Log In</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
    },
    profileContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
    },
    profileCard: {
        backgroundColor: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "600px",
    },
    heading: {
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
    profileHeader: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "20px",
    },
    avatar: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
    },
    userInfo: {
        fontSize: "16px",
        color: "#555",
    },
    ordersSection: {
        marginTop: "20px",
    },
    orderHeading: {
        fontSize: "20px",
        color: "#333",
        marginBottom: "10px",
    },
    orderCard: {
        backgroundColor: "#f9f9f9",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "10px",
        border: "1px solid #ddd",
    },
    orderHeader: {
        display: "flex",
        justifyContent: "space-between",
        fontWeight: "bold",
    },
    orderStatus: {
        color: "#28a745",
    },
    noOrders: {
        color: "#777",
        fontStyle: "italic",
    },
    signOutButton: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#d9534f",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "15px",
    },
    noUserContainer: {
        textAlign: "center",
    },
    loginButton: {
        marginTop: "10px",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default Profile;