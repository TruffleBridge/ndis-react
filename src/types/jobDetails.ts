// src/types/jobDetails.ts

export interface JobServiceCategory {
  id: number;
  name: string;
  description?: string | null;
}

export interface JobService {
  id: number;
  name: string;
  description?: string | null;
  serviceCategoryId: number;
}

export interface JobServiceCategoryItem {
  id: number;
  jobId: number;
  serviceCategoryId: number;
  serviceId: number;
  serviceCategory: JobServiceCategory;
  service: JobService;
}

export interface JobInfo {
  id: number;
  title: string;
  description: string;
  category: string;
  hourlyRate: number;
  shift: string;
  hoursPerDay: number;
  serviceRequirement: string;
  status: string;
  experienceLevel: string | null;
  genderPreference: string | null;
  isNdisCompliant: boolean;
  publishStatus: string;
  frequency: string | null;
  preferredStartDate: string | null;
  clientPaidToNimora: string | null;
  isUrgentShift: boolean;
  postedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: number;
  userId: number;
  street1: string;
  street2?: string | null;
  suburb?: string | null;
  city: string;
  state: string;
  zipCode: string;
  timezone?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserBio {
  yearsOfExperience?: number | null;
  professionalBio?: string | null;
  experienceInfo?: string | null;
  newClientAvailability?: boolean | null;
  degree?: string | null;
  speciality?: string | null;
}

export interface JobUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode?: string | null;
  profilePicture?: string | null;
  emailVerified?: boolean;
  activeStatus?: boolean;
  fullName: string;
  addresses: Address[];
  bio?: UserBio | null;
  businessInfo?: unknown;
  businessName?: string | null;
}

export interface JobLocation {
  id: number;
  jobId: number;
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  timezone?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingStatus {
  id: number;
  name: string;
}

export interface ShiftLog {
  id: number;
  bookingId: number;
  clockInTime?: string | null;
  clockOutTime?: string | null;
  transportStartKm?: number | null;
  transportEndKm?: number | null;
  eSignatureImageData?: string | null;
  transportStartKmImageData?: string | null;
  transportEndKmImageData?: string | null;
  shiftNotes?: string | null;
  invoiceMetadata?: unknown;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobBooking {
  id: number;
  jobSessionId: number;
  bookingStatus: BookingStatus;
  cancelReason?: string | null;
  worker?: JobUser | null;
  client?: JobUser | null;
  payment?: unknown;
  shiftLogs?: ShiftLog[];
  createdAt?: string;
  updatedAt?: string;
}

export interface JobSession {
  id: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  dayOfWeek?: string | null;
  dayName?: string | null;
  bookings?: JobBooking[];
}

export interface JobDetails {
  jobId: string;
  job: JobInfo;

  jobServiceCategories: JobServiceCategoryItem[];

  serviceType: string | null;
  serviceCategory: string | null;

  requiredSkills: unknown[];
  preferredLanguages: unknown[];
  certifications: unknown[];

  locations: JobLocation[];
  sessions: JobSession[];

  client: JobUser | null;
  worker: JobUser | null;

  booking?: JobBooking | null;
  bookings: JobBooking[];

  payments: unknown[];

  jobStatus: string;
  paymentStatus: string;
}

export interface JobDetailsApiResponse {
  status: boolean;
  message: string;
  data: JobDetails;
}

export interface JobDetailsState {
  jobDetails: JobDetails | null;
  loading: boolean;
  error: string | null;

  fetchJobDetails: (jobId: string | number) => Promise<void>;
  resetJobDetails: () => void;
}