import mongoose from "mongoose";
import { logger } from "./logger";

// configuration to connect to mongo database
export const connectDB = async () => {
  try {
    // MONGO_URI is secret data imported from .env file
    const conn = await mongoose.connect(process.env.MONGO_URI || "");
    logger.info(`mongoDB connected to port ${conn.connection.port}`);
  } catch (err: any) {
    logger.error("error at connection to MongoDB", err);
    process.exit();
  }
};
