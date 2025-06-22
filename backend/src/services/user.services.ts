import { Prisma, User, PermissionName, Role, PrismaClient } from "../../generated/prisma/client";
import bcrypt from 'bcrypt';
import { GenericError } from "../errors/generic-error";
import { UserRepo } from "../repositories/user.repo";
import TokenService from "./token.service";
import { DEFAULT_PERMISSIONS } from "../utils/default-permissions";
import crypto from 'crypto';
import { EmailService } from "./email.service";
import { URL } from 'url';

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

    async createOrganizationAndUser(data: {
      organizationName: string;
      organizationSubdomain: string;
      userData: Pick<User, 'name' | 'email' | 'password'>;
    }): Promise<{ user: User, organization: any }> {
        const { organizationName, organizationSubdomain, userData } = data;

        const existingUser = await this.userRepo.findUserByEmail(userData.email);
        if (existingUser) {
            throw new GenericError('User already exists');
        }

        if (!userData.password) {
            throw new GenericError('Password is required');
        }
        
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const isFirstUser = await this.userRepo.isFirstUser();

        let user: User;
        let organization: any;

        try {
            ({ user, organization } = await this.userRepo.prisma.$transaction(async (prisma) => {
                const createdOrganization = await prisma.organization.create({
                    data: {
                        name: organizationName,
                        subdomain: organizationSubdomain,
                    },
                });

                const createdUser = await prisma.user.create({
                    data: {
                        email: userData.email,
                        name: userData.name,
                        password: hashedPassword,
                        role: isFirstUser ? 'SUPER_ADMIN' : 'OWNER',
                        organizationId: createdOrganization.id,
                    },
                });

                return { user: createdUser, organization: createdOrganization };
            }));
        } catch (error) {
            console.error("Failed to create organization, user, and permissions in main DB.", error);
            throw new GenericError("Could not create organization. Please try again.");
        }

        const dbName = `${organizationName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error('DATABASE_URL environment variable is not set.');
        }

        const tenantDatabaseUrl = new URL(databaseUrl);
        tenantDatabaseUrl.pathname = `/${dbName}`;

        const tenantPrisma = new PrismaClient({
            datasources: {
                db: {
                    url: tenantDatabaseUrl.toString(),
                },
            },
        });

        try {
            await tenantPrisma.organization.create({
                data: {
                    id: organization.id,
                    name: organizationName,
                    subdomain: organizationSubdomain,
                },
            });
            return { user, organization };
        } catch (error) {
            console.error("Failed to set up tenant database, rolling back main DB records.", error);
            
            // Manual rollback of records created in the main DB
            await this.userRepo.prisma.user.delete({ where: { id: user.id } }); // This should cascade delete UserPermission
            await this.userRepo.prisma.organization.delete({ where: { id: organization.id } });

            throw new GenericError("Could not create organization. Please try again.");
        } finally {
            await tenantPrisma.$disconnect();
        }
    }

    async loginUser(
        email: string,
        userPassword: string
    ): Promise<{
        token: string;
        user: User;
    } | null> {
        const existingUser = await this.userRepo.findUserByEmail(email);
    
        if (!existingUser) {
            throw new GenericError('User does not exist');
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

        // If email is being updated, check if it's already in use
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.userRepo.findUserByEmail(updateData.email);
            if (existingUser) {
                throw new GenericError('Email already in use');
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