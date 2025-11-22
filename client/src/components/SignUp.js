
//good ui


// import React, { useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import Navbar from './Navbar';

// const SignUp = ({ isOpen, onClose }) => {
//     const [message, setMessage] = useState("");
//     const [showPopup, setShowPopup] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
//     const togglePasswordVisibility = () => setShowPassword(prev => !prev);
//     const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

//     const { from, product } = location.state || { from: "/" };
    
//     const [formData, setFormData] = useState({
//         Firstname: "", Lastname: "", email: "", password: "", cpassword: "", address: "", phonenum: ""
//     });

//     if (!isOpen) return null;

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (formData.password !== formData.cpassword) {
//             setMessage("Passwords do not match.");
//             setShowPopup(true);
//             return;
//         }
        
//         try {
//             const response = await axios.post("http://localhost:5000/api/users/signup", formData);
//             setMessage(response.data.message);
//             setShowPopup(true);
            
//             setTimeout(() => {
//                 navigate("/login", { state: { product } });

//                 // navigate("/virtual-tryon", { state: { product } });
//             }, 2500);
//         } catch (error) {
//             setMessage(error.response?.data?.message || "Signup failed.");
//             setShowPopup(true);
//         }
//     };

//     return (
//         <div style={{ backgroundColor: "#ffff", minHeight: "100vh", padding: "20px" }}>
//         <Navbar/>

//         <div style={containerStyle}>
//             <div style={formContainerStyle}>
//                 <h2 style={headingStyle}>Create Your Account</h2>
//                 <form onSubmit={handleSubmit} style={formStyle}>
//                     <input type="text" name="Firstname" placeholder="First Name" onChange={handleChange} required style={inputStyle} />
//                     <input type="text" name="Lastname" placeholder="Last Name" onChange={handleChange} required style={inputStyle} />
//                     <input type="email" name="email" placeholder="Email id" onChange={handleChange} required style={inputStyle} />
//                     <input type="text" name="phonenum" placeholder="Phone Number" onChange={handleChange} required style={inputStyle} />
//                     <input type="text" name="address" placeholder="Address" onChange={handleChange} required style={inputStyle} />
                    
//                     <div style={passwordContainerStyle}>
//                         <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required style={inputStyle} />
//                         <button type="button" onClick={togglePasswordVisibility} style={toggleStyle}>{showPassword ? "👁️" : "🙈"}</button>
//                     </div>
                    
//                     <div style={passwordContainerStyle}>
//                         <input type={showConfirmPassword ? "text" : "password"} name="cpassword" placeholder="Confirm Password" onChange={handleChange} required style={inputStyle} />
//                         <button type="button" onClick={toggleConfirmPasswordVisibility} style={toggleStyle}>{showConfirmPassword ? "👁️" : "🙈"}</button>
//                     </div>
                    
//                     <button type="submit" style={buttonStyle}>SIGN UP</button>
//                 </form>
//             </div>
            
//             {showPopup && (
//                 <div style={popupStyle}>
//                     <p>{message}</p>
//                     <button onClick={() => setShowPopup(false)} style={buttonStyle}>OK</button>
//                 </div>
//             )}
//         </div>
//         </div>

//     );
// };

// const containerStyle = {
//     display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f4f4f9"
// };

// const formContainerStyle = {
//     backgroundColor: "#fff", color: "#333", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", width: "380px", textAlign: "center"
// };

// const headingStyle = {
//     marginBottom: "20px", color: "#444"
// };

// const formStyle = {
//     display: "flex", flexDirection: "column", gap: "12px"
// };

// const inputStyle = {
//     width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px", outline: "none"
// };

// const passwordContainerStyle = {
//     position: "relative", width: "100%"
// };

// const buttonStyle = {
//     width: "100%", backgroundColor: "#6366F1", color: "white", padding: "14px", marginTop: "15px", borderRadius: "6px", fontSize: "18px", fontWeight: "bold", border: "none", cursor: "pointer", transition: "background 0.3s"
// };

// const toggleStyle = {
//     background: "none", border: "none", cursor: "pointer", position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "18px"
// };

// const popupStyle = {
//     position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#fff", padding: "20px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", borderRadius: "10px", textAlign: "center", width: "300px"
// };

// export default SignUp;


// import { useState } from "react";
// import API from "../utils/api";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phoneNumber: "", address: "" });
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/users/register", form);
//       navigate("/login");
//     } catch (error) {
//       alert("Registration failed");
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input type="text" placeholder="First Name" onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
//         <input type="text" placeholder="Last Name" onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
//         <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
//         <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
//         <input type="text" placeholder="Phone Number" onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required />
//         <input type="text" placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} required />
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// };

// export default Register;




// import { useState } from "react";
// import { useNavigate,useLocation } from "react-router-dom";
// import API from "../utils/api";
// import Navbar from "./Navbar";

// const Register = () => {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",

//     phoneNumber: "",
//     address: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const location = useLocation();

//   const navigate = useNavigate();

//   const validateForm = () => {
//     let newErrors = {};
    
//     if (!form.firstName.trim()) newErrors.firstName = "First Name is required";
//     if (!form.lastName.trim()) newErrors.lastName = "Last Name is required";
//     if (!form.email.trim()) newErrors.email = "Email is required";
//     if (!form.password.trim()) {
//       newErrors.password = "Password is required";
//     } else if (form.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     }
//     if (!form.confirmPassword.trim()) {
//       newErrors.confirmPassword = "Confirm Password is required";
//     } else if (form.password !== form.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
    
//     if (!form.address.trim()) newErrors.address = "Address is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return       alert("Registration failed");
//     ;

//     try {
//       await API.post("/users/register", form);
//       navigate("/login");
//     } catch (error) {
//       alert("Registration failed");
//     }
//   };

//   return (
//       <div style={{ backgroundColor: "#ffff", minHeight: "100vh", padding: "20px" }}>
//         <Navbar />
    
//     <div style={styles.container}>
//       <div style={styles.formContainer}>
//         <h2 style={styles.heading}>Register</h2>
//         <form onSubmit={handleRegister} style={styles.form}>
//           <input
//             type="text"
//             placeholder="First Name"
//             value={form.firstName}
//             onChange={(e) => setForm({ ...form, firstName: e.target.value })}
//             style={{ ...styles.input, borderColor: errors.firstName ? "red" : "#ccc" }}
//           />
//           {errors.firstName && <p style={styles.errorText}>{errors.firstName}</p>}

//           <input
//             type="text"
//             placeholder="Last Name"
//             value={form.lastName}
//             onChange={(e) => setForm({ ...form, lastName: e.target.value })}
//             style={{ ...styles.input, borderColor: errors.lastName ? "red" : "#ccc" }}
//           />
//           {errors.lastName && <p style={styles.errorText}>{errors.lastName}</p>}

//           <input
//             type="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             style={{ ...styles.input, borderColor: errors.email ? "red" : "#ccc" }}
//           />
//           {errors.email && <p style={styles.errorText}>{errors.email}</p>}

//           {/* Password Input with Monkey Eye Toggle */}
//           <div style={styles.passwordContainer}>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password (Min. 8 characters)"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               style={{ ...styles.input, borderColor: errors.password ? "red" : "#ccc", width: "100%" }}
//             />
//             <span 
//               style={styles.eyeIcon} 
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? "👁️": "🙈"}
//             </span>
//           </div>
//           {errors.password && <p style={styles.errorText}>{errors.password}</p>}

//           <div style={styles.passwordContainer}>
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="Confirm Password"
//               value={form.confirmPassword}
//               onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
//               style={{ ...styles.input, borderColor: errors.confirmPassword ? "red" : "#ccc", width: "100%" }}
//             />
//             <span 
//               style={styles.eyeIcon} 
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//             >
//               {showConfirmPassword ?  "👁️": "🙈" }
//             </span>
//           </div>
//           {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}

//           <input
//             type="text"
//             placeholder="Phone Number"
//             value={form.phoneNumber}
//             onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
//             style={{ ...styles.input, borderColor: errors.phoneNumber ? "red" : "#ccc" }}
//           />
//           {errors.phoneNumber && <p style={styles.errorText}>{errors.phoneNumber}</p>}

//           <input
//             type="text"
//             placeholder="Address"
//             value={form.address}
//             onChange={(e) => setForm({ ...form, address: e.target.value })}
//             style={{ ...styles.input, borderColor: errors.address ? "red" : "#ccc" }}
//           />
//           {errors.address && <p style={styles.errorText}>{errors.address}</p>}

//           <button type="submit" style={styles.button}>Register</button>
//         </form>
//       </div>
//     </div>
//     </div>

//   );
// };

// const styles = {
//   container: {
//     backgroundColor: "#f4f7f8",
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "column",
//   },
//   formContainer: {
//     backgroundColor: "#fff",
//     padding: "30px",
//     borderRadius: "8px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     width: "400px",
//     textAlign: "center",
//   },
//   heading: {
//     fontSize: "24px",
//     marginBottom: "20px",
//     color: "#333",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   input: {
//     padding: "10px",
//     marginBottom: "10px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//     fontSize: "16px",
//     outline: "none",
//     transition: "border 0.2s ease-in-out",
//   },
//   passwordContainer: {
//     display: "flex",
//     alignItems: "center",
//     position: "relative",
//   },
//   eyeIcon: {
//     position: "absolute",
//     right: "10px",
//     cursor: "pointer",
//     fontSize: "18px",
//   },
//   errorText: {
//     color: "red",
//     fontSize: "12px",
//     marginBottom: "10px",
//   },
//   button: {
//     padding: "10px",
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontSize: "16px",
//     transition: "background 0.3s",
//   },
// };

// export default Register;


//above working minimal ui



import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../utils/api";
import Navbar from "./Navbar";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
  });
  const [showModal, setShowModal] = useState(false);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";

    if (!agreeTerms) newErrors.terms = "You must agree to the terms";


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return alert("🚫 Registration failed. Please check all the input fields.");

    try {
      await API.post("/users/register", form);
      alert("🎉 Registered Successfully! Redirecting you to Login");
      navigate("/login");
    } catch (error) {
      alert("❌ Registration failed. Try again later.");
    }
  };

  return (
    <div style={{ backgroundColor: "#f2f2f2", minHeight: "100vh", padding: "20px" }}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Create Account</h2>
          <form onSubmit={handleRegister} style={styles.form}>
            {/* First Name */}
            {errors.firstName && <p style={styles.errorText}>⚠️ {errors.firstName}</p>}

            <input
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              style={{ ...styles.input, borderColor: errors.firstName ? "red" : "#ccc" }}
            />

            {/* Last Name */}
            {errors.lastName && <p style={styles.errorText}>⚠️ {errors.lastName}</p>}

            <input
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              style={{ ...styles.input, borderColor: errors.lastName ? "red" : "#ccc" }}
            />

            {/* Email */}
            {errors.email && <p style={styles.errorText}>⚠️ {errors.email}</p>}

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ ...styles.input, borderColor: errors.email ? "red" : "#ccc" }}
            />

            {/* Password */}
            {errors.password && <p style={styles.errorText}>⚠️ {errors.password}</p>}

            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (Min. 8 characters)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ ...styles.input, borderColor: errors.password ? "red" : "#ccc", width: "100%" }}
              />
              <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Confirm Password */}
            {errors.confirmPassword && <p style={styles.errorText}>⚠️ {errors.confirmPassword}</p>}

            <div style={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                style={{ ...styles.input, borderColor: errors.confirmPassword ? "red" : "#ccc", width: "100%" }}
              />
              <span style={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "🙈" : "👁️" }
              </span>
            </div>

            {/* Phone */}
            {errors.phoneNumber && <p style={styles.errorText}>⚠️ {errors.phoneNumber}</p>}

            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              style={{ ...styles.input, borderColor: errors.phoneNumber ? "red" : "#ccc" }}
            />

            {/* Address */}
            {errors.address && <p style={styles.errorText}>⚠️ {errors.address}</p>}

            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={{ ...styles.input, borderColor: errors.address ? "red" : "#ccc" }}
            />

<div style={styles.termsContainer}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
              />
              <label
                // onMouseEnter={() => setShowTooltip(true)}
                // onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowModal(true)}

                style={styles.termsLabel}
              >
               <b>I agree to the Terms and Conditions</b> 
              </label>
              {/* {showTooltip && <div style={styles.tooltip}>By signing in, you agree to our terms and privacy policy.</div>} */}
            </div>
            {errors.terms && <p style={styles.errorText}>⚠️ {errors.terms}</p>}


            {/* Submit */}
            <button type="submit" style={styles.submitBtn}>
              🚀 Register Now
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Terms and Conditions</h3>
            <p>Welcome to VCloset! </p>
            <p>These Terms and Conditions govern your use of our website and services. By accessing or using VCloset, you agree to be bound by these terms.</p>
            <p><b>1.Use of Our Services :</b> (Eligibility) You must be at least 18 years old to use VCloset.</p>
            <p><b>2. Virtual Try-On Feature :</b>
<p>
         <b>2.1 Camera Access:</b> Our platform allows users to turn on their camera to try on clothes virtually. By enabling your camera, you consent to the use of this feature.
</p>
<b>2.2 No Data Storage:</b> We do not store, record, or save any user camera feed or images used for the virtual try-on feature. All processing is done in real-time and is deleted immediately after use.</p>
            <button onClick={() => setShowModal(false)} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    height: "500px",

    padding: "30px",
    borderRadius: "8px",
    textAlign: "center",
    width: "500px",
  },
  closeButton: {
    marginTop: "10px",
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }
,
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "40px 30px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },
  errorText: {
    color: "red",
    marginBottom: "10px",
    fontSize: "13px",
  },
  termsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    position: "relative",
    marginTop: "10px",
  },
  termsLabel: {
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
    textDecoration: "underline",
  },
  tooltip: {
    position: "absolute",
    bottom: "100%",
    left: "0",
    backgroundColor: "#000",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    zIndex: "10",
  }
,

  heading: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    marginBottom: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.2s ease",
  },
  errorText: {
    color: "red",
    marginBottom: "10px",
    fontSize: "13px",
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    cursor: "pointer",
    fontSize: "18px",
  },
  submitBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
};

export default Register;
