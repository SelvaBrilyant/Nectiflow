import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.services";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import { GenericError } from "../errors/generic-error";
import { Role } from "../../generated/prisma/client";

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public registerOrganization = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const {
                email,
                password,
                name,
                organizationName,
                organizationSubdomain
            } = req.body;

            try {

                
                const { organization, user } = await this.userService.createOrganizationAndUser({
                    organizationName,
                    organizationSubdomain,
                    userData: {
                        email,
                        password,
                        name,
                    }
                });

                const { password: _, ...userWithoutPassword } = user;

                res.status(201).json({
                    status: 'success',
                    message: 'Organization and admin user created successfully',
                    data: {
                        user: userWithoutPassword,
                        organization
                    }
                });
            } catch (error: any) {
                console.log('error', error);
                if (error.code === 'P2002' && error.meta?.target?.includes('subdomain')) {
                    return next(new GenericError('Organization subdomain is already taken.'));
                }
                if (error.message.includes('User already exists')) {
                    return next(new GenericError('A user with this email already exists.'));
                }
                return next(new GenericError('Error creating organization or user.'));
            }
        }
    );

    public loginUser = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { email, password } = req.body;

            const result = await this.userService.loginUser(email, password);

            if (!result) {
                const error = new GenericError('Invalid credentials');
                return next(error);
            }

            const { password: _, ...userWithoutPassword } = result.user;

            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: {
                    token: result.token,
                    user: userWithoutPassword
                }
            });
        }
    );

    public getProfile = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const user = req.user;

            if (!user) {
                const error = new GenericError('User not found');
                return next(error);
            }

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                status: 'success',
                data: userWithoutPassword
            });
        }
    );

    public changePassword = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user.id;

            const updated = await this.userService.changePassword(userId, oldPassword, newPassword);

            if (!updated) {
                const error = new GenericError('Failed to change password');
                return next(error);
            }

            res.status(200).json({
                status: 'success',
                message: 'Password changed successfully'
            });
        }
    );

    public updateUser = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const userId = req.user.id;
            const updateData = req.body;

            // Prevent password update through this endpoint
            delete updateData.password;

            const updatedUser = await this.userService.updateUser(userId, updateData);

            if (!updatedUser) {
                const error = new GenericError('Failed to update user details');
                return next(error);
            }

            const { password: _, ...userWithoutPassword } = updatedUser;

            res.status(200).json({
                status: 'success',
                message: 'User details updated successfully',
                data: userWithoutPassword
            });
        }
    );

    public forgotPassword = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { email } = req.body;

            const result = await this.userService.sendPasswordResetOTP(email);

            if (!result) {
                const error = new GenericError('Failed to send OTP');
                return next(error);
            }

            res.status(200).json({
                status: 'success',
                message: 'OTP sent successfully'
            });
        }
    );

    public resetPassword = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { email, otp, newPassword } = req.body;

            const result = await this.userService.resetPasswordWithOTP(email, otp, newPassword);

            if (!result) {
                const error = new GenericError('Failed to reset password');
                return next(error);
            }

            res.status(200).json({
                status: 'success',
                message: 'Password reset successfully'
            });
        }
    );
}  