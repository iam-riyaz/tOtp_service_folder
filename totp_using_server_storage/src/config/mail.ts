import { Context } from "liquidjs";
import nodemailer from "nodemailer";

import hbs from "nodemailer-express-handlebars";
// import path from "path";
// import { patch } from "superagent";

// SMTP sender config details
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "riyazahmad.online@gmail.com", // give email address form which we wanna send all mail to user
    pass: "ntexmyhpuijearvd", //write in-app password of the Email  Address
  },
});

// // interfase for Mail sending
// export interface mailOptionsSenderType {
//   from: string;
//   to: string;
//   subject: string;
//   otp: string;
// }

// // mail sending fucntion declaration this function will  be
// // called with mailOptionsSenderType when mail needs to ve send
// export const mailSenderFunction = async (
//   mailOptionsSender: mailOptionsSenderType
// ) => {
//   await transporter.sendMail({
//     from: mailOptionsSender.from,
//     to: mailOptionsSender.to,
//     subject: mailOptionsSender.subject,
//     text: mailOptionsSender.otp,
//   });
// };



var options = {
  viewEngine : {
      extname: '.hbs', // handlebars extension
      layoutsDir: './views', // location of handlebars templates
      defaultLayout: 'index', // name of main template
      partialsDir: './views', // location of your subtemplates aka. header, footer etc
  },
  viewPath: './views',
  extName: '.hbs'
  };


//attach the plugin to the nodemailer transporter
transporter.use('compile', hbs(options));
//send mail with options
var mail = {
   from: 'from@domain.com',
   to: 'riyazahmad.online@gmail.com',
   subject: 'Test',
   template: 'index',
   context: {
       name: 'Name is riyaz'
   }
}


export const mailSenderFunction = async () => {
    await transporter.sendMail(mail);
  };
