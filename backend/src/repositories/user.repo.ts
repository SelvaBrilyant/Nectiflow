import { Prisma, PrismaClient, User } from "../../generated/prisma/client";

export class UserRepo {
    constructor(public readonly prisma: PrismaClient) {}

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email }
        });
    }

    async findUserById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async isFirstUser(): Promise<boolean> {
        const userCount = await this.prisma.user.count();
        return userCount === 0;
    }
}