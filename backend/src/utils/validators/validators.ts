import { AnySchema } from "joi";

import Joi from "joi";
import { E_UserRole } from "../../types/models";

const socialMediaSchema = Joi.object({
  type: Joi.string().valid('FACEBOOK', 'INSTAGRAM', 'YOUTUBE', 'X').required(),
  url: Joi.string().uri().required()
});

const phoneSchema = Joi.object({
  code: Joi.string().required(),
  number: Joi.string().required()
});

export const registerSchema: AnySchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().max(50).required(),
    password: Joi.string().min(8).required(),
    roles: Joi.array().items(Joi.string().valid(...Object.values(E_UserRole)).required()).unique().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
});

export const freelancerRegisterSchema: AnySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().max(50).required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(3).max(30).required(),
  experience: Joi.array().items(Joi.string()).required(),
  education: Joi.array().items(Joi.string()).required(),
  personalWebsite: Joi.string().uri().required(),
  resumeLinks: Joi.array().items(Joi.string().uri()).required(),
  nationality: Joi.string().required(),
  dob: Joi.date().required(),
  gender: Joi.string().required(),
  maritalStatus: Joi.string().required(),
  bio: Joi.string().required(),
  freelancerSocials: Joi.array().items(socialMediaSchema).length(4).required(),
  freelancerPhone: phoneSchema.required(),
  type: Joi.string().valid('FREELANCER').required()
});

export const clientRegisterSchema: AnySchema = Joi.object({
  email: Joi.string().email().max(50).required(),
  password: Joi.string().min(8).required(),
  logo: Joi.string().uri().required(),
  banner: Joi.string().uri().required(),
  companyName: Joi.string().required(),
  aboutUs: Joi.string().required(),
  organisationType: Joi.string().required(),
  industryType: Joi.string().required(),
  teamSize: Joi.number().integer().min(1).required(),
  yearEstablished: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
  websiteUrl: Joi.string().uri().required(),
  companyVision: Joi.string().required(),
  companySocials: Joi.array().items(socialMediaSchema).length(4).required(),
  locationLink: Joi.string().uri().required(),
  phone: phoneSchema.required(),
  type: Joi.string().valid('COMPANY').required()
});