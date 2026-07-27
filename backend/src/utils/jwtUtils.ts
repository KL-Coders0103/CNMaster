import jwt from "jsonwebtoken";
import crypto from "crypto";

export type TokenPayload = {
  userId: string;
  role: string;
};

export type RefreshTokenPayload = {
  userId: string;
  role: string;
  type: "refresh";
};

export type ResetPasswordTokenPayload = {
  email: string;
  type: "resetPassword";
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    jwtid: crypto.randomUUID(),
  });
};

export const generateResetPasswordToken = (payload: ResetPasswordTokenPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as TokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as RefreshTokenPayload;
};

export const verifyResetPasswordToken = (token: string): ResetPasswordTokenPayload => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as ResetPasswordTokenPayload;
};

export const hashRefreshToken = (token: string): string => {
  const secret = process.env.REFRESH_TOKEN_HASH_SECRET ?? process.env.REFRESH_TOKEN_SECRET;

  if (!secret) {
    throw new Error("REFRESH_TOKEN_HASH_SECRET or REFRESH_TOKEN_SECRET must be configured");
  }

  return crypto.createHmac("sha256", secret).update(token).digest("hex");
};

export const getTokenExpiry = (token: string): Date => {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded === "string" || typeof decoded.exp !== "number") {
    throw new Error("Token does not contain an expiration time");
  }

  return new Date(decoded.exp * 1000);
};