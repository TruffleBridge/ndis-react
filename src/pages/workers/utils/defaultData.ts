import type {
  PersonalInfo,
  SupportInfo,
  QualificationInfo,
  ComplianceInfo,
  WorkerForm,
} from "./types";

// ======================================
// Personal Information Default State
// ======================================

export const defaultPersonalInfo: PersonalInfo = {
  firstName: "",
  lastName: "",
  dateOfBirth: null,

  mobile: "",
  email: "",

  address: "",
  suburb: "",
  state: "",
  postalCode: "",

  gender: "",

  primaryLanguage: null,

  experience: "",

  employmentStatus: null,

  availableForNewClients: true,

  preferences: [
    {
      key: "pet",
      label: "Pet Friendly",
      value: true,
    },
    {
      key: "smoke",
      label: "Non-smoker",
      value: true,
    },
    {
      key: "vehicle",
      label: "Has own vehicle",
      value: false,
    },
    {
      key: "emergency",
      label: "Available for emergency shifts",
      value: true,
    },
  ],

  idProof: null,
};

// ======================================
// Support Services Default State
// ======================================

export const defaultSupportInfo: SupportInfo = {
  helpInHome: null,

  socialAssistance: null,

  mentorLifeSkills: null,

  travelTransport: null,

  personalCare: null,

  healthWellBeing: null,
};

// ======================================
// Qualification Default State
// ======================================

export const defaultQualificationInfo: QualificationInfo = {
  qualificationType: null,

  degreeName: "",

  institution: "",

  yearsCompleted: "",

  certificationName: "",

  certificationNumber: "",

  certificationExpiry: null,

  certificate: null,
};

// ======================================
// Compliance Default State
// ======================================

export const defaultComplianceInfo: ComplianceInfo = {
  // Verification

  ndisCertificate: null,

  screeningCheck: null,

  orientationCertificate: null,

  rightToWork: null,

  // Driving Licence

  drivingLicenseNumber: "",

  drivingLicenseExpiry: null,

  drivingFront: null,

  drivingBack: null,

  // Police

  policeNumber: "",

  policeIssueDate: null,

  policeExpiryDate: null,

  policeCertificate: null,

  // Blue Card

  blueCardNumber: "",

  blueCardExpiry: null,

  blueCardCertificate: null,

  // First Aid

  firstAidCertificateNumber: "",

  firstAidExpiry: null,

  firstAidCertificate: null,

  // CPR

  cprCertificateNumber: "",

  cprExpiry: null,

  cprCertificate: null,
};

// ======================================
// Complete Worker Form Default State
// ======================================

export const defaultWorkerForm: WorkerForm = {
  personalInfo: defaultPersonalInfo,

  supportInfo: defaultSupportInfo,

  qualificationInfo: defaultQualificationInfo,

  complianceInfo: defaultComplianceInfo,
};