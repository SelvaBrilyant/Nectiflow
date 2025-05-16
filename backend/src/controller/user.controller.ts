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
                    freelancerPhone
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
            } else {
                const error = new GenericError('Invalid user type');
                next(error);
            }
        }
    );

    public loginUser = asyncErrorHandler(
        async (req: Request, res: Response, _next: NextFunction) => {
          const { email, password } = req.body;
    
          const user = await this.userService.loginUser(email, password);
          res.status(200).json(user);
        },
    );
}  