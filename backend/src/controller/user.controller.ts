import { NextFunction, Request, Response } from "express";

import { UserService } from "../services/user.services";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import { GenericError } from "../errors/generic-error";

export class UserController {
    private userService: UserService;
  
    constructor(userService: UserService) {
      this.userService = userService;
    }

    public createUser = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const userType = req.body.type;

            if (userType === 'FREELANCER') {
                const {
                    email, password, name, username,
                    experience, education, personalWebsite,
                    resumeLinks, nationality, dob, gender,
                    maritalStatus, bio, freelancerSocials,
                    freelancerPhone, freelancerProfile
                } = req.body;

                const user = await this.userService.createUser({
                    email,
                    password,
                    name,
                    username,
                    experience,
                    education,
                    personalWebsite,
                    resumeLinks,
                    nationality,
                    dob: new Date(dob),
                    gender,
                    maritalStatus,
                    bio,
                    freelancerSocials,
                    freelancerPhone,
                    freelancerProfile,
                    type: "FREELANCER"
                });

                if(!user) {
                    const error = new GenericError('Error: while creating freelancer user');
                    next(error);
                }

                res.status(200).json({
                    status: 'success',
                    message: 'Freelancer created successfully',
                    data: user
                });
            } else if (userType === 'COMPANY') {
                const {
                    email, password, logo, banner,
                    companyName, aboutUs, organisationType,
                    industryType, teamSize, yearEstablished,
                    websiteUrl, companyVision, companySocials,
                    locationLink, phone
                } = req.body;

                const user = await this.userService.createUser({
                    email,
                    password,
                    logo,
                    banner,
                    companyName,
                    aboutUs,
                    organisationType,
                    industryType,
                    teamSize,
                    yearEstablished,
                    websiteUrl,
                    companyVision,
                    companySocials,
                    locationLink,
                    phone,
                    type: "COMPANY"
                });

                if(!user) {
                    const error = new GenericError('Error: while creating company user');
                    next(error);
                }

                res.status(200).json({
                    status: 'success',
                    message: 'Company created successfully',
                    data: user
                });
            } else if (userType === 'ADMIN') {

                const {
                    email, password, name, phone
                } = req.body;

                const user = await this.userService.createUser({
                    email,
                    password,
                    name,
                    phone,
                    type: "ADMIN"
                });

                if(!user) {
                    const error = new GenericError('Error: while creating admin user');
                    next(error);
                }

                res.status(200).json({
                    status: 'success',
                    message: 'Admin created successfully',
                    data: user
                });

            } else {
                const error = new GenericError('Invalid user type');
                next(error);
            }
        }
    );

    public loginUser = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { email, password, type } = req.body;

            const user = await this.userService.loginUser(email, password, type);

            if (!user) {
                const error = new GenericError('Invalid credentials or user type');
                next(error);
                return;
            }

            // Remove sensitive data based on user type
            const { password: _, ...userWithoutPassword } = user.user;
            let sanitizedUser;

            switch (user.user.type) {
                case 'FREELANCER':
                    const { 
                        companyName, aboutUs, organisationType, industryType,
                        teamSize, yearEstablished, websiteUrl, companyVision,
                        companySocials, locationLink, ...freelancerData 
                    } = userWithoutPassword;
                    sanitizedUser = freelancerData;
                    break;

                case 'COMPANY':
                    const {
                        name, username, experience, education, personalWebsite,
                        resumeLinks, nationality, dob, gender, maritalStatus,
                        bio, freelancerSocials, ...companyData
                    } = userWithoutPassword;
                    sanitizedUser = companyData;
                    break;

                case 'ADMIN':
                    const {
                        companyName: _, aboutUs: __, organisationType: ___,
                        industryType: ____, teamSize: _____, yearEstablished: ______,
                        websiteUrl: _______, companyVision: ________, companySocials: _________,
                        locationLink: __________, name: ___________, username: ____________,
                        experience: _____________, education: ______________, personalWebsite: _______________,
                        resumeLinks: ________________, nationality: _________________, dob: __________________,
                        gender: ___________________, maritalStatus: ____________________, bio: _____________________,
                        freelancerSocials: ______________________, ...adminData
                    } = userWithoutPassword;
                    sanitizedUser = adminData;
                    break;

                default:
                    sanitizedUser = userWithoutPassword;
            }

            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: {
                    token: user.token,
                    user: sanitizedUser
                }
            });
        }
    );

    public getProfile = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const user = req.user;

            if (!user) {
                const error = new GenericError('User not found');
                next(error);
                return;
            }

            // Remove sensitive data based on user type
            const { password: _, ...userWithoutPassword } = user;
            let profileData;

            switch (user.type) {
                case 'FREELANCER':
                    const { 
                        companyName, aboutUs, organisationType, industryType,
                        teamSize, yearEstablished, websiteUrl, companyVision,
                        companySocials, locationLink, ...freelancerData 
                    } = userWithoutPassword;
                    profileData = {
                        ...freelancerData,
                        type: 'FREELANCER',
                        // Add any additional freelancer-specific data
                        skills: user.skills || [],
                        languages: user.languages || [],
                        level: user.level || 1,
                        xp: user.xp || 0,
                        badges: user.badges || []
                    };
                    break;

                case 'COMPANY':
                    const {
                        name, username, experience, education, personalWebsite,
                        resumeLinks, nationality, dob, gender, maritalStatus,
                        bio, freelancerSocials, ...companyData
                    } = userWithoutPassword;
                    profileData = {
                        ...companyData,
                        type: 'COMPANY',
                        // Add any additional company-specific data
                        teamSize: user.teamSize || 0,
                        yearEstablished: user.yearEstablished || null
                    };
                    break;

                case 'ADMIN':
                    const {
                        companyName: _, aboutUs: __, organisationType: ___,
                        industryType: ____, teamSize: _____, yearEstablished: ______,
                        websiteUrl: _______, companyVision: ________, companySocials: _________,
                        locationLink: __________, name: ___________, username: ____________,
                        experience: _____________, education: ______________, personalWebsite: _______________,
                        resumeLinks: ________________, nationality: _________________, dob: __________________,
                        gender: ___________________, maritalStatus: ____________________, bio: _____________________,
                        freelancerSocials: ______________________, ...adminData
                    } = userWithoutPassword;
                    profileData = {
                        ...adminData,
                        type: 'ADMIN',
                        // Add any additional admin-specific data
                        isVerified: user.isVerified,
                        isBanned: user.isBanned
                    };
                    break;

                default:
                    profileData = userWithoutPassword;
            }

            res.status(200).json({
                status: 'success',
                data: profileData
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
                next(error);
                return;
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

            const updatedUser = await this.userService.updateUser(userId, updateData);

            if (!updatedUser) {
                const error = new GenericError('Failed to update user details');
                next(error);
                return;
            }

            // Remove sensitive data based on user type
            const { password: _, ...userWithoutPassword } = updatedUser;
            let sanitizedUser;

            switch (updatedUser.type) {
                case 'FREELANCER':
                    const { 
                        companyName, aboutUs, organisationType, industryType,
                        teamSize, yearEstablished, websiteUrl, companyVision,
                        companySocials, locationLink, ...freelancerData 
                    } = userWithoutPassword;
                    sanitizedUser = freelancerData;
                    break;

                case 'COMPANY':
                    const {
                        name, username, experience, education, personalWebsite,
                        resumeLinks, nationality, dob, gender, maritalStatus,
                        bio, freelancerSocials, ...companyData
                    } = userWithoutPassword;
                    sanitizedUser = companyData;
                    break;

                case 'ADMIN':
                    const {
                        companyName: _, aboutUs: __, organisationType: ___,
                        industryType: ____, teamSize: _____, yearEstablished: ______,
                        websiteUrl: _______, companyVision: ________, companySocials: _________,
                        locationLink: __________, name: ___________, username: ____________,
                        experience: _____________, education: ______________, personalWebsite: _______________,
                        resumeLinks: ________________, nationality: _________________, dob: __________________,
                        gender: ___________________, maritalStatus: ____________________, bio: _____________________,
                        freelancerSocials: ______________________, ...adminData
                    } = userWithoutPassword;
                    sanitizedUser = adminData;
                    break;

                default:
                    sanitizedUser = userWithoutPassword;
            }

            res.status(200).json({
                status: 'success',
                message: 'User details updated successfully',
                data: sanitizedUser
            });
        }
    );

    public forgotPassword = asyncErrorHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { email } = req.body;

            const result = await this.userService.sendPasswordResetOTP(email);

            if (!result) {
                const error = new GenericError('Failed to send OTP');
                next(error);
                return;
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
                next(error);
                return;
            }

            res.status(200).json({
                status: 'success',
                message: 'Password reset successfully'
            });
        }
    );
}  