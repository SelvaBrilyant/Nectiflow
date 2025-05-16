import { Prisma, PrismaClient, User } from "../../generated/prisma/client";

export class UserRepo {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findUserById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async createUser(user: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data: user,
        });
    }
}