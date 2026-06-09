import jwt from "jsonwebtoken";

type TokenPayload = {
  userId: string;
  role: string;
};

export const generateAccessToken = (
  payload: TokenPayload
): string => {
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

export const generateRefreshToken = (
  payload: TokenPayload
): string => {
  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};