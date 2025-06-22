import { Request, Response, NextFunction } from 'express';
import TokenService from '../services/token.service';
import { UserRepo } from '../repositories/user.repo';
import { PrismaClient } from '../../generated/prisma/client';
import { GenericError } from '../errors/generic-error';
import { PermissionName, Role } from '../../generated/prisma/client';
import { UnAuthenticatedError } from '../errors/unauthenticated-error';

const prisma = new PrismaClient();
const userRepo = new UserRepo(prisma);
const tokenService = new TokenService();

declare global {
    namespace Express {
        interface Request {
            user?: any;
            currentUser?: any;
        }
    }
}

// Base authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnAuthenticatedError('No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = tokenService.verifyToken(token);

        if (!decoded) {
            throw new UnAuthenticatedError('Invalid token');
        }

        const user = await userRepo.findUserById(decoded.id);

        if (!user) {
            throw new UnAuthenticatedError('User not found');
        }

        // Attach user to request
        req.user = user;
        req.currentUser = user;
        next();
    } catch (error) {
        if (error instanceof UnAuthenticatedError) {
            res.status(error.statusCode).json(error.serializeErrors());
        } else {
            next(error);
        }
    }
};

// Role-based access control
export const requireRole = (roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.currentUser) {
            const error = new UnAuthenticatedError('Authentication required');
            return res.status(error.statusCode).json(error.serializeErrors());
        }

        if (!roles.includes(req.currentUser.role)) {
            const error = new UnAuthenticatedError('Insufficient role permissions');
            return res.status(error.statusCode).json(error.serializeErrors());
        }

        next();
    };
};

// Permission-based access control
export const requirePermission = (permissions: PermissionName[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.currentUser) {
            const error = new UnAuthenticatedError('Authentication required');
            return res.status(error.statusCode).json(error.serializeErrors());
        }

        const userRole = req.currentUser.role;

        // Get role permissions from RolePermission table
        const rolePermission = await prisma.rolePermission.findUnique({
            where: { role: userRole },
        });

        if (!rolePermission) {
            const error = new UnAuthenticatedError('Insufficient permissions');
            return res.status(error.statusCode).json(error.serializeErrors());
        }

        // Get the names of the permissions associated with the role
        const rolePermissions = await prisma.permission.findMany({
            where: {
                id: { in: rolePermission.permissionIds }
            },
            select: { name: true }
        });

        const userPermissionNames = rolePermissions.map(p => p.name);

        // Check if user has all required permissions
        const hasAllPermissions = permissions.every(permission => 
            userPermissionNames.includes(permission)
        );

        if (!hasAllPermissions) {
            const error = new UnAuthenticatedError('Insufficient permissions');
            return res.status(error.statusCode).json(error.serializeErrors());
        }

        next();
    };
};

// Combined middleware for role and permission checking
export const requireAccess = (roles: Role[], permissions: PermissionName[]) => {
    return [authenticate, requireRole(roles), requirePermission(permissions)];
};

// Resource ownership validation
export const validateOwnership = (resourceType: 'user') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.currentUser) {
            const error = new UnAuthenticatedError('Authentication required');
            return res.status(error.statusCode).json(error.serializeErrors());
        }

        const resourceId = req.params.id;
        let isOwner = false;

        switch (resourceType) {
            case 'user':
                isOwner = req.currentUser.id === resourceId;
                break;
        }

        if (!isOwner && req.currentUser.role !== 'SUPER_ADMIN') {
            const error = new UnAuthenticatedError('Access denied: Not the resource owner');
            return res.status(error.statusCode).json(error.serializeErrors());
        }

        next();
    };
}; 