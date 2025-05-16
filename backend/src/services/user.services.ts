import { Prisma, User } from "../../generated/prisma/client";
import bcrypt from 'bcrypt';
import { GenericError } from "../errors/generic-error";
import { UserRepo } from "../repositories/user.repo";
import TokenService from "./token.service";
// import TokenService from "./token.service";

export class UserService {
    private userRepo: UserRepo;

    private tokenService: TokenService;

    constructor(userRepo: UserRepo, tokenService: TokenService) {
        this.userRepo = userRepo;
        this.tokenService = tokenService;
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

        const createdUser = await this.userRepo.createUser({
            ...user,
            password: hashedPassword,
        });

        return createdUser;
    }

    async loginUser(
        email: string,
        userPassword: string,
      ): Promise<{
        token: string;
        user: User;
      }> {
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
}