import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { BadRequestError } from "../errors/index.ts";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result: any = schema.safeParse(req.body);
    if (!result.success) {
      throw new BadRequestError(
        result.error.issues.map((e: any) => e.message).join(", "),
      );
    }
    (req as any).body = result.data;
    next();
  };
};
