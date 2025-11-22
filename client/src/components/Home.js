import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";

const styles = {
  navbar: {
    backgroundColor: "#1E1E2E", 
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #FFD700", // Gold accent
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  brand: {
    fontSize: "28px",
    fontWeight: "bold",
    fontFamily: "serif",
    color: "#d4af37", // Gold
  },
  navLinks: {
    display: "flex",
    gap: "30px",
  },
  link: {
    fontSize: "18px",
    fontWeight: "600",
    textDecoration: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "background 0.3s ease",
  },
  linkHover: {
    backgroundColor: "#FFD700",
    color: "#1E1E2E",
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  icon: {
    fontSize: "24px",
    textDecoration: "none",
    color: "#FFD700", // Gold icons
    transition: "color 0.3s ease",
  },
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
  },
  price: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1E1E2E",
    marginTop: "5px",
  },
};

const ProductCard = ({ image, name, price }) => {
  const imageUrl = `http://localhost:5000${image}`;

  return (
    
    <div
      style={styles.productCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = styles.productCardHover.transform;
        e.currentTarget.style.boxShadow = styles.productCardHover.boxShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
      }}
    >
      <img src={imageUrl} alt={name} style={styles.productImage} />
      <h2 style={styles.productTitle}>{name}</h2>
      <h3 style={styles.price}>₹{price}</h3>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

    // // Function to shuffle an array using Fisher-Yates Algorithm
    // const shuffleArray = (array) => {
    //   let shuffledArray = [...array]; // Create a copy to avoid mutating state directly
    //   for (let i = shuffledArray.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    //   }
    //   return shuffledArray;
    // };
  

  return (
    <div style={{ backgroundColor: "#F5F5DC", minHeight: "100vh", padding: "20px" }}>
      <Navbar />
      <div style={styles.productContainer}>
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: "none" }}>
            <ProductCard key={product._id} image={product.image} name={product.name} price={product.price} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;


// //fabindia inspired
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import Navbar from "./Navbar";
// const styles = {
//   navbar: {
//     backgroundColor: "#FFFFFF",
//     padding: "15px 40px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottom: "1px solid #E0E0E0",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//   },
//   brand: {
//     fontSize: "38px",
//     fontWeight: "bold",
//     fontFamily: "serif",
//     color: "#8B5E3B",

//     textAlign: "center",
//     flexGrow: 1,
//   },
//   navLinks: {
//     display: "flex",
//     gap: "20px",
//   },
//   link: {
//     fontSize: "16px",
//     textDecoration: "none",
//     color: "#333",
//     fontWeight: "500",
//     padding: "8px 12px",
//   },
//   indiaLogo: {
//     width: "40px",
//     height: "40px",
//     borderRadius: "50%",
//     objectFit: "cover",
//   },
//   bannerContainer: {
//     padding: "5px 0", // Minimal padding for a compact layout
//     textAlign: "center",
//   },
//   banner: {
//     width: "50%", // Reduce width further
//     height: "120px", // Decrease height even more
//     objectFit: "cover",
//     display: "block",
//     margin: "0 auto",
//   },

//   productGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
//     // height: "600px",
//     gap: "50px",
//     padding: "30px",
//   },
//   productCard: {
//     backgroundColor: "#FFF",
//     padding: "15px",
//     color:"black",
//     borderRadius: "8px",
//     textAlign: "center",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     transition: "transform 0.3s ease, box-shadow 0.3s ease",
//   },
//   productImage: {
//     width: "70%",
//     height: "250px",
//     objectFit: "cover",
//     borderRadius: "8px",
//   },
// };


// const BannerCarousel = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   };


//   return (
//     <div style={styles.bannerContainer}>
//       <Slider {...settings}>
//         {[
//           "https://cdn.shopify.com/s/files/1/0069/4190/0851/files/1_c85dd4b8-ff7f-4b19-9485-fe8b18185c71.png?v=1618505428",
//           "https://www.mybodymodel.com/wp-content/uploads/2019/11/My-virtual-fitting-room-for-online-clothes-shopping-by-Julie.png",
//           "https://mysideof50.com/wp-content/uploads/2018/01/Building-a-Wardrobe-You-Love-1.png"
//         ].map((src, index) => (
//           <img key={index} src={src} alt="Banner" style={styles.banner} />
//         ))}
//       </Slider>
//     </div>
//   );
// };

// const ProductCard = ({ image, name, price }) => {
//   return (
//     <div style={styles.productCard}>
//       <img src={`http://localhost:5000${image}`} alt={name} style={styles.productImage} />
//       <h2>{name}</h2>
//       <h3>₹{price}</h3>
//     </div>
//   );
// };

// const Home = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/products");
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   return (
//     <div style={{ backgroundColor: "#F5F5DC", minHeight: "100vh" }}>
//       <Navbar />
//       <BannerCarousel />
//       <div style={styles.productGrid}>
//         {products.map((product) => (
//           <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: "none" }}>
//             <ProductCard image={product.image} name={product.name} price={product.price} />
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;
