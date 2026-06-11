export const otpTemplate = (
  otp: string
) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>CN MASTER</h2>

      <p>Your OTP for email verification is:</p>

      <h1 style="letter-spacing: 6px;">
        ${otp}
      </h1>

      <p>
        This OTP will expire in 2 minutes.
      </p>

      <p>
        If you didn't request this,
        please ignore this email.
      </p>
    </div>
  `;
};