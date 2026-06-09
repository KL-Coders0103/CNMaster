import jwt from "jsonwebtoken";

export type TokenPayload = {
  userId: string;
  role: string;
};

export type RefreshTokenPayload = {
  userId: string;
  role: string;
  type: "refresh";
};

export const generateAccessToken = (
  payload: TokenPayload
): string => {
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
};

export const generateRefreshToken = (
  payload: RefreshTokenPayload
): string => {
  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
};

export const verifyAccessToken = (
  token: string
): TokenPayload => {
  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as TokenPayload;
};

export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload => {
  return jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as RefreshTokenPayload;
};