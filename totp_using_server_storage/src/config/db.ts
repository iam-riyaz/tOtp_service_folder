import mongoose from "mongoose";

export const connectDB= async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI || "");
        console.log(`mongoDB connected to port ${conn.connection.port}`);
    }
    catch(err:any){
        process.exit()
    }
}