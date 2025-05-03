import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  console.log("================ Error Handler Middleware ================");
  if(err instanceof SyntaxError) {
    // console.log("message", err.message);
    // console.log("name", err.name);
    // console.log("stack", err.stack);
    // throw new BadRequestError(err.message);
    res.status(400).json({ message: err.message });
  }
  console.log(err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  res.status(500).json({
    errors: [{ message: "Something went wrong" }],
  });
};