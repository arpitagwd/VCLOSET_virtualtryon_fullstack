
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//     Firstname: { type: String, required: true },
//     Lastname: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phonenum: { type: String, required: true },
//     address: { type: String, required: true },
// });

// // export const User = mongoose.model("User", userSchema);

// const User = mongoose.model("User", userSchema);
// export default User; 



import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;  // ✅ Use export default for ES Modules
