import { Router } from "express";
import { UserRepo } from "../repositories/user.repo";
import TokenService from "../services/token.service";
import { UserService } from "../services/user.services";
import { UserController } from "../controller/user.controller";
import { body } from "../middleware/validate-request";
import { 
  loginSchema, 
  changePasswordSchema, 
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  organizationRegisterSchema
} from "../utils/validators/validators";
import { authenticate } from "../middleware/auth";
import prisma from "../config/prisma";

const userRouter = Router();

const userRepository = new UserRepo(prisma);
const tokenService = new TokenService()
const userService = new UserService(userRepository, tokenService);
const userController = new UserController(userService);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
userRouter.post("/login", body(loginSchema), userController.loginUser);

/**
 * @swagger
 * /users/register/organization:
 *   post:
 *     summary: Register a new organization and the first user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationName
 *               - organizationSubdomain
 *               - name
 *               - email
 *               - password
 *             properties:
 *               organizationName:
 *                 type: string
 *               organizationSubdomain:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization and user created successfully
 *       400:
 *         description: Invalid input
 */
userRouter.post("/register/organization", body(organizationRegisterSchema), userController.registerOrganization);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/profile", authenticate, userController.getProfile);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
userRouter.post("/change-password", authenticate, body(changePasswordSchema), userController.changePassword);

/**
 * @swagger
 * /users/update:
 *   patch:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
userRouter.patch("/update", authenticate, body(updateUserSchema), userController.updateUser);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Request a password reset OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid input
 */
userRouter.post("/forgot-password", body(forgotPasswordSchema), userController.forgotPassword);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid input
 */
userRouter.post("/reset-password", body(resetPasswordSchema), userController.resetPassword);

export default userRouter;