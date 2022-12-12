import nodemailer from "nodemailer";

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
