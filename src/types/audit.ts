// src/types/audit.types.ts

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

export interface AuditChange {
    fieldName: string;
    fieldLabel: string;
    oldValue: string;
    newValue: string;
    dataType: string;
}

export interface AuditMetadata {
    targetUserId?: number;
    verificationStatus?: string;
    [key: string]: unknown;
}

export interface AuditLogItem {
    [key: string]: unknown;
    id: number;
    entityType: string;
    entityId: number;
    entityLabel: string;
    action: AuditAction | string;
    actorUserId: number;
    actorName: string;
    actorEmail: string;
    actorRole: string;
    source: string;
    metadata: AuditMetadata;
    changedAt: string;
    changes: AuditChange[];
}

export interface AuditPagination {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
}

export interface AuditLogsResponseData {
    items: AuditLogItem[];
    pagination: AuditPagination;
}

export interface AuditLogsApiResponse {
    status: boolean;
    message: string;
    data: AuditLogsResponseData;
}

// ---- Filters ----

export interface AuditLogFilters {
    entityType?: string;
    action?: AuditAction | string;
    actor?: string; // name / email search
    search?: string;
    startDate?: string; // ISO date
    endDate?: string; // ISO date
    page?: number;
    limit?: number;
}

// ---- Entity / User history (same item shape, reused) ----

export type EntityHistoryResponseData = AuditLogsResponseData;
export type UserHistoryResponseData = AuditLogsResponseData;

export interface EntityHistoryApiResponse {
    status: boolean;
    message: string;
    data: EntityHistoryResponseData;
}

export interface UserHistoryApiResponse {
    status: boolean;
    message: string;
    data: UserHistoryResponseData;
}

// ---- Filter option constants (used by FilterPopover) ----

export const ENTITY_TYPE_OPTIONS = [
    { label: "User", value: "User" },
    { label: "User Documents", value: "UserDocuments" },
    { label: "Booking", value: "Booking" },
    { label: "Payment", value: "Payment" },
    { label: "Job", value: "Job" },
];

export const ACTION_OPTIONS = [
    { label: "Create", value: "CREATE" },
    { label: "Update", value: "UPDATE" },
    { label: "Delete", value: "DELETE" },
];