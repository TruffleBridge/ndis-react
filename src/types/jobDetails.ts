// ============================================================
// Job Details — Type Definitions
// ============================================================

export type JobStatus = "Open" | "In Progress" | "Closed" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Partial";

export interface ClientDetails {
  clientName: string;
  email: string;
  phoneNumber: string;
  address: string;
  emergencyContact: string;
}

export interface WorkerDetails {
  workerName: string;
  email: string;
  phoneNumber: string;
  experience: string;
  skills: string;
}

export interface LocationDetails {
  serviceAddress: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface ScheduleSummary {
  startDate: string;
  endDate: string;
  totalWorkingDays: number;
  totalHours: number;
}

export interface PaymentSummary {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentMode: string;
  paymentStatus: PaymentStatus;
}

export interface PaymentHistoryItem {
  id: number;
  transactionId: string;
  date: string;
  paymentMode: string;
  amount: number;
  status: PaymentStatus;
  notes: string;
}

export type AttendanceStatus = "Present" | "Absent" | "Late";

export interface WorkHistoryItem {
  id: number;
  date: string;
  shiftTime: string;
  hoursWorked: string;
  attendanceStatus: AttendanceStatus;
  notes: string;
}

export interface JobDetails {
  jobId: string;
  serviceType: string;
  jobStatus: JobStatus;
  serviceDate: string;
  shiftTime: string;
  location: string;
  paymentStatus: PaymentStatus;

  client: ClientDetails;
  worker: WorkerDetails;
  locationDetails: LocationDetails;
  scheduleSummary: ScheduleSummary;
  paymentSummary: PaymentSummary;

  paymentHistory: PaymentHistoryItem[];
  workHistory: WorkHistoryItem[];
}

// ------------------------------------------------------------
// Zustand store contract
// ------------------------------------------------------------
export interface JobDetailsState {
  jobDetails: JobDetails | null;
  loading: boolean;
  error: string | null;

  fetchJobDetails: (jobId: string) => Promise<void>;
  resetJobDetails: () => void;
}
