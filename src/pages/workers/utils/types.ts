// ==============================
// Common Types
// ==============================

export interface Option {
  label: string;
  value: string;
}

export interface PreferenceItem {
  key: string;
  label: string;
  value: boolean;
}

// ==============================
// Personal Information
// ==============================

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;

  mobile: string;
  email: string;

  address: string;
  suburb: string;
  state: string;
  postalCode: string;

  gender: string;

  primaryLanguage: Option | null;

  experience: string;

  employmentStatus: Option | null;

  availableForNewClients: boolean;

  preferences: PreferenceItem[];

  idProof: UploadedFile | null;
}

// ==============================
// Support Services
// ==============================

export interface SupportInfo {
  helpInHome: Option | null;

  socialAssistance: Option | null;

  mentorLifeSkills: Option | null;

  travelTransport: Option | null;

  personalCare: Option | null;

  healthWellBeing: Option | null;
}

// ==============================
// Qualification
// ==============================

export interface QualificationInfo {
  qualificationType: Option | null;

  degreeName: string;

  institution: string;

  yearsCompleted: string;

  certificationName: string;

  certificationNumber: string;

  certificationExpiry: Date | null;

  certificate: UploadedFile | null;
}

// ==============================
// Compliance
// ==============================

export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    uploadedAt: Date;
}

export interface ComplianceInfo {
  // Verification Documents
  ndisCertificate: UploadedFile | null;

  screeningCheck: UploadedFile | null;

  orientationCertificate: UploadedFile | null;

  rightToWork: UploadedFile | null;

  // Driving Licence
  drivingLicenseNumber: string;

  drivingLicenseExpiry: Date | null;

  drivingFront: UploadedFile | null;

  drivingBack: UploadedFile | null;

  // Police
  policeNumber: string;

  policeIssueDate: Date | null;

  policeExpiryDate: Date | null;

  policeCertificate: UploadedFile | null;

  // Blue Card
  blueCardNumber: string;

  blueCardExpiry: Date | null;

  blueCardCertificate: UploadedFile | null;

  // First Aid
  firstAidCertificateNumber: string;

  firstAidExpiry: Date | null;

  firstAidCertificate: UploadedFile | null;

  // CPR
  cprCertificateNumber: string;

  cprExpiry: Date | null;

  cprCertificate: UploadedFile | null;
}

// ==============================
// Complete Worker Form
// ==============================

export interface WorkerForm {
  personalInfo: PersonalInfo;

  supportInfo: SupportInfo;

  qualificationInfo: QualificationInfo;

  complianceInfo: ComplianceInfo;
}

// ==============================
// Mode
// ==============================

export type FormMode = "create" | "edit" | "view";