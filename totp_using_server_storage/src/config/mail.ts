import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import dotenv from "dotenv";
dotenv.config();

// extractaing SMTP credentials from .env file
let username;
let password;
const getSmtpCredentialFunction = () => {
  try {
    username = process.env.SMTP_USER;
    password = process.env.SMTP_PASS;
    return;
  } catch {
    return "";
  }
};

// calling this function will set value to the "username" and "password" from .env file
getSmtpCredentialFunction();

// SMTP sender config details
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: username, // email address form which we wanna send all mail to user
    pass: password, // in-app password of the Email  Address
  },
});

// this abject define all the required feild form setting Dynamic Tamplate
var options = {
  viewEngine: {
    extname: ".hbs", // handlebars extension
    layoutsDir: "./views", // location of handlebars templates
    defaultLayout: "index", // name of main template
    partialsDir: "./views",
  },
  viewPath: "./views",
  extName: ".hbs",
};

//attach the plugin to the nodemailer transporter
transporter.use("compile", hbs(options));

//send mail with options
var mail = {
  from: "from@domain.com",
  to: "riyazahmad.online@gmail.com",
  subject: "Test",
  template: "index",
  context: {
    name: "Name is riyaz",
  },
};

// calling this function will send the email by passing the Mail object in .sendMail() method
export const mailSenderFunction = async () => {
  await transporter.sendMail(mail);
};
