
import express from 'express';
import {User} from '../modelsmongodb/User.js';
import jwt from 'jsonwebtoken';
// import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { body, validationResult } from 'express-validator';
import dotenv from "dotenv";
// import { getUserCart, addToCart, clearCart, removeFromCart} from "../controllers/userController.js";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; 

router.post('/signup', [
    body("Firstname")
      .matches(/^[a-zA-Z0-9_-]{1,20}$/)
      .withMessage("First name must be 3-20 characters long, only letters, numbers, underscores, and hyphens allowed."),
      body("Lastname")
      .matches(/^[a-zA-Z0-9_-]{1,20}$/)
      .withMessage("Last name must be 3-20 characters long, only letters, numbers, underscores, and hyphens allowed."),

    
    body("email")
      .isEmail()
      .withMessage("Invalid email format."),

    body("password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage("Password must be at least 8 characters, with one uppercase, one lowercase, one number, and one special character."),

    body("cpassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      }),

    body("phonenum")
      .matches(/^\+?\d{10,15}$/)
      .withMessage("Phone number must be 10-15 digits long and can include a leading + for country code."),

    body("address")
      .isLength({ min: 5, max: 100 })
      .withMessage("Address must be between 5 to 100 characters long."),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation Errors:", errors.array()); // Debugging
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const { Firstname,Lastname, email, password, address,phonenum } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email id already exists" });
        }


        // Create user
        const newUser = new User({ Firstname,Lastname, email, password, address,phonenum });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({
          message: "User registered successfully",
      });
  } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      if (password !== user.password) {
          console.log("Incorrect password");
          return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

      res.json({ message: "Login successful", token, user });

  } catch (error) {
      console.error(" Login Error:", error);
      res.status(500).json({ message: "Server error", error });
  }
});



// Get user profile
// router.get('/profile', authenticate, getUserProfile);

// // Update user profile
// router.put('/profile', authenticate, updateUserProfile);

export default router;


// import express from "express";
// import { register, login, logout } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.post("/logout", logout);

// export default router;



