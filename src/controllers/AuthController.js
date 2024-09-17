import User from "../models/User.js";
import crypto from "crypto";
import { sendEmail } from "./../services/NodeMailer.js";
import jwt from "jsonwebtoken";

class AuthController {
   async register(req, res) {
    const { name, email, phoneNumber } = req.body;
    console.log(req.body);

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        if (existingUser.isEmailVerified) {
          return res.status(400).json({ error: "User already registered" });
        }
        return res.status(400).json({ error: "Email not verified" });
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      const verificationToken = crypto.randomBytes(20).toString("hex");

      if (!otp) {
        res.status(400).json({ message: "otp not genearted" });
      }

      const newUser = new User({
        name,
        email,
        phoneNumber,
        verificationToken,
        otp: otp,
        otpExpires: Date.now() + 3600000,
      });

      await newUser.save();

      const to = email;
      const subject = "Verify your Email - OTP";
      const result = await sendEmail(to, subject, otp);

      if (result.success) {
        return res.status(200).json({
          message:
            "User registered successfully. Please check your email for the OTP.",
        });
      } else {
        await User.deleteOne({ email });
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  }
   async verifyEmail(req, res) {
    const { otp, email } = req.body;

    try {
      const user = await User.findOne({ email: email, otp: otp });

      if (!user) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      if (user?.otpExpires < Date.now()) {
        return res.status(400).json({ error: "OTP has expired" });
      }

      user.isEmailVerified = true;
      user.verificationToken = undefined;
      user.otp = undefined;
      user.otpExpires = undefined;

      await user.save();
      const token = await jwt.sign(
        { userId: user?._id, email: user?.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } 
      );

      res.cookie("auth_token_ssh", token, {
        httpOnly: true,
        secure: true
            }).json({ message: "Login successful", token });

      // return res.status(200).;
    } catch (error) {
      res.status(500).json({ error: "Email verification failed" });
    }
  }
   async login(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || !user.isEmailVerified) {
        return res
          .status(400)
          .json({ error: "User not found or email not verified" });
      }
      const otp = crypto.randomInt(100000, 999999).toString();
      user.otp = otp;
      user.otpExpires = Date.now() + 3600000; // OTP valid for 1 hour

      await user.save();

      const to = email;
      const subject = "Verify your Email - OTP";
      const result = await sendEmail(to, subject, otp);

      if (result.success) {
        return res.status(200).json({
          message: "OTP sent to your email. Please verify the OTP to log in.",
        });
      } else {
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  }
   async logout(req, res) {
    res.cookie("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Expire the cookie
    });
    res.status(200).json({ message: "Logged out successfully" });
  }
   async GetUser(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          msg: "User not authenticated",
          status: 401,
        });
      }
      const VerifiedUser = await User.findOne({ _id: user.userId }).select(
        "-password -role -createdAt -updatedAt -__v "
      );
      if (!VerifiedUser) {
        return res.status(404).json({
          msg: "User not Found",
          status: 401,
        });
      }
      return res.status(200).json({
        msg: "User verified successfully",
        status: 200,
        user: VerifiedUser,
      });
    } catch (error) {
      return res.status(400).json({
        msg: "User Failed to Verify",
        status: 404,
      });
    }
  }
}

export default new AuthController();
