import { Request, Response } from "express";

import crypto from "crypto";
import { json } from "body-parser";
import { sha256 } from "js-sha256";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import crc32 from "crc-32";
import { mailSenderFunction } from "../config/mail";

// ----------------------------------------------------------------
// globle valiables for storing the data

let myData = [
  { data: { email: "", encryptedOtp: "" }, expireAt: Math.floor(Date.now()) },
];

async function autoDelete() {
  const interval = setInterval(function () {
    for (const element of myData) {
      if (element.expireAt <= Date.now()) {
        myData.shift();
      }
    }
  }, 100);
}

autoDelete();
// ---------End of autoDelete------------------------------------------------

// ---------AES - 128 - CBC Encryption---------------------------------
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function aes_256_encrypt(text: string) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
  // return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

function aes_256_decrypt(text: any) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
// ----------end of AES - 128 - CBC Encryption-------------------------------


// --------SHA-256 Encryption---------------------------------
function sha256_encrypt(text: string) {
  return sha256(text);
}
// -------end of SHA-256 Encryption--------------------------------



// controller to create secret key and send/resend otp to provided email address and responsding QR code URL
export const createOtp = async (req: Request, res: Response) => {
  try {


    const { email } = req.body;
     let timestamp="";
    
    //  otp Generater function 
    const otpCreateAlgo = (length: number) => {
      timestamp=String(Date.now())
      let payload = email+timestamp
      console.log({payload})
      let token = sha256_encrypt(aes_256_encrypt(payload));
      let otp = "";
      for (let i = 0; i < token.length; i++) {
        if (Number(token[i])) {
          if (otp.length == length) {
            return otp;
          }
          otp += token[i];
        }
      }
      return otp;
    };

    // Input for Length of OTP 
    const lengthOfOtp = 6;
    let otp = otpCreateAlgo(lengthOfOtp);
    


    const mailOptionsSender = {
      to: email,
      subject: `OTP for email verification ${email}`,
      otp: `your OTP is: ${otp} and valid for 30 seconds only`,
    };

     //email sending function
  // mailSenderFunction(mailOptionsSender);      
    console.info("OTP sent to Email:", Date.now());

    

    res.status(201).send({
      success: true,
      statusCode: 200,
      timestamp:timestamp,
      otp: otp,
      TraceID: Date.now(),
      Message:
        "OTP is successfully sent to provided Email/phone and QR code generated",
    });
  } catch {
    res.status(400).send({
      success: false,
      statusCode: 400,
      TraceID: Date.now(),
      Message: "bad request somethisng went wrong. Please try again",
      path: "http://localhost:2000/v1/otp/createOtp",
    });
  }
};

// controller to validate OTP
export const validateOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const timestamp = req.body.timestamp;
    const enteredOtp= req.body.otp

  
    if((Date.now() - timestamp)>60000){
      res.status(400).send(
        {
          success:false,
          message:"OTP is Expired",
        }
      )
      return
    }

    const otpCreateForToValidate = (length: number) => {
      let payload = email + timestamp;
      console.log({payload})
      let token = sha256_encrypt(aes_256_encrypt(payload));
      let otp = "";
      for (let i = 0; i < token.length; i++) {
        if (Number(token[i])) {
          if (otp.length == length) {
            return otp;
          }
          otp += token[i];
        }
      }
      return otp;
    };

    // lenght of otp 
    const lengthOfOtp = 6;
    let otp = otpCreateForToValidate(lengthOfOtp);

if(otp==enteredOtp)
{
  res.status(200).send({
    success: true,
    StatusCode: 200,
    TraceID: Date.now(),
    Message: "OTP verified successfully",
  });
  return
}
res.status(400).send(
  {
    success:false,
    message:"Invalid otp ",
    enteredOtp:enteredOtp,
    timestamp:timestamp,
    otp:otp

  }
)
  
  } catch {
    res.status(400).send({
      success: false,
      statusCode: 400,
      TraceID: Date.now(),
      Message: "bad request, Error at validation of OTP",
      path: "http://localhost:2000/v1/otp/createOtp",
    });
  }
};
