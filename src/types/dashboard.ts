export interface DashboardSummary {
    activeClients: number;
    activeWorkers: number;
    activeBookings: number;
    monthlyRevenue: number;
}

export interface EventMaster {
    id: number;
    code: string;
    name: string;
}

export interface LiveActivity {
    id: number;
    eventMasterId: number;
    metadata: string;
    isActive: boolean;
    createdBy: number | null;
    updatedBy: number | null;
    createdAt: string;
    updatedAt: string;
    eventMaster: EventMaster;
    message: string;
}

export interface DashboardResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

export interface LiveActivityListData {
    totalCount: number;
    count: number;
    rows: LiveActivity[];
}