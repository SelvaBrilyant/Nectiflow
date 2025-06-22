export const PLAN_LIMITS = {
    WORKER_BEE: {
      maxMembersPerOrg: 10,
      maxRolesPerOrg: 3,
      maxProjectsPerOrg: 10,
      maxTasksPerProject: 50,
    },
    HONEY_COMB: {
      maxMembersPerOrg: 50,
      maxRolesPerOrg: 8,
      maxProjectsPerOrg: 15,
      maxTasksPerProject: 100,
    },
    QUEEN_HIVE: {
      maxMembersPerOrg: Infinity,
      maxRolesPerOrg: Infinity,
      maxProjectsPerOrg: 25,
      maxTasksPerProject: 200,
    },
  };
  