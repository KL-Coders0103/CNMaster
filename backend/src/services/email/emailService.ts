import nodemailer from "nodemailer";
import { 
  verificationOtpTemplate, 
  forgotPasswordOtpTemplate, 
  passwordResetSuccessTemplate 
} from "./templates/otpTemplate"; 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Used during registration and resend OTP
export const sendOtpEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"CN MASTER" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your CN Master Account",
    html: verificationOtpTemplate(otp),
  });
};

// Used during the "Forgot Password" flow
export const sendForgotPasswordOtp = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"CN MASTER Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "CN Master - Password Reset Request",
    html: forgotPasswordOtpTemplate(otp),
  });
};

// Used after the user successfully resets their password
export const sendPasswordResetSuccessEmail = async (email: string) => {
  await transporter.sendMail({
    from: `"CN MASTER Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your CN Master Password Has Been Changed",
    html: passwordResetSuccessTemplate(),
  });
};