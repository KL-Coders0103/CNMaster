import nodemailer from "nodemailer";

import { otpTemplate } from "./templates/otpTemplate";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendOtpEmail = async (
  email: string,
  otp: string
) => {
  await transporter.sendMail({
    from: `"CN MASTER" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "CN MASTER Email Verification OTP",

    html: otpTemplate(otp),
  });
};