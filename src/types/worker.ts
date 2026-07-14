export type FormMode = "create" | "edit" | "view";

export interface Option {
    label: string;
    value: string
    serviceCategoryId?: number;

}

export interface WorkerFormNavState {
    mode: FormMode;
    workerId?: number | string | null;
}

/** Matches the shape the backend expects for any uploaded file reference. */
export interface UploadedDoc {
    file: File;
    name: string;
    size: number;
    uploadedAt: Date;
    url?: string;
    documentType?: string;
}

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    mobile: string;
    countryCode: string;
    email: string;
    // Only required on create - leave blank for edit/view.
    password?: string;
    address: string;
    suburb: string;
    state: string;
    postalCode: string;
    gender: string;
    idProof: UploadedDoc | null;
    preferences: string[];
    isPetFriendly: boolean;
    isNonSmoker: boolean;
    isOwnVehicle: boolean;
    isEmergencyShift: boolean;
    primaryLanguage: Option | null;
    experience: string;
    employmentStatus: Option | null;
    availableForNewClients: boolean;
}

export interface SupportInfo {
    helpInHome: Option[];
    socialAssistance: Option[];
    mentorLifeSkills: Option[];
    travelTransport: Option[];
    personalCare: Option[];
    healthWellBeing: Option[];
}
export interface QualificationInfo {
    qualificationType: Option | null;
    degreeName: string;
    institution: string;
    yearsCompleted: string;
    certificationName: string;
    certificationNumber: string;
    certificationExpiry: string | null;
    certificate: UploadedDoc | null;
}

export interface ComplianceInfo {
    ndisCertificate: UploadedDoc | null;
    screeningCheck: UploadedDoc | null;
    orientationCertificate: UploadedDoc | null;
    rightToWork: UploadedDoc | null;

    drivingLicenseNumber: string;
    drivingLicenseExpiry: string | null;
    drivingFront: UploadedDoc | null;
    drivingBack: UploadedDoc | null;

    policeNumber: string;
    policeIssueDate: string | null;
    policeExpiryDate: string | null;
    policeCertificate: UploadedDoc | null;

    blueCardNumber: string;
    blueCardExpiry: string | null;
    blueCardCertificate: UploadedDoc | null;

    firstAidCertificateNumber: string;
    firstAidExpiry: string | null;
    firstAidCertificate: UploadedDoc | null;

    cprCertificateNumber: string;
    cprExpiry: string | null;
    cprCertificate: UploadedDoc | null;
}

export interface Worker {
    id: number;
    workerId: string;
    avatar?: string;
    name: string;
    email: string;
    phone: string;
    uploadedDocument?: string;
    location: string;
    status: "ACTIVE" | "INACTIVE";
    police: "verified" | "pending";
    ndis: "verified" | "pending";
    alerts: "None" | "Due" | "Expired";
    [key: string]: unknown;
}

export type StepId = "basic" | "support" | "qual" | "compliance";

export interface FormErrors {
    personal: Partial<Record<keyof PersonalInfo, string>>;
    support: Partial<Record<keyof SupportInfo, string>>;
    qualification: Partial<Record<keyof QualificationInfo, string>>;
    compliance: Partial<Record<keyof ComplianceInfo, string>>;
}