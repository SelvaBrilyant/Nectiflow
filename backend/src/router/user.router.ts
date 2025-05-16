import { PrismaClient } from "../../generated/prisma/client";
import { Router } from "express";
import { UserRepo } from "../repositories/user.repo";
import TokenService from "../services/token.service";
import { UserService } from "../services/user.services";
import { UserController } from "../controller/user.controller";
import { body } from "../middleware/validate-request";
import { freelancerRegisterSchema, clientRegisterSchema } from "../utils/validators/validators";

const userRouter = Router();

const prisma = new PrismaClient();
const userRepository = new UserRepo(prisma);
const tokenService = new TokenService()
const userService = new UserService(userRepository, tokenService);
const userController = new UserController(userService);

userRouter.get("/login", userController.loginUser);
userRouter.get('/auth/google', (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
    res.redirect(url);
});

// Create freelancer
userRouter.post("/create/freelancer", body(freelancerRegisterSchema), userController.createUser);

// Create company/client
userRouter.post("/create/company", body(clientRegisterSchema), userController.createUser);

// userRouter.post('/create', (req,res,next) => {
//     res.json({msg: 'yes'})
// })

export default userRouter;