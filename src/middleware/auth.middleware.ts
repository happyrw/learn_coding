import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/index.ts";
import { verifyToken } from "../utils/jwt.ts";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token!);
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
