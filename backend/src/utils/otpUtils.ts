import crypto from "crypto";

export const MAX_OTP_ATTEMPTS = 5;

export const generateOtp = (): string => {
    return crypto.randomInt(100000, 1000000).toString();
};

export const getOtpExpiry = (): Date => {
    return new Date(Date.now() + 2 * 60 * 1000);
};

export const getOtpCooldown = (): Date => {
    return new Date(Date.now() + 30 * 1000);
};

export const hashOtp = (otp: string): string => {
    const secret = process.env.OTP_HASH_SECRET ?? process.env.ACCESS_TOKEN_SECRET;
    
    if (!secret) {
        throw new Error("OTP_HASH_SECRET or ACCESS_TOKEN_SECRET must be configured");
    }
    
    return crypto.createHmac("sha256", secret).update(otp).digest("hex");
};

export const isOtpMatch = (otp: string, storedHash: string): boolean => {
    const providedHash = hashOtp(otp);
    const provided = Buffer.from(providedHash, "hex");
    const stored = Buffer.from(storedHash, "hex");
    
    return provided.length === stored.length && crypto.timingSafeEqual(provided, stored);
};
