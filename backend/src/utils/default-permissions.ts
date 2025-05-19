import { PermissionName } from "../../generated/prisma/client";

interface DefaultPermissions {
    [key: string]: PermissionName[];
}

export const DEFAULT_PERMISSIONS: DefaultPermissions = {
    ADMIN: [
        // All General Permissions
        PermissionName.VIEW_DASHBOARD,
        PermissionName.UPDATE_PROFILE,
        PermissionName.VIEW_NOTIFICATIONS,
        PermissionName.VIEW_WALLET,

        // Admin/Moderator Permissions
        PermissionName.ACCESS_ADMIN_PANEL,
        PermissionName.VIEW_ALL_USERS,
        PermissionName.BAN_USER,
        PermissionName.UNBAN_USER,
        PermissionName.VERIFY_USER,
        PermissionName.MANAGE_JOBS,
        PermissionName.VIEW_TRANSACTIONS,
        PermissionName.MANAGE_COMMISSION,
        PermissionName.MANAGE_DISPUTES,
        PermissionName.APPROVE_REVIEW,
        PermissionName.DELETE_REVIEW,
        PermissionName.VIEW_SITE_STATS,

        // Optional Features
        PermissionName.USE_AI_ASSISTANT,
        PermissionName.SUMMARIZE_JOB_DESCRIPTION,

        // Dispute System
        PermissionName.CREATE_DISPUTE,
        PermissionName.VIEW_DISPUTE,
        PermissionName.RESOLVE_DISPUTE,

        // Gamification
        PermissionName.VIEW_LEADERBOARD,
        PermissionName.EARN_BADGES,
        PermissionName.LEVEL_UP
    ],

    FREELANCER: [
        // General
        PermissionName.VIEW_DASHBOARD,
        PermissionName.UPDATE_PROFILE,
        PermissionName.VIEW_NOTIFICATIONS,
        PermissionName.VIEW_WALLET,

        // Freelancer Permissions
        PermissionName.BROWSE_JOBS,
        PermissionName.SUBMIT_PROPOSAL,
        PermissionName.WITHDRAW_PROPOSAL,
        PermissionName.CHAT_WITH_CLIENT,
        PermissionName.DELIVER_MILESTONE,
        PermissionName.REQUEST_REVISION,
        PermissionName.REVIEW_CLIENT,
        PermissionName.WITHDRAW_FUNDS,

        // Optional Features
        PermissionName.USE_AI_ASSISTANT,
        PermissionName.GENERATE_PROPOSALS,
        PermissionName.SUMMARIZE_JOB_DESCRIPTION,
        PermissionName.SUGGEST_RATE,

        // Dispute System
        PermissionName.CREATE_DISPUTE,
        PermissionName.VIEW_DISPUTE,

        // Gamification
        PermissionName.VIEW_LEADERBOARD,
        PermissionName.EARN_BADGES,
        PermissionName.LEVEL_UP
    ],

    COMPANY: [
        // General
        PermissionName.VIEW_DASHBOARD,
        PermissionName.UPDATE_PROFILE,
        PermissionName.VIEW_NOTIFICATIONS,
        PermissionName.VIEW_WALLET,

        // Client Permissions
        PermissionName.POST_JOB,
        PermissionName.EDIT_JOB,
        PermissionName.DELETE_JOB,
        PermissionName.VIEW_PROPOSALS,
        PermissionName.HIRE_FREELANCER,
        PermissionName.FUND_MILESTONE,
        PermissionName.RELEASE_PAYMENT,
        PermissionName.REVIEW_FREELANCER,

        // Optional Features
        PermissionName.USE_AI_ASSISTANT,
        PermissionName.SUMMARIZE_JOB_DESCRIPTION,

        // Dispute System
        PermissionName.CREATE_DISPUTE,
        PermissionName.VIEW_DISPUTE,

        // Gamification
        PermissionName.VIEW_LEADERBOARD,
        PermissionName.EARN_BADGES,
        PermissionName.LEVEL_UP
    ]
}; 