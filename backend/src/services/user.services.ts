import { Prisma, User, PermissionName } from "../../generated/prisma/client";
import bcrypt from 'bcrypt';
import { GenericError } from "../errors/generic-error";
import { UserRepo } from "../repositories/user.repo";
import TokenService from "./token.service";
import { DEFAULT_PERMISSIONS } from "../utils/default-permissions";
import crypto from 'crypto';
import { EmailService } from "./email.service";

export class UserService {
    private userRepo: UserRepo;
    private tokenService: TokenService;
    private emailService: EmailService;
    private OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

    constructor(userRepo: UserRepo, tokenService: TokenService) {
        this.userRepo = userRepo;
        this.tokenService = tokenService;
        this.emailService = new EmailService();
    }

    private async createUserPermissions(userId: string, userType: 'FREELANCER' | 'COMPANY' | 'ADMIN'): Promise<void> {
        const permissions = DEFAULT_PERMISSIONS[userType];
        
        // Create permissions for the user
        await Promise.all(
            permissions.map(async (permissionName) => {
                // First, get or create the permission
                const permission = await this.userRepo.prisma.permission.upsert({
                    where: { name: permissionName },
                    update: {},
                    create: {
                        name: permissionName,
                        description: `Permission for ${permissionName}`
                    }
                });

                // Then create the user permission
                await this.userRepo.prisma.userPermission.create({
                    data: {
                        userId,
                        permissionId: permission.id
                    }
                });
            })
        );
    }

    async createUser(user: Prisma.UserCreateInput): Promise<User> {
        const existingUser = await this.userRepo.findUserByEmail(user.email).catch((err) => console.log('error', err));

        if (existingUser) {
            throw new GenericError('User already exists');
        }

        if (!user.password) {
            throw new GenericError('Password is required');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Check if this is the first user and should be admin
        const isFirstUser = await this.userRepo.isFirstUser();
        const hasAdmin = await this.userRepo.hasAdminUser();

        // Create user with transaction to ensure atomicity
        const createdUser = await this.userRepo.prisma.$transaction(async (prisma) => {
            let newUser: User;

            if (isFirstUser) {
                // First user becomes admin
                newUser = await this.userRepo.createFirstAdmin({
                    ...user,
                    password: hashedPassword,
                });
            } else if (user.type === 'ADMIN' && !hasAdmin) {
                // If no admin exists and user type is ADMIN
                newUser = await this.userRepo.createFirstAdmin({
                    ...user,
                    password: hashedPassword,
                });
            } else if (user.type === 'ADMIN' && hasAdmin) {
                // Prevent creating additional admins
                throw new GenericError('Admin user already exists');
            } else {
                // Regular user creation
                newUser = await this.userRepo.createUser({
                    ...user,
                    password: hashedPassword,
                });
            }

            // Create default permissions
            await this.createUserPermissions(newUser.id, newUser.type as 'FREELANCER' | 'COMPANY' | 'ADMIN');

            return newUser;
        });

        // Send onboarding email based on user type
        try {
            if (createdUser.type === 'FREELANCER') {
                await this.emailService.sendFreelancerOnboardingEmail(
                    createdUser.email,
                    createdUser.name || 'Freelancer'
                );
            } else if (createdUser.type === 'COMPANY') {
                await this.emailService.sendClientOnboardingEmail(
                    createdUser.email,
                    createdUser.companyName || 'Company'
                );
            }
        } catch (error) {
            console.error('Failed to send onboarding email:', error);
            // Don't throw error as email sending is not critical
        }

        return createdUser;
    }

    async loginUser(
        email: string,
        userPassword: string,
        type: 'FREELANCER' | 'COMPANY' | 'ADMIN'
    ): Promise<{
        token: string;
        user: User;
    } | null> {
        const existingUser = await this.userRepo.findUserByEmail(email);
    
        if (!existingUser) {
            throw new GenericError('User does not exist');
        }

        if (existingUser.type !== type) {
            throw new GenericError('Invalid user type');
        }

        if (!existingUser.password) {
            throw new GenericError('User does not have a password');
        }
    
        const isPasswordValid = await bcrypt.compare(
            userPassword,
            existingUser.password,
        );
    
        if (!isPasswordValid) {
            throw new GenericError('Invalid password');
        }
    
        const token = this.tokenService.signToken(existingUser.id);
    
        return { token, user: existingUser };
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
        const user = await this.userRepo.findUserById(userId);

        if (!user || !user.password) {
            throw new GenericError('User not found');
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            throw new GenericError('Invalid old password');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.userRepo.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return true;
    }

    async updateUser(userId: string, updateData: any): Promise<User> {
        const user = await this.userRepo.findUserById(userId);

        if (!user) {
            throw new GenericError('User not found');
        }

        // Validate that user is not trying to change their type
        if (updateData.type && updateData.type !== user.type) {
            throw new GenericError('Cannot change user type');
        }

        // If email is being updated, check if it's already in use
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.userRepo.findUserByEmail(updateData.email);
            if (existingUser) {
                throw new GenericError('Email already in use');
            }
        }

        // If username is being updated (for freelancers), check if it's already in use
        if (updateData.username && updateData.username !== user.username) {
            const existingUser = await this.userRepo.prisma.user.findUnique({
                where: { username: updateData.username }
            });
            if (existingUser) {
                throw new GenericError('Username already in use');
            }
        }

        const updatedUser = await this.userRepo.prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return updatedUser;
    }

    private generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendPasswordResetOTP(email: string): Promise<boolean> {
        const user = await this.userRepo.findUserByEmail(email);

        if (!user) {
            throw new GenericError('User not found');
        }

        const otp = this.generateOTP();
        const otpExpiry = new Date(Date.now() + this.OTP_EXPIRY);

        // Store OTP in database
        await this.userRepo.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordOTP: otp,
                resetPasswordExpiry: otpExpiry
            }
        });

        // Send OTP via email
        const emailSent = await this.emailService.sendPasswordResetOTP(email, otp);
        
        if (!emailSent) {
            throw new GenericError('Failed to send OTP email');
        }

        return true;
    }

    async resetPasswordWithOTP(
        email: string,
        otp: string,
        newPassword: string
    ): Promise<boolean> {
        const user = await this.userRepo.findUserByEmail(email);

        if (!user) {
            throw new GenericError('User not found');
        }

        if (!user.resetPasswordOTP || !user.resetPasswordExpiry) {
            throw new GenericError('No OTP requested');
        }

        if (user.resetPasswordOTP !== otp) {
            throw new GenericError('Invalid OTP');
        }

        if (new Date() > user.resetPasswordExpiry) {
            throw new GenericError('OTP expired');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP
        await this.userRepo.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordOTP: null,
                resetPasswordExpiry: null
            }
        });

        return true;
    }
}