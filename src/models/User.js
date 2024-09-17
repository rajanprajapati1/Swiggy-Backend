// models/User.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  otp: { type: String },
  otpExpires: { type: Date } ,
  addresses: [addressSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
