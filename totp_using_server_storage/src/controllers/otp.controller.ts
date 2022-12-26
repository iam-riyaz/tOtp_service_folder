import { Request, Response } from "express";

import crypto from "crypto";
import { sha256 } from "js-sha256";
import { transporter } from "../config/mail";




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
    
    // Email sending variabls , provide all details, 
    // to whome the email will send what will be dynamic inputs for email
    var emailSendingOptions = {
      from: 'riyaz"s TOTP service',
      to: email,
      subject: 'OTP verification',
      template: 'index',
      context: {
           email:email,
          otp:otp
      }
   }
     //email sending function
    const mailSenderFunction = async () => {
      await transporter.sendMail(emailSendingOptions);
    };

    // calling this function will execute email sending process
    mailSenderFunction()

    res.status(201).send({
      success: true,
      statusCode: 200,
      timestamp:timestamp,
      email:email,
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

    
    

    // extract data from request body
    const email = req.body.email;
    const timestamp = req.body.timestamp;
    const enteredOtp= req.body.otp

  // check if OTP is expired of not , 60000 is showing 60000 miliseconds
  //  which is equivalent ot 1 minute so this otp will  expiring after 1 minute
    if((Date.now() - timestamp)>60000){
      res.status(400).send(
        {
          success:false,
          statusCode:400,
          TraceID: Date.now(),
          message:"Expired otp "
      
        }
      )
      return
    }


    // to check if OTP is valid or not we need to again cerate otp using same prosess as above
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
    statusCode:400,
    TraceID: Date.now(),
    message:"Invalid otp "

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
