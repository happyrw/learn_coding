import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/index.ts";
import { verifyToken } from "../utils/jwt.ts";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  try {
    const payload = verifyToken(token!);
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
