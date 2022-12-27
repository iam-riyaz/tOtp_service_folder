import dotenv from "dotenv";
import { otpRouter } from "./routes/otp.Route";
import { connectDB } from "./config/db";
import { createServer } from "./utils/server";
import { errors } from "celebrate";
// import cors from "cors"

dotenv.config();
const app = createServer();

const port = process.env.PORT || 2001;

// to set the view engine
app.set("view engine", "hbs");

// Initiale end point for the OTP server This must be added before writing next endpoint
app.use("/v1/otp", otpRouter);

// this will the error of validation of JOI
app.use(errors());

// connection to DB and Start the server on port
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`listioning on port ${port}`);
  });
});

export { app };
