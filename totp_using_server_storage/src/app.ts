
import dotenv from "dotenv";
import { otpRouter } from "./routes/otp.Route";
import { connectDB } from "./config/db";
import {createServer} from  "./utils/server"
import { errors } from "celebrate";
// import cors from "cors"


dotenv.config();
const app= createServer() 

// app.use(
//   cors({
//     origin: 'https://localhost:5173',
//   })
// )


const port = process.env.PORT || 2001;


// to set the view engine
app.set('view engine','hbs');

app.use("/v1/otp", otpRouter);

// template engine route
// app.get("/",(req,res) => {

// res.render("index",{name:"riyaz","service_name":"riyaz.com",})
// })

app.use(errors());



// connectDB().then(() => {
  
  app.listen(port, () => {
    console.log(`listioning on port ${port}`);
  });
// });

export {app}