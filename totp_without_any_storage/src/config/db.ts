import mongoose from "mongoose";


// configuration to connect to mongo database
export const connectDB= async ()=>{
    try{
        // MONGO_URI is secret data imported from .env file 
        const conn = await mongoose.connect(process.env.MONGO_URI || "");
        console.log(`mongoDB connected to port ${conn.connection.port}`);
    }
    catch(err:any){
        process.exit()
    }
}