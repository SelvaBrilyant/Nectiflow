// Enums

export enum E_UserRole {
    FREELANCER = "FREELANCER",
    CLIENT = "CLIENT",
    ADMIN = "ADMIN",
  }
  
  export enum E_JobStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    DISPUTED = "DISPUTED",
  }
  
  export enum E_ProposalStatus {
    SENT = "SENT",
    VIEWED = "VIEWED",
    SHORTLISTED = "SHORTLISTED",
    HIRED = "HIRED",
    DECLINED = "DECLINED",
    WITHDRAWN = "WITHDRAWN",
  }
  
  export enum E_TransactionType {
    JOB_POSTING = "JOB_POSTING",
    MILESTONE_PAYMENT = "MILESTONE_PAYMENT",
    PLATFORM_FEE = "PLATFORM_FEE",
    WITHDRAWAL = "WITHDRAWAL",
    REFUND = "REFUND",
  }
  
  export enum E_NotificationType {
    JOB_UPDATE = "JOB_UPDATE",
    NEW_PROPOSAL = "NEW_PROPOSAL",
    MESSAGE = "MESSAGE",
    PAYMENT = "PAYMENT",
    REVIEW = "REVIEW",
    SYSTEM = "SYSTEM",
    DISPUTE = "DISPUTE",
  }
  
  export enum E_PermissionName {
    // Add only a few for brevity
    VIEW_DASHBOARD = "VIEW_DASHBOARD",
    POST_JOB = "POST_JOB",
    SUBMIT_PROPOSAL = "SUBMIT_PROPOSAL",
    ACCESS_ADMIN_PANEL = "ACCESS_ADMIN_PANEL",
    USE_AI_ASSISTANT = "USE_AI_ASSISTANT",
  }
  
  // Interfaces
  
  export interface I_User {
    id?: string;
    email: string;
    password?: string;
    name: string;
    role: E_UserRole;
    isVerified?: boolean;
    avatar?: string;
    bio?: string;
    skills?: string[];
    languages?: string[];
    education?: string;
    experience?: string;
    hourlyRate?: number;
    portfolio?: string[];
    location?: string;
    phone?: string;
    socialLinks?: any;
    level?: number;
    xp?: number;
    badges?: string[];
    wallet?: number;
    stripeAccountId?: string;
    createdAt?: string;
    updatedAt?: string;
    isBanned?: boolean;
    banReason?: string;
    twoFAEnabled?: boolean;
    customPermissions?: I_UserPermission[];
  }
  
  export interface I_UserPermission {
    id?: string;
    permission: I_Permission;
  }
  
  export interface I_Permission {
    id?: string;
    name: E_PermissionName;
    description?: string;
  }
  
  export interface I_Job {
    id?: string;
    title: string;
    description: string;
    category: string;
    subcategory?: string;
    budget: number;
    skills: string[];
    attachments?: string[];
    status: E_JobStatus;
    deliveryDays: number;
    aiSummary?: string;
    jobFeePaid?: boolean;
    featured?: boolean;
    clientId: string;
    createdAt?: string;
    updatedAt?: string;
    hiredFreelancerId?: string;
  }
  
  export interface I_Proposal {
    id?: string;
    freelancerId: string;
    jobId: string;
    proposalText: string;
    price: number;
    deliveryDays: number;
    attachments?: string[];
    status: E_ProposalStatus;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface I_Milestone {
    id?: string;
    jobId: string;
    title: string;
    amount: number;
    description?: string;
    isPaid?: boolean;
    isApproved?: boolean;
    dueDate?: string;
    createdAt?: string;
  }
  
  export interface I_Transaction {
    id?: string;
    userId: string;
    amount: number;
    type: E_TransactionType;
    referenceId?: string;
    stripePaymentIntent?: string;
    stripeStatus?: string;
    stripeClientSecret?: string;
    platformFee?: number;
    netAmount?: number;
    createdAt?: string;
  }
  
  export interface I_Withdrawal {
    id?: string;
    userId: string;
    amount: number;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    method?: string;
    requestedAt?: string;
  }
  
  export interface I_Review {
    id?: string;
    reviewerId: string;
    revieweeId: string;
    jobId: string;
    rating: number;
    comment: string;
    createdAt?: string;
  }
  
  export interface I_Message {
    id?: string;
    senderId: string;
    jobId: string;
    content: string;
    attachments?: string[];
    timestamp?: string;
  }
  
  export interface I_Notification {
    id?: string;
    userId: string;
    type: E_NotificationType;
    title: string;
    message: string;
    read?: boolean;
    createdAt?: string;
  }
  
  export interface I_Dispute {
    id?: string;
    jobId: string;
    filedById: string;
    againstUserId: string;
    reason: string;
    status?: string;
    resolution?: string;
    filedAt?: string;
    resolvedAt?: string;
  }
  
  export interface I_Badge {
    id?: string;
    name: string;
    icon: string;
    description: string;
    createdAt?: string;
  }
  