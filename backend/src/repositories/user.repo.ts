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

    async createUser(user: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data: user
        });
    }

    async isFirstUser(): Promise<boolean> {
        const userCount = await this.prisma.user.count();
        return userCount === 0;
    }

    async hasAdminUser(): Promise<boolean> {
        const adminCount = await this.prisma.user.count({
            where: {
                type: 'ADMIN'
            }
        });
        return adminCount > 0;
    }

    async createFirstAdmin(user: Prisma.UserCreateInput): Promise<User> {
        // Check if this is the first user
        const isFirst = await this.isFirstUser();
        if (!isFirst) {
            throw new Error('Cannot create first admin: Users already exist');
        }

        // Create admin user
        return this.prisma.user.create({
            data: {
                ...user,
                type: 'ADMIN',
                isVerified: true // First admin is automatically verified
            }
        });
    }
}