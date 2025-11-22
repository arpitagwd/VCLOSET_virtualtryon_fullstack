
// import React from "react";
// import { Link } from 'react-router-dom';

// function Navbar() {
//   const styles = {
    
//     navbar: {
//       backgroundColor: "#C0BFBD ",
//       padding: "25px 20px",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       borderBottom: "2px solid #D3D3D3",
//     },
  
//     logoContainer: {
//       display: "flex",
//       alignItems: "center",
//     },
//     logo: {
//       width: "120px", // Adjust width for proper size
//       height: "auto", // Maintain aspect ratio
//     },
//     navList: {
//       display: "flex",
//       gap: "30px",
//       fontSize: "20px",
//       fontWeight: "600",
//       listStyle: "none",
//     },
//     navLink: {
//       color: "black",
//       textDecoration: "none",
//       transition: "color 0.3s ease",
//     },
//     navLinkHover: {
//       color: "gray",
//     },
//     searchContainer: {
//       position: "relative",
//       paddingRight: "55px",
//     },
//     searchInput: {
//       height: "32px",
//       width: "160px",
//       paddingLeft: "28px",
//       border: "2px solid #737373",
//       borderRadius: "16px",
//     },
//     icon: {
//       position: "absolute",
//       top: "8px",
//       left: "5px",
//       width: "16px",
//       height: "16px",
//     },
//     iconContainer: {
//       display: "flex",
//       gap: "20px",
//     },
//     iconStyle: {
//       width: "24px",
//       height: "24px",
//     },
//     brand: {
//       fontSize: "28px",
//       fontWeight: "bold",
//       fontFamily: "serif",
//       color: "#8B8000",
//     },
//     navLinks: {
//       display: "flex",
//       gap: "40px",
//       fontSize: "18px",
//       fontWeight: "600",
//       textDecoration: "none",
//       color: "black",
//     },
//     searchContainer: {
//       display: "flex",
//       alignItems: "center",
//       gap: "10px",
//     },
//     icon: {
//       fontSize: "28px",
//       textDecoration: "none",
//       color: "#fff",
//     },
  
//     searchInput: {
//       padding: "5px 10px",
//       border: "1px solid #ccc",
//       borderRadius: "5px",
//       width: "200px",
//     },
  
//   };

//   return (
//     <nav style={styles.navbar}>
//       {/* <div style={styles.brand}>VCLOSET</div> */}
//       <img src="/logo.png" alt="Logo" width="200" />

//       <div style={styles.searchContainer}>
//         <div style={styles.navLinks}>
//           <Link to="/" style={styles.link}>Home</Link>
//           <Link to="/men" style={styles.link}>Men</Link>
//           <Link to="/women" style={styles.link}>Women</Link>
//           <Link to="/help" style={styles.link}>Help</Link>
//         </div>
//         <div style={styles.searchContainer}>
//           {/* <input type="text" placeholder="Search for items" style={styles.searchInput} />
//           <Link to="/search" style={styles.icon}>🔍</Link>
//           <Link to="/favourites" style={styles.icon}>❤️</Link> */}
//           {/* <Link to="/wishlist" style={styles.icon}>❤️</Link> */}

//           <Link to="/cart" style={styles.icon}>🛒</Link>
//           <Link to="/profile" style={styles.icon}>👤</Link>
//         </div>


//       </div>
//     </nav>
//   );
// };


// export default Navbar;

//fab india styled
import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [hoveredIcon, setHoveredIcon] = useState("");

  const styles = {
    navbar: {
      backgroundColor: "#FFFFFF",
      padding: "5px 30px",
      display: "flex",
      
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #E0E0E0",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    brand: {
      fontSize: "38px",
      fontWeight: "bold",
      fontFamily: "serif",
      color: "#8B5E3B",
      textAlign: "center",
      flexGrow: 1,
    },
    navLinks: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
    },
    link: {
      fontSize: "20px",
      textDecoration: "none",
      color: "#333",
      fontWeight: "500",
      padding: "8px 12px",
      position: "relative",
      transition: "color 0.3s ease",
    },
    linkHoverEffect: {
      position: "relative",
    },
    linkUnderline: {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "2px",
      backgroundColor: "#8B5E3B",
      bottom: 0,
      left: 0,
      transform: "scaleX(0)",
      transformOrigin: "right",
      transition: "transform 0.3s ease-out",
    },
    linkHover: {
      transform: "scaleX(1)",
      transformOrigin: "left",
    },
    indiaLogo: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
    },
    iconContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    tooltip: {
      position: "absolute",
      bottom: "-25px",
      backgroundColor: "#333",
      color: "#fff",
      padding: "5px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      whiteSpace: "nowrap",
      opacity: 0,
      transform: "translateY(10px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      pointerEvents: "none",
    },
    tooltipVisible: {
      opacity: 1,
      transform: "translateY(0)",
    },
  };

  const HoverLink = ({ to, children }) => {
    const [hover, setHover] = useState(false);

    return (
      <Link
        to={to}
        style={{ ...styles.link }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span style={{ position: "relative" }}>
          {children}
          <span
            style={{
              ...styles.linkUnderline,
              ...(hover ? styles.linkHover : {}),
            }}
          />
        </span>
      </Link>
    );
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navLinks}>
        <HoverLink to="/">Home</HoverLink>
        {["Men", "Women", "Help"].map((text) => (
          <HoverLink key={text} to={`/${text.toLowerCase()}`}>
            {text}
          </HoverLink>
        ))}
      </div>

      <p style={styles.brand}>VCLOSET</p>

      <div style={styles.navLinks}>
        {/* <img
          src="https://media.istockphoto.com/id/1471401435/vector/round-icon-of-indian-flag.jpg?s=612x612&w=0&k=20&c=kXy7vTsyhEycfrQ9VmI4FpfBFX2cMtQP5XIvTdU8xDE="
          alt="India"
          style={styles.indiaLogo}
        /> */}

        {/* Cart Icon with Tooltip */}
        <div
          style={styles.iconContainer}
          onMouseEnter={() => setHoveredIcon("cart")}
          onMouseLeave={() => setHoveredIcon("")}
        >
          <Link to="/cart" style={styles.link}>
            🛒
          </Link>
          <div
            style={{
              ...styles.tooltip,
              ...(hoveredIcon === "cart" ? styles.tooltipVisible : {}),
            }}
          >
            Cart
          </div>
        </div>

        {/* Profile Icon with Tooltip */}
        <div
          style={styles.iconContainer}
          onMouseEnter={() => setHoveredIcon("profile")}
          onMouseLeave={() => setHoveredIcon("")}
        >
          <Link to="/profile" style={styles.link}>
            👤
          </Link>
          <div
            style={{
              ...styles.tooltip,
              ...(hoveredIcon === "profile" ? styles.tooltipVisible : {}),
            }}
          >
            Profile
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
