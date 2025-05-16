import { NextFunction, Request, Response } from "express";
import { UnAuthenticatedError } from "../errors/unauthenticated-error";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    return next(new UnAuthenticatedError());
    /*try {
      throw new UnAuthenticatedError();
      
    } catch (error) {
      next(new UnAuthenticatedError());
    }*/
  }
  // console.log("======== Require Auth ==========", req.currentUser);

  next();
};