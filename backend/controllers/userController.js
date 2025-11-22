import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../modelsmongodb/User.js";  
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const registerUser = asyncHandler(async (req, res) => {
    try {
        console.log("Incoming Register Request:", req.body);

        const { firstName, lastName, email, password, phoneNumber, address } = req.body;

        if (!firstName || !lastName || !email || !password || !phoneNumber || !address) {
            console.log("❌ Missing Fields Error");
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log("❌ User Already Exists");
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            address
        });

        if (user) {
            console.log("✅ User Created Successfully");
            generateToken(res, user._id);
            return res.status(201).json({ message: "User registered successfully" });
        } else {
            console.log("❌ User Creation Failed");
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error("❌ Error in Register:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// ✅ Exported loginUser properly
// export const loginUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
  
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // ✅ Generate JWT Token with secret key from .env
//     const token = jwt.sign(
//         { id: user._id, email: user.email },
//         process.env.JWT_SECRET,  // Ensure JWT_SECRET is in .env
//         { expiresIn: "1h" }
//     );

//     // ✅ Send token in the response
//     res.json({ 
//         message: "Login successful", 
//         token, 
//         user: { id: user._id, email: user.email, firstName: user.Firstname } 
//     });
// });

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.json({ token,             user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address
    }
});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
});

// Get Profile
export const getProfile = asyncHandler(async (req, res) => {
    res.json(req.user);
});
