//below working minimalist ui
// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import api from "../utils/api";
// import { useAuth } from "../context/AuthContext";
// import Navbar from './Navbar';

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location =useLocation();

//   // Extract the page user came from (if available)
//   const from = location.state?.from || sessionStorage.getItem("redirectPath") || "/";



//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); 
  
//     try {
//       const response = await api.post("/users/login", { email, password });
//       if (response.data.token) {
//         login(response.data);

//       // Store `from` path in sessionStorage in case page reloads
//       sessionStorage.setItem("redirectPath", from);


//         navigate(from, { replace: true }); // Redirect to previous page
//       } else {
//         setError("Invalid response from server.");
//       }
//     } catch (err) {
//       console.error("Login error:", err.response?.data || err.message);
//       setError("Invalid email or password");
//     }
//   };

//   return (
//     <div style={{ backgroundColor: "#ffff", minHeight: "100vh", padding: "20px" }}>
//     <Navbar />
//   <div style={styles.container}>
//         <div style={styles.card}>
//           <h2 style={styles.title}>Login</h2>
//           {error && <p style={styles.error}>{error}</p>}
//           <form onSubmit={handleSubmit} style={styles.form}>
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={styles.input}
//             />
//             <div style={styles.passwordContainer}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 style={styles.passwordInput}
//               />
//               <span 
//                 style={styles.togglePassword} 
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </span>
//             </div>
//             <button type="submit" style={styles.button}>Login</button>
//           </form>
//           <p style={styles.registerText}>
//             Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
//           </p>
//         </div>
//       </div>
//       </div>
    
//   );
// }

// const styles = {
//   container: {
//     display: "flex",
//     backgroundColor: "#f4f7f8",

//     justifyContent: "center",
//     alignItems: "center",
//     height: "100vh",
//     // backgroundColor: "#f4f4f4",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: "30px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//     textAlign: "center",
//     width: "350px",
//     animation: "fadeIn 0.5s ease-in-out",
//   },
//   title: {
//     fontSize: "24px",
//     marginBottom: "20px",
//     fontWeight: "bold",
//     color: "#333",
//   },
//   error: {
//     color: "red",
//     fontSize: "14px",
//     marginBottom: "10px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   input: {
//     padding: "10px",
//     marginBottom: "15px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//     fontSize: "16px",
//     transition: "all 0.3s ease-in-out",
//   },
//   passwordContainer: {
//     display: "flex",
//     alignItems: "center",
//     position: "relative",
//   },
//   passwordInput: {
//     flex: 1,
//     padding: "10px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//     fontSize: "16px",
//   },
//   togglePassword: {
//     position: "absolute",
//     right: "10px",
//     cursor: "pointer",
//     fontSize: "18px",
//     userSelect: "none",
//   },
//   button: {
//     padding: "12px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     fontSize: "18px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "background-color 0.3s ease-in-out",
//   },
//   registerText: {
//     marginTop: "15px",
//     fontSize: "14px",
//   },
//   link: {
//     color: "#007bff",
//     textDecoration: "none",
//   },
// };

// export default Login;




import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from './Navbar';

function Login() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});

  const from = location.state?.from || sessionStorage.getItem("redirectPath") || "/";
  const [form, setForm] = useState({
    
    email: "",
    password: "",
  });

  // const handleProtectedRoute = () => {
  //   sessionStorage.setItem("redirectPath", window.location.pathname); // ✅ Store current path
  //   navigate("/login"); // Redirect to login
  // };
  

  const validateForm = () => {
    let newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return alert("🚫 Login failed. Please check all the input fields.");

    try {
      const response = await api.post("/users/login", { email : form.email,password :  form.password });
      if (response.data.token) {
        login(response.data);
        sessionStorage.setItem("redirectPath", from);

        navigate(from, { replace: true });

        setTimeout(() => {
          const redirectPath = sessionStorage.getItem("redirectPath") || "/";
          sessionStorage.removeItem("redirectPath"); 
          navigate(redirectPath, { replace: true });
        }, 500);
        
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ backgroundColor: "#f2f2f2", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back 👋</h2>
          <p style={styles.subtitle}>Login to your VCloset account</p>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>

          {errors.email && <p style={styles.errorText}>⚠️ {errors.email}</p>}
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ ...styles.input, borderColor: errors.email  ? "red" : "#ccc" }}
            />
            {errors.password && <p style={styles.errorText}>⚠️ {errors.password}</p>}

            <div style={styles.passwordContainer}>


              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                
                style={{ ...styles.passwordInput, borderColor: errors.password  ? "red" : "#ccc" }}
                />
              <span
                style={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>



            <button type="submit" style={styles.button}>Login</button>
          </form>
          <p style={styles.registerText}>
            New here?{" "}
            <Link to="/register" style={styles.link}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    animation: "fadeIn 0.6s ease-in-out",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: "14px",
    color: "#7f8c8d",
    marginBottom: "25px",
  },
  error: {
    color: "#e74c3c",
    fontSize: "14px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    marginBottom: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.2s ease",
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
  },
  togglePassword: {
    position: "absolute",
    right: "12px",
    cursor: "pointer",
    fontSize: "18px",
    color: "#888",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "17px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  registerText: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#555",
  },
  link: {
    color: "#007bff",
    fontWeight: "500",
    textDecoration: "none",
  },
};

export default Login;




// import React, { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";  // Import useLocation
// import api from "../utils/api";
// import { useAuth } from "../context/AuthContext";
// import Navbar from "./Navbar";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();  // Get previous location

//   // Extract the page user came from (if available)
//   const from = location.state?.from?.pathname || "/";

//   console.log("Redirecting to:", from); // Debugging
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); 

//     try {
//       const response = await api.post("/users/login", { email, password });
//       if (response.data.token) {
//         login(response.data);
//         console.log("Navigating to:", from); // Debugging
//         navigate(from, { replace: true }); // Redirect to previous page
//       } else {
//         setError("Invalid response from server.");
//       }
//     } catch (err) {
//       console.error("Login error:", err.response?.data || err.message);
//       setError("Invalid email or password");
//     }
//   };

//   return (
//     <div style={{ backgroundColor: "#ffff", minHeight: "100vh", padding: "20px" }}>
//       <Navbar />
//       <div style={styles.container}>
//         <div style={styles.card}>
//           <h2 style={styles.title}>Login</h2>
//           {error && <p style={styles.error}>{error}</p>}
//           <form onSubmit={handleSubmit} style={styles.form}>
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={styles.input}
//             />
//             <div style={styles.passwordContainer}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 style={styles.passwordInput}
//               />
//               <span 
//                 style={styles.togglePassword} 
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </span>
//             </div>
//             <button type="submit" style={styles.button}>Login</button>
//           </form>
//           <p style={styles.registerText}>
//             Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     display: "flex",
//     backgroundColor: "#f4f7f8",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100vh",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: "30px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//     textAlign: "center",
//     width: "350px",
//     animation: "fadeIn 0.5s ease-in-out",
//   },
//   title: {
//     fontSize: "24px",
//     marginBottom: "20px",
//     fontWeight: "bold",
//     color: "#333",
//   },
//   error: {
//     color: "red",
//     fontSize: "14px",
//     marginBottom: "10px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   input: {
//     padding: "10px",
//     marginBottom: "15px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//     fontSize: "16px",
//     transition: "all 0.3s ease-in-out",
//   },
//   passwordContainer: {
//     display: "flex",
//     alignItems: "center",
//     position: "relative",
//   },
//   passwordInput: {
//     flex: 1,
//     padding: "10px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//     fontSize: "16px",
//   },
//   togglePassword: {
//     position: "absolute",
//     right: "10px",
//     cursor: "pointer",
//     fontSize: "18px",
//     userSelect: "none",
//   },
//   button: {
//     padding: "12px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     fontSize: "18px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "background-color 0.3s ease-in-out",
//   },
//   registerText: {
//     marginTop: "15px",
//     fontSize: "14px",
//   },
//   link: {
//     color: "#007bff",
//     textDecoration: "none",
//   },
// };

// export default Login;
