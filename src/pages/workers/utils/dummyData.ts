import type { WorkerForm } from "./types";

export const workerDummy: WorkerForm = {
  // ==========================================
  // Personal Information
  // ==========================================

  personalInfo: {
    firstName: "Jane",

    lastName: "Cooper",

    dateOfBirth: new Date("1995-05-18"),

    mobile: "+61 400 123 456",

    email: "jane.cooper@gmail.com",

    address: "25 Queen Street",

    suburb: "Melbourne",

    state: "Victoria",

    postalCode: "3000",

    gender: "female",

    primaryLanguage: {
      label: "English",
      value: "english",
    },

    experience: "6",

    employmentStatus: {
      label: "Full Time",
      value: "full_time",
    },

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
        value: true,
      },
      {
        key: "emergency",
        label: "Available for emergency shifts",
        value: true,
      },
    ],

    idProof: null,
  },

  // ==========================================
  // Support Services
  // ==========================================

  supportInfo: {
    helpInHome: {
      label: "Yes",
      value: "yes",
    },

    socialAssistance: {
      label: "Yes",
      value: "yes",
    },

    mentorLifeSkills: {
      label: "Yes",
      value: "yes",
    },

    travelTransport: {
      label: "Available",
      value: "available",
    },

    personalCare: {
      label: "Available",
      value: "available",
    },

    healthWellBeing: {
      label: "Available",
      value: "available",
    },
  },

  // ==========================================
  // Qualification
  // ==========================================

  qualificationInfo: {
    qualificationType: {
      label: "Bachelor Degree",
      value: "bachelor",
    },

    degreeName: "Bachelor of Nursing",

    institution: "University of Melbourne",

    yearsCompleted: "2020",

    certificationName: "NDIS Worker Orientation",

    certificationNumber: "CERT-2024-001",

    certificationExpiry: new Date("2028-06-30"),

    certificate: null,
  },

  // ==========================================
  // Compliance
  // ==========================================

  complianceInfo: {
    // Verification

    ndisCertificate: null,

    screeningCheck: null,

    orientationCertificate: null,

    rightToWork: null,

    // Driving Licence

    drivingLicenseNumber: "DL123456789",

    drivingLicenseExpiry: new Date("2030-12-31"),

    drivingFront: null,

    drivingBack: null,

    // Police

    policeNumber: "POL987654",

    policeIssueDate: new Date("2024-01-01"),

    policeExpiryDate: new Date("2027-01-01"),

    policeCertificate: null,

    // Blue Card

    blueCardNumber: "BLUE12345",

    blueCardExpiry: new Date("2028-10-15"),

    blueCardCertificate: null,

    // First Aid

    firstAidCertificateNumber: "FA2024001",

    firstAidExpiry: new Date("2027-07-20"),

    firstAidCertificate: null,

    // CPR

    cprCertificateNumber: "CPR2024001",

    cprExpiry: new Date("2027-07-20"),

    cprCertificate: null,
  },
};

/**
 * Dummy worker list
 * Used by WorkersTable and WorkerPage
 */

export const workerList: WorkerForm[] = [
  workerDummy,

  {
    ...workerDummy,

    personalInfo: {
      ...workerDummy.personalInfo,

      firstName: "Phoenix",

      lastName: "Baker",

      mobile: "+61 411 222 333",

      email: "phoenix@gmail.com",

      suburb: "Queensland",

      state: "Queensland",
    },

    qualificationInfo: {
      ...workerDummy.qualificationInfo,

      degreeName: "Diploma in Community Services",
    },
  },

  {
    ...workerDummy,

    personalInfo: {
      ...workerDummy.personalInfo,

      firstName: "Olivia",

      lastName: "Rhye",

      mobile: "+61 422 555 777",

      email: "olivia@gmail.com",

      suburb: "Sydney",

      state: "New South Wales",
    },

    qualificationInfo: {
      ...workerDummy.qualificationInfo,

      degreeName: "Bachelor of Psychology",
    },
  },
];