// Admin profile related types

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  role: string; // e.g. Super Admin, Admin, Manager
  department: string;
  designation: string;
  joiningDate: string; // ISO date string
  address: string;
  city: string;
  state: string;
  pincode: string;
  avatarUrl?: string;
  status: "Active" | "Inactive";
}

export type ProfileFormErrors = Partial<Record<keyof AdminProfile, string>>;