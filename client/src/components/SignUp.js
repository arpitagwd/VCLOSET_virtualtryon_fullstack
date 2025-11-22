
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
