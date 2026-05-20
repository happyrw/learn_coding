import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.ts";
import type { ErrorResponse } from "../types/ErrorResponse.ts";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const isDev = process.env.NODE_ENV === "development";

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
      ...(isDev && { stack: err.stack }),
    };

    res.status(err.statusCode).json(response);
    // res.status(err.statusCode).json(response);
    return;
  }

  // Unexpected / programmer error — don't leak details
  console.error("Unexpected error:", err);

  const response: ErrorResponse = {
    status: "error",
    statusCode: 500,
    message: isDev ? err.message : "Something went wrong. Please try again.",
    ...(isDev && { stack: err.stack }),
  };

  res.status(500).json(response);
}
