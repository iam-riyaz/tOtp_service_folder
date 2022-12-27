import mongoose from "mongoose";
import { ITempUserData } from "../models/tempUserData.model";

// Schema in which USER Data will be stored in DB
const TotpSchema = new mongoose.Schema<ITempUserData>({
  email: { type: "string", required: true },
  phone: { type: "number", required: true },
  secretKey: { type: "string", required: false },
  expireAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  flag: { type: "boolean", default: false },
  otpauth_url: { type: "string" },
});

export const TempUserDataMongo = mongoose.model<ITempUserData>(
  "tempUserData",
  TotpSchema
);
