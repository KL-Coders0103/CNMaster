// --- 1. Email Verification (Registration) ---
export const verificationOtpTemplate = (otp: string) => {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
        <h2 style="color: #2b6cb0; margin: 0;">CN MASTER</h2>
      </div>
      <div style="padding: 20px 0; color: #333;">
        <p style="font-size: 16px;">Welcome to CN Master!</p>
        <p style="font-size: 16px;">Please use the OTP below to verify your email address and complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2b6cb0; background-color: #ebf8ff; padding: 15px 30px; border-radius: 8px;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #666;">This OTP is valid for <strong>2 minutes</strong>.</p>
        <p style="font-size: 14px; color: #666;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} CN Master. All rights reserved.</p>
      </div>
    </div>
  `;
};

// --- 2. Forgot Password OTP ---
export const forgotPasswordOtpTemplate = (otp: string) => {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
        <h2 style="color: #e53e3e; margin: 0;">CN MASTER</h2>
      </div>
      <div style="padding: 20px 0; color: #333;">
        <p style="font-size: 16px;">We received a request to reset your password.</p>
        <p style="font-size: 16px;">Enter the OTP below to authorize the password reset:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #e53e3e; background-color: #fff5f5; padding: 15px 30px; border-radius: 8px;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #666;">This OTP is valid for <strong>2 minutes</strong>.</p>
        <p style="font-size: 14px; color: #e53e3e; font-weight: bold;">If you did not request a password reset, please ignore this email or contact support immediately.</p>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} CN Master. All rights reserved.</p>
      </div>
    </div>
  `;
};

// --- 3. Password Reset Success Confirmation ---
export const passwordResetSuccessTemplate = () => {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
        <h2 style="color: #38a169; margin: 0;">CN MASTER</h2>
      </div>
      <div style="padding: 20px 0; color: #333;">
        <h3 style="color: #38a169;">Password Reset Successful</h3>
        <p style="font-size: 16px;">Your CN Master account password has been successfully updated.</p>
        <p style="font-size: 16px;">You can now log in to your account using your new password.</p>
        <br/>
        <p style="font-size: 14px; color: #666;">If you did not perform this action, please contact our support team immediately to secure your account.</p>
      </div>
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} CN Master. All rights reserved.</p>
      </div>
    </div>
  `;
};