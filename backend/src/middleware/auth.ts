import { Request, Response, NextFunction } from 'express';
import TokenService from '../services/token.service';
import { UserRepo } from '../repositories/user.repo';
import { PrismaClient } from '../../generated/prisma/client';
import { GenericError } from '../errors/generic-error';
import { PermissionName, UserType } from '../../generated/prisma/client';
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
export const requireRole = (roles: UserType[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.currentUser) {
            const error = new UnAuthenticatedError('Authentication required');
            return res.status(error.statusCode).json(error.serializeErrors());
        }

        if (!roles.includes(req.currentUser.type)) {
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

        // Get user permissions
        const userPermissions = await prisma.userPermission.findMany({
            where: { userId: req.currentUser.id },
            include: { permission: true }
        });

        const userPermissionNames = userPermissions.map(up => up.permission.name);

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
export const requireAccess = (roles: UserType[], permissions: PermissionName[]) => {
    return [authenticate, requireRole(roles), requirePermission(permissions)];
};

// Resource ownership validation
export const validateOwnership = (resourceType: 'user' | 'job' | 'proposal') => {
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
            case 'job':
                const job = await prisma.job.findUnique({
                    where: { id: resourceId }
                });
                isOwner = job?.clientId === req.currentUser.id;
                break;
            case 'proposal':
                const proposal = await prisma.proposal.findUnique({
                    where: { id: resourceId }
                });
                isOwner = proposal?.freelancerId === req.currentUser.id;
                break;
        }

        if (!isOwner && req.currentUser.type !== 'ADMIN') {
            const error = new UnAuthenticatedError('Access denied: Not the resource owner');
            return res.status(error.statusCode).json(error.serializeErrors());
        }

        next();
    };
}; 