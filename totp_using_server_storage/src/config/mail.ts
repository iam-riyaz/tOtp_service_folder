import nodemailer from "nodemailer";

import hbs from "nodemailer-express-handlebars"
import path from "path";
import { patch } from "superagent";



// SMTP sender config details
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "",// give email address form which we wanna send all mail to user
    pass: "", //write in-app password of the Email  Address
  },
});


// interfase for Mail sending
export interface mailOptionsSenderType {
  to: string;
  subject: string;
  otp: string;
}

export interface HandlebarsOptionsType {
  viewEngine: 
  {
    extName:string,
    partialsDir:string,
    defaultLayout:boolean
  },
  viewPath:string,
  extName:string
}

export const HandlebarsOptions= {
  viewEngine: 
  {
    extName:".hbs",
    partialsDir:path.resolve("../../view/index"),
    defaultLayout:false
  },
  
  viewPath:path.resolve("../../view/index"),
  extName:".hbs"
}





  // transporter.use('complie',hbs(HandlebarsOptions))
 



// mail sending fucntion declaration this function will  be 
// called with mailOptionsSenderType when mail needs to ve send
export const mailSenderFunction = async (
  mailOptionsSender: mailOptionsSenderType
) => {
  await transporter.sendMail({
    to: mailOptionsSender.to,
    subject: mailOptionsSender.subject,
    text: mailOptionsSender.otp,
  });
};
