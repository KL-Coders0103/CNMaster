export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOtpExpiry = (): Date => {
  return new Date(Date.now() + 2 * 60 * 1000);
};

export const getOtpCooldown = (): Date => {
  return new Date(Date.now() + 30 * 1000);
};