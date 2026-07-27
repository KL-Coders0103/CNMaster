import nodemailer from "nodemailer";
import { 
  verificationOtpTemplate, 
  forgotPasswordOtpTemplate, 
  passwordResetSuccessTemplate 
} from "./templates/otpTemplate"; 

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  pool: true, 
  maxConnections: 5,
  maxMessages: 100,
});

const dispatchEmail = (mailOptions: nodemailer.SendMailOptions) => {
  transporter.sendMail(mailOptions).catch((err) => {
    console.error(`[EMAIL ERROR] Failed to send email to ${mailOptions.to}:`, err.message);
  });
};

export const sendOtpEmail = (email: string, otp: string) => {
  dispatchEmail({
    from: `"CN MASTER" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your CN Master Account",
    html: verificationOtpTemplate(otp),
  });
};

export const sendForgotPasswordOtp = (email: string, otp: string) => {
  dispatchEmail({
    from: `"CN MASTER Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "CN Master - Password Reset Request",
    html: forgotPasswordOtpTemplate(otp),
  });
};

export const sendPasswordResetSuccessEmail = (email: string) => {
  dispatchEmail({
    from: `"CN MASTER Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your CN Master Password Has Been Changed",
    html: passwordResetSuccessTemplate(),
  });
};