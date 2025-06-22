import { PrismaClient } from '../../generated/prisma';
import { PLAN_LIMITS } from '../config/planLimits';


export async function checkPlanLimit({
  prisma,
  organizationId,
  type,
}: {
  prisma: PrismaClient;
  organizationId: string;
  type: 'users' | 'projects' | 'roles';
}) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { plan: true },
  });

  if (!org) throw new Error('Organization not found');

  const plan = org.plan as keyof typeof PLAN_LIMITS;
  const limit = PLAN_LIMITS[plan][
    type === 'users'
      ? 'maxMembersPerOrg'
      : type === 'projects'
      ? 'maxProjectsPerOrg'
      : 'maxRolesPerOrg'
  ];

  let count = 0;

  if (type === 'users') {
    count = await prisma.user.count({ where: { organizationId } });
  } else if (type === 'projects') {
    count = await prisma.project.count({ where: { organizationId } });
  } else if (type === 'roles') {
    count = await prisma.rolePermission.count({ where: { role: { not: 'SUPER_ADMIN' } } });
  }

  if (count >= limit) {
    throw new Error(`Limit reached for ${type}. Your current plan allows maximum ${limit}.`);
  }
}
