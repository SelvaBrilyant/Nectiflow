import { PrismaClient } from "../../generated/prisma/client";
import { Router } from "express";
import { UserRepo } from "../repositories/user.repo";
import TokenService from "../services/token.service";
import { UserService } from "../services/user.services";
import { UserController } from "../controller/user.controller";
import { body } from "../middleware/validate-request";
import { 
  freelancerRegisterSchema, 
  clientRegisterSchema, 
  loginSchema, 
  registerSchema, 
  changePasswordSchema, 
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema 
} from "../utils/validators/validators";
import { authenticate } from "../middleware/auth";

const userRouter = Router();

const prisma = new PrismaClient();
const userRepository = new UserRepo(prisma);
const tokenService = new TokenService()
const userService = new UserService(userRepository, tokenService);
const userController = new UserController(userService);

// Login route with validation
userRouter.post("/login", body(loginSchema), userController.loginUser);

// Create freelancer
userRouter.post("/create/freelancer", body(freelancerRegisterSchema), userController.createUser);

// Create company/client
userRouter.post("/create/company", body(clientRegisterSchema), userController.createUser);

// Create company/admin
userRouter.post("/create/admin", body(registerSchema), userController.createUser);

// Get profile (protected route)
userRouter.get("/profile", authenticate, userController.getProfile);

// Change password (protected route)
userRouter.post("/change-password", authenticate, body(changePasswordSchema), userController.changePassword);

// Update user details (protected route)
userRouter.patch("/update", authenticate, body(updateUserSchema), userController.updateUser);

// Forgot password flow
userRouter.post("/forgot-password", body(forgotPasswordSchema), userController.forgotPassword);
userRouter.post("/reset-password", body(resetPasswordSchema), userController.resetPassword);

export default userRouter;