import { Request, Response } from "express";

import crypto from "crypto";
import { json } from "body-parser";

// ----------------------------------------------------------------
// globle valiables for storing the data

let myData = [
  { data: { email: "", otp: "" }, expireAt: Math.floor(Date.now()) },
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
// ----------------------------------------------------------------

// ----------------------------------------------------------------
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text: any) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

function decrypt(text: any) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// const enct = encrypt("1");

// ----------------------------------------------------------------


// controller to create secret key and send/resend otp to provided email address and responsding QR code URL
export const createOtp = async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.body;

    const otpCreateAlgo = (length: number) => {
      let timeInMilliSecond = String(Date.now());
      let last_digits = "";
      let i = timeInMilliSecond.length - 1;
      let stringLength = length;
      while (length  !=1) {
        last_digits += timeInMilliSecond[i];
        i--;
        length--;
      }
      let addingElements = "";
      for (let j = 5; j < 9; j++) {
        addingElements += timeInMilliSecond[j];
        let addMore= Number(addingElements)-j
        addingElements=String(addMore)
      }

      let otp_number = Number(last_digits) * 8 + Number(addingElements)-1;

      let otp = String(otp_number);
      console.log(otp.length);
      console.log(length);
      if (otp.length < stringLength) {
        while (otp.length < stringLength) {
          otp += "6";
        }
      }

      return String(otp);
    };

    const lengthOfOtp = 6;
    const otp = otpCreateAlgo(lengthOfOtp);

    myData.push({
      data: { email: email, otp: otp },
      expireAt: Math.floor(Date.now() + 60000),
    });

    
    // Email sending otptions
    const mailOptionsSender = {
      to: email,
      subject: `OTP for email verification ${email}`,
      otp: `your OTP is: ${otp} and valid for 30 seconds only`,
    };

    // mailSenderFunction(mailOptionsSender);          //email sending function
    console.info("OTP sent to Email:", Date.now());

    res.status(201).send({
      success: true,
      statusCode: 200,
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

    const otp = req.body.otp;

    console.info("get secretKey form database for verification:", Date.now());

    console.info("otp verification prosess done :", Date.now());

    const otpValidation = () => {
      for (let i = 0; i < myData.length; i++) {
        if (myData[i].data.otp == otp) {
          myData.splice(i, 1);
          return true;
        }
      }
    };

    if (!otpValidation()) {
      res.status(400).send({
        success: false,
        StatusCode: 400,
        TraceID: Date.now(),
        Message: "OTP is invalid",
      });

      return;
    }

    res.status(200).send({
      success: true,
      StatusCode: 200,
      TraceID: Date.now(),
      Message: "OTP verified successfully",
    });

    
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
