import express from "express";
import dotenv from "dotenv";
import { otpRouter } from "./routes/otp.Route";
import { connectDB } from "./config/db";
import {createServer} from  "./utils/server"
import { errors } from "celebrate";


dotenv.config();



const port = process.env.PORT || 2000;

const app= createServer()

app.use("/v1/otp", otpRouter);

app.get("/",(req,res) => {
console.log("server is running");
res.send("server is running");
})


app.use(errors());




connectDB().then(() => {
  
  app.listen(port, () => {
    console.log(`listioning on port ${port}`);
  });
});

export {app}