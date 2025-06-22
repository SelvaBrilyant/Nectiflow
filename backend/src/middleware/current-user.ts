import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const userId = decodeToken(token); // Decode the token to get the user ID

      const prismaUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (prismaUser) {
        req.currentUser = prismaUser; // Assign the user directly
      } else {
        req.currentUser = null;
      }
    } catch (error: any) {
      console.log('======= Current User Error Exception =========');
      next(error);
    }
  } else {
    req.currentUser = null; // No authorization header
  }
  return next();
};

// Function to decode the token and return the user ID
const decodeToken = (token: string): string => {
  try {
    const secretKey = process.env.JWT_SECRET || "your_secret_key"; // Use your secret key
    const decoded = jwt.verify(token, secretKey) as { id: string }; // Verify and decode the token
    return decoded.id; // Return the user ID from the token payload
  } catch (error) {
    throw new Error("Invalid token"); // Handle invalid token error
  }
};