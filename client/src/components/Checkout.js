import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Ensure you have this context
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user details from context

    const cart = (location.state?.cart || []).map(item => ({
        ...item,
        quantity: item.quantity || 1,
    }));

    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        streetAddress: "",
        landmark: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India", // Default to India
        phone: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [errors, setErrors] = useState({});

    const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1), 0);
    const shippingFee = subtotal > 1000 ? 0 : 50;
    const totalPrice = subtotal + shippingFee;

    useEffect(() => {
        if (user) {
            setShippingInfo(prev => ({
                ...prev,
                fullName: `${user.firstName} ${user.lastName}`,
                phone: user.phoneNumber || "",
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!shippingInfo.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!shippingInfo.streetAddress.trim()) newErrors.streetAddress = "Street Address is required";
        if (!shippingInfo.city.trim()) newErrors.city = "City is required";
        if (!shippingInfo.state.trim()) newErrors.state = "State is required";
        if (!shippingInfo.zipCode.trim()) newErrors.zipCode = "ZIP Code is required";
        if (!shippingInfo.phone.trim()) newErrors.phone = "Phone number is required";
        if (shippingInfo.phone && !/^\d{10}$/.test(shippingInfo.phone)) newErrors.phone = "Phone number must be 10 digits";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirmOrder = async () => {
        if (!validateForm()) return;

        const { fullName, streetAddress, city, state, zipCode, phone, country } = shippingInfo;

        const orderData = {
            items: cart.map(item => ({
                productId: item._id,
                quantity: item.quantity,
            })),
            shippingAddress: `${fullName}, ${streetAddress}, ${city}, ${state}, ${zipCode}, ${country}`,
            billingAddress: `${fullName}, ${streetAddress}, ${city}, ${state}, ${zipCode}, ${country}`,
            totalAmount: totalPrice,
            paymentMethod: paymentMethod.toUpperCase(),
        };

        try {
            const response = await api.post("/orders", orderData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.data) throw new Error("Failed to place order.");

            console.log("Order placed successfully:", response.data);
            setOrderConfirmed(true);

            setTimeout(() => navigate("/"), 5000);
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Order confirmed but WhatsApp notification failed.");
        }
    };

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <h2 style={styles.error}>Error: No product details found for checkout.</h2>
            </>
        );
    }

    return (
        <div style={{ backgroundColor: "#F5F5DC", minHeight: "100vh" }}>
            <Navbar />
            <div style={styles.contentContainer}>
                {orderConfirmed ? (
                    <div style={styles.successMessage}>
                        <h1>🎉 Order Placed Successfully! 🎉</h1>
                        <p>Thank you for shopping with VCloset. Your order will be delivered soon!</p>
                    </div>
                ) : (
                    <div style={styles.container}>
                        <h1 style={styles.title}>Checkout</h1>

                        {/* Shipping Address */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Shipping Address</h2>
                            {errors.fullName && <p style={styles.errorText}>⚠️ {errors.fullName}</p>}
                            <input type="text" name="fullName" value={shippingInfo.fullName} onChange={handleChange} placeholder="Full Name" style={{ ...styles.input, borderColor: errors.fullName ? "red" : "#ccc" }} required />
                            
                            {errors.streetAddress && <p style={styles.errorText}>⚠️ {errors.streetAddress}</p>}
                            <input type="text" name="streetAddress" value={shippingInfo.streetAddress} onChange={handleChange} placeholder="Street Address" style={{ ...styles.input, borderColor: errors.streetAddress ? "red" : "#ccc" }} required />
                            
                            {errors.city && <p style={styles.errorText}>⚠️ {errors.city}</p>}
                            <input type="text" name="city" value={shippingInfo.city} onChange={handleChange} placeholder="City" style={{ ...styles.input, borderColor: errors.city ? "red" : "#ccc" }} required />
                            
                            {errors.state && <p style={styles.errorText}>⚠️ {errors.state}</p>}
                            <input type="text" name="state" value={shippingInfo.state} onChange={handleChange} placeholder="State" style={{ ...styles.input, borderColor: errors.state ? "red" : "#ccc" }} required />
                            
                            {errors.zipCode && <p style={styles.errorText}>⚠️ {errors.zipCode}</p>}
                            <input type="text" name="zipCode" value={shippingInfo.zipCode} onChange={handleChange} placeholder="ZIP Code" style={{ ...styles.input, borderColor: errors.zipCode ? "red" : "#ccc" }} required />
                            
                            {errors.phone && <p style={styles.errorText}>⚠️ {errors.phone}</p>}
                            <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleChange} placeholder="Phone Number" style={{ ...styles.input, borderColor: errors.phone ? "red" : "#ccc" }} required />
                            
                            <select name="country" value={shippingInfo.country} onChange={handleChange} style={styles.select}>
                                <option value="India">India</option>
                            </select>
                        </div>

                        {/* Payment Method */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Payment Method</h2>
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={styles.select}>
                                <option value="COD">Cash on Delivery</option>
                            </select>
                        </div>

                        {/* Order Summary */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Order Summary</h2>
                            <ul style={styles.productList}>
                                {cart.map((item, index) => (
                                    <li key={index} style={styles.productItem}>
                                        <img src={`http://localhost:5000${item.image}`} alt={item.name} style={styles.productImage} />
                                        <div>
                                            <span style={styles.productName}>{item.name}</span>
                                            <span style={styles.productDetails}>Qty: {item.quantity}</span>
                                        </div>
                                        <span style={styles.productPrice}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div style={styles.summary}>
                                <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                                <p>Shipping Fee: ₹{shippingFee.toFixed(2)}</p>
                                <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
                            </div>
                        </div>

                        <button onClick={handleConfirmOrder} style={styles.confirmButton}>Confirm Order</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        backgroundColor: "#f6f6f6",
        minHeight: "100vh",
    },
    contentContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "80px",
    },
    container: {
        width: '80%',
        maxWidth: '800px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
    },
    title: {
        textAlign: 'center',
        color: '#333',
    },
    section: {
        marginBottom: '20px'
    },
    sectionTitle: {
        borderBottom: '1px solid #ccc',
        paddingBottom: '8px',
        color: '#444'
    },
    productList: {
        listStyle: 'none',
        padding: '0'
    },
    productItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #e0e0e0'
    },
    productImage: {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginLeft: '60px'
    },
    productName: {
        fontWeight: 'bold',
        fontSize: '18px'
    },
    productDetails: {
        fontSize: '14px',
        color: '#666',
        marginLeft: "28px"
    },
    productPrice: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#388e3c'
    },
    summary: {
        padding: '10px',
        borderTop: '1px solid #ccc',
        textAlign: 'right',
        marginTop: '10px'
    },
    select: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc'
    },
    confirmButton: {
        backgroundColor: 'green',
        color: '#fff',
        border: 'none',
        padding: '15px',
        borderRadius: '4px',
        fontSize: '28px',
        width: '100%',
        cursor: 'pointer'
    },
    errorText: {
        color: 'red',
        fontSize: '14px',
    },
    error: {
        textAlign: 'center',
        fontSize: '20px',
        marginTop: '50px',
        color: 'red'
    },
    successMessage: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '20px',
        color: 'green'
    },
    input: {
        width: '100%',
        padding: '10px',
        fontWeight:"bold",
        // fontSize:"16px",
        borderRadius: '4px',
        border: '1px solid #ccc'
    },

};

export default Checkout;
