export interface JobManagementResponse {
    status: boolean;
    message: string;
    data: JobManagementData;
}

export interface JobProps {
    jobId: string;
    avatar?: string;
    name: string;
    workerName: string;
    serviceType: string;
    serviceDate: string;
    shiftTime: string;
    location: string;
    jobStatus: string;
    paymentStatus: string;
    [key: string]: unknown;
}

export interface JobManagementData {
    totalCount: number;
    count: number;
    rows: JobManagement[];
}

export interface JobManagement {
    jobId: string;
    businessName: string | null;
    client: Client;
    worker: Worker | null;
    serviceType: string | null;
    location: Location;
    session: Session[];
    jobStatus: string;
    paymentStatus: string;
    bookingId?: number | null;
}

export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    profilePicture: string | null;
}

export interface Worker {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    profilePicture: string | null;
}

export interface Location {
    city: string;
    state: string;
}

export interface Session {
    serviceDate: string;
    startTime: string;
    endTime: string;
}