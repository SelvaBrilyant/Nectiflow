import { PrismaClient, Role, PermissionName } from '../generated/prisma/client';
import { DEFAULT_PERMISSIONS } from '../src/utils/default-permissions';

export async function runSeed(prisma: PrismaClient) {
    const permissionsCount = await prisma.permission.count();

    if (permissionsCount > 0) {
        const rolesCount = await prisma.rolePermission.count();
        if (rolesCount > 0) {
            console.log('Permissions and roles are already seeded.');
            return;
        }
    }
    console.log(`Start seeding Permissions...`);

    const allPermissionNames = [...new Set(Object.values(DEFAULT_PERMISSIONS).flat())] as PermissionName[];

    // Upsert all permissions
    for (const name of allPermissionNames) {
        await prisma.permission.upsert({
            where: { name },
            update: {},
            create: { name, description: `Permission for ${name}` },
        });
    }

    console.log(`Seeded ${allPermissionNames.length} permissions.`);

    // For each role, create RolePermission
    for (const role of Object.keys(DEFAULT_PERMISSIONS) as Role[]) {
        const permissionNames = DEFAULT_PERMISSIONS[role];
        const permissions = await prisma.permission.findMany({
            where: {
                name: {
                    in: permissionNames,
                },
            },
        });
        const permissionIds = permissions.map((p) => p.id);

        await prisma.rolePermission.upsert({
            where: { role },
            update: {
                permissionIds,
            },
            create: {
                role,
                permissionIds,
            },
        });
        console.log(`Seeded permissions for role: ${role}`);
    }

    console.log(`Seeding finished.`);
}

if (require.main === module) {
    const prisma = new PrismaClient();
    runSeed(prisma)
        .catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
} 