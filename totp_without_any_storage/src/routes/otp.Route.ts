import express from "express";
import * as otpController from "../controllers/otp.controller";
import * as validation from "../middleware/validation/emailAndPhone";

export const otpRouter = express.Router();

// Route to Create OTP and send Email
otpRouter.post("/createOtp", validation.emailAndPhone, otpController.createOtp);

// Route to Validate OTP
otpRouter.post("/validateOtp", otpController.validateOtp);
