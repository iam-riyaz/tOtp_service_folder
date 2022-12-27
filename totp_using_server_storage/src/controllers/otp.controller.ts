import { Request, Response } from "express";
import crypto from "crypto";
import { sha256 } from "js-sha256";
import { transporter } from "../config/mail";

// ----AES - 128 - CBC Encryption---
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
function aes_256_encrypt(text: string) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

// --------SHA-256 Encryption----------
function sha256_encrypt(text: string) {
  return sha256(text);
}

/*
Controller to CREATE OTP and SEND to provided EMAIL address.
A Valid Email Address and 10 DIGIT PHONE is required in REQUEST BODY to 
Else validation error will be thrown to the client
*/
export const createOtp = async (req: Request, res: Response) => {
  try {
    // getting email address from request body
    const { email } = req.body;

    const timestamp = String(Date.now());

    //create unique key using email and current timestamp
    const payload = email + timestamp;

    //encrypt unique key using two encrpytion methods
    const token = sha256_encrypt(aes_256_encrypt(payload));
    const tokenSplitedArray = token.split("");

    // Input for Length of OTP
    const lengthOfOtp = 6;

    // create OTP USING our own algorithm
    let otp = tokenSplitedArray
      .map((e) => {
        if (Number(e)) {
          return e;
        }
      })
      .join("");
    otp = otp.slice(0, lengthOfOtp);

    // Email sending variabls some field are required and some are optional
    const emailSendingOptions = {
      from: 'riyaz"s TOTP service', //optional
      to: email, //required
      subject: "OTP verification", //optional
      template: "index", //required
      context: {
        email: email, //required
        otp: otp, //required
      },
    };

    //email sending function
    const mailSenderFunction = async () => {
      await transporter.sendMail(emailSendingOptions);
    };

    // calling this function will execute email sending process
    mailSenderFunction();

    // sending SUCCESS response to the client
    res.status(201).send({
      success: true,
      statusCode: 200,
      timestamp: timestamp,
      email: email,
      otp: otp,
      TraceID: Date.now(),
      Message:
        "OTP is successfully sent to provided Email/phone and QR code generated",
    });
  } catch {
    // sending ERROR response to the client
    res.status(400).send({
      success: false,
      statusCode: 400,
      TraceID: Date.now(),
      Message: "bad request somethisng went wrong. Please try again",
      path: "http://localhost:2000/v1/otp/createOtp",
    });
  }
};

// Controller to VALIDATE OTP
export const validateOtp = async (req: Request, res: Response) => {
  try {
    // extract data from request body
    const email = req.body.email; //required

    // this timestamp shuld be save value as createOtp controller response timestamp value
    const timestamp = req.body.timestamp; //required

    const enteredOtp = req.body.otp; //required

    // OTP Will be expired in 1 minute or 60000 milliseconds
    const expireInMilliseconds = 60000;

    // check if OTP is expired of not , 60000 is showing 60000 miliseconds
    //  which is equivalent ot 1 minute so this otp will  expiring after 1 minute
    if (Date.now() - timestamp > expireInMilliseconds) {
      
    // sending ERROR response to the client
      res.status(400).send({
        success: false,
        statusCode: 400,
        TraceID: Date.now(),
        message: "Expired otp ",
      });
      return;
    }

    // to check if OTP is valid or not so, we need to again cerate otp using same prosess as above

    //create unique key using email and current timestamp
    let payload = email + timestamp;

    //encrypt unique key using two encrpytion methods
    let token = sha256_encrypt(aes_256_encrypt(payload));
    let tokenSplitedArray = token.split("");

    // Input for Length of OTP
    const lengthOfOtp = 6;

    // create OTP USING our own algorithm
    let otp = tokenSplitedArray
      .map((e) => {
        if (Number(e)) {
          return e;
        }
      })
      .join("");
    otp = otp.slice(0, lengthOfOtp);

    // comparing reacted-OTP and enteredOtp
    if (otp == enteredOtp) {
      
    // sending SUCCESS response to the client
      res.status(200).send({
        success: true,
        StatusCode: 200,
        TraceID: Date.now(),
        Message: "OTP verified successfully",
      });
      return;
    }

    // sending ERROR response to the client
    res.status(400).send({
      success: false,
      statusCode: 400,
      TraceID: Date.now(),
      message: "Invalid otp ",
    });
  } catch {
    // sending ERROR response to the client
    res.status(400).send({
      success: false,
      statusCode: 400,
      TraceID: Date.now(),
      Message: "bad request, Error at validation of OTP",
      path: "http://localhost:2000/v1/otp/createOtp",
    });
  }
};
