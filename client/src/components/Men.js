import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const styles = {
  productContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "70px",
    marginTop: "60px",
    flexWrap: "wrap",
  },
  productCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "250px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },
  productCardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
  productImage: {
    width: "100%",
    height: "250px",
    objectFit: "contain",
    borderRadius: "8px",
  },
  productTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginTop: "10px",
  }};

const ProductCard = ({ image, name, price }) => {
  return (
    <div style={styles.productCard}>
      <img src={`http://localhost:5000${image}`} alt={name} style={styles.productImage} />
      <h2 style={styles.productTitle}>{name}</h2>
      <h3 style={{ color: "black" }}>₹{price}</h3>
    </div>
  );
};

const MenClothing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/category/men");
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div style={{ backgroundColor: "#F5F5DC", minHeight: "100vh" }}>
      <Navbar />
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Welcome to Men's Clothing Section...</h2>
      <div style={styles.productContainer}>
        {products.length > 0 ? (
          products.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: "none" }}>
              <ProductCard image={product.image} name={product.name} price={product.price} />
            </Link>
          ))
        ) : (
          <h3>No products available</h3>
        )}
      </div>
    </div>
  );
};

export default MenClothing;
