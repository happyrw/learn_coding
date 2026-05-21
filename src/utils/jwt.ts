import jwt, { type SignOptions } from "jsonwebtoken";

const SECRETE = process.env.JWT_SECRET ?? "";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

export interface TokenPayload {
  userId: string;
  email: string;
}

export function signToken(payload: TokenPayload): string {
  const options: SignOptions = { expiresIn: EXPIRES_IN as any };
  return jwt.sign(payload, SECRETE, options);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRETE) as TokenPayload;
}
