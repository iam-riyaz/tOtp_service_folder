import express from "express";
import * as otpController from "../controllers/otp.controller";
import * as validation from "../middleware/validation/emailAndPhone"


export const otpRouter = express.Router();


otpRouter.post("/createOtp",validation.emailAndPhone, otpController.createOtp);

otpRouter.post("/validateOtp", otpController.validateOtp);



