import { PrismaClient } from "../../generated/prisma/client";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { NotAuthorizedError } from "../errors/forbidden-error";
import { NotFoundError } from "../errors/not-found-error";
import { PermissionName, Role } from "../../generated/prisma";

const prisma = new PrismaClient();

/**
 * Middleware to apply multiple security handlers.
 */
export const security =
  (...securityHandlers: RequestHandler[]) =>
  (req: Request, res: Response, next: NextFunction) =>
    securityHandlers.forEach((handler) => handler(req, res, next));

/**
 * Check if the user has a specific permission.
 */
export const isGranted = (permission: PermissionName) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = req.currentUser?.customPermissions.map(
      (p: any) => p.permission.name
    );
    if (userPermissions?.includes(permission)) return next();
    return next(new NotAuthorizedError());
  };
};

/**
 * Security middleware to check if the user is accessing their own data or is an admin.
 */
export const userSecurity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.currentUser?.id === req.params.userId ||
    req.currentUser?.role === Role.ADMIN
  ) {
    return next();
  }
  throw new NotAuthorizedError();
};

/**
 * Middleware to validate resource ownership or access rights.
 * Example usage: validate("owner")
 */
export const validate = (type: "owner" | "access") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resourceId = req.params.userId;

    const user = await prisma.user.findUnique({
      where: { id: resourceId },
    });

    if (!user) return next(new NotFoundError("User"));

    if (
      type === "owner" &&
      req.currentUser?.id === user.id
    ) {
      return next();
    }

    if (
      type === "access" &&
      (req.currentUser?.id === user.id || req.currentUser?.role === Role.ADMIN)
    ) {
      return next();
    }

    return next(new NotAuthorizedError());
  };
};
