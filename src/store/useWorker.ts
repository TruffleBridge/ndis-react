import { create } from "zustand";
// TODO: fix this path to point at your actual api.ts (the one with
// getApiRequest / createApiRequest / updateApiRequest / deleteApiRequest).
import {
    getApiRequest,
    createApiRequest,
    updateApiRequest,
} from "@/api/api";

import type {
    Worker,
    // UploadedDoc,
    PersonalInfo,
    SupportInfo,
    QualificationInfo,
    ComplianceInfo,
    FormMode,
    FormErrors,
    StepId,
} from "@/types/worker";
import { getMimeType } from "../utils/helper";

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------
const ENDPOINTS = {
    // TODO: this one wasn't given yet - swap it for your real worker-list endpoint.
    list: "/admin/workerManagementList",
    create: "/auth/register",
    update: "/admin/updateUser",
    updateStatus: "/admin/updateUserStatus",
    getProfile: "/profile/getProfile",
};

// The account `type` sent to /api/auth/register for this module.
// TODO: confirm this is the exact string your backend expects for workers.
const ACCOUNT_TYPE = "worker";

// TODO: these ids are placeholders - map them to your real lookup tables.
const SERVICE_CATEGORY_IDS: Record<keyof SupportInfo, number> = {
    helpInHome: 1,
    socialAssistance: 2,
    mentorLifeSkills: 3,
    travelTransport: 4,
    personalCare: 5,
    healthWellBeing: 6,
};

// Reverse lookup used when reading userDocuments back from getProfile ->
// maps a documentType.name to the ComplianceInfo field it belongs to.
// in the compliance step, otherwise it will be silently ignored below.
const DOCUMENT_LABEL_TO_FIELD: Partial<Record<string, keyof ComplianceInfo>> = {
    "NDIS Certificate of Registration": "ndisCertificate",
    "Screening Check Upload": "screeningCheck",
    "Orientation Certificate Upload": "orientationCertificate",
    "Rights To Work": "rightToWork",
    "Driving License - Front": "drivingFront",
    "Driving License - Back": "drivingBack",
    "Police Check Certificate": "policeCertificate",
    "Blue Card Certificate": "blueCardCertificate",
    "First Aid Certificate": "firstAidCertificate",
    "CPR Certificate": "cprCertificate",
};

// Reverse lookup: serviceCategory.name (as returned by getProfile) -> the
// SupportInfo key used in the form. Keep in sync with SERVICE_CATEGORY_IDS.
// TODO: confirm exact category names for the remaining keys - only
// "Help in Home" and "Social Assistance" are confirmed from the sample.
const SUPPORT_CATEGORY_NAME_TO_KEY: Record<string, keyof SupportInfo> = {
    "Help in Home": "helpInHome",
    "Social Assistance": "socialAssistance",
    "Mentor & Life Skills": "mentorLifeSkills",
    "Travel & Transport": "travelTransport",
    "Personal Care": "personalCare",
    "Health Well Being": "healthWellBeing",
};

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------
const getDefaultPersonalInfo = (): PersonalInfo => ({
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    mobile: "",
    countryCode: "+61",
    email: "",
    password: "",
    address: "",
    suburb: "",
    state: "",
    postalCode: "",
    gender: "",
    idProof: null,
    preferences: [],
    isPetFriendly: false,
    isNonSmoker: false,
    isOwnVehicle: false,
    isEmergencyShift: false,
    primaryLanguage: null,
    experience: "",
    employmentStatus: null,
    availableForNewClients: false,
});

const getDefaultSupportInfo = (): SupportInfo => ({
    helpInHome: [],
    socialAssistance: [],
    mentorLifeSkills: [],
    travelTransport: [],
    personalCare: [],
    healthWellBeing: [],
});

const getDefaultQualificationInfo = (): QualificationInfo => ({
    qualificationType: null,
    degreeName: "",
    institution: "",
    yearsCompleted: "",
    certificationName: "",
    certificationNumber: "",
    certificationExpiry: null,
    certificate: null,
});

const getDefaultComplianceInfo = (): ComplianceInfo => ({
    ndisCertificate: null,
    screeningCheck: null,
    orientationCertificate: null,
    rightToWork: null,
    drivingLicenseNumber: "",
    drivingLicenseExpiry: null,
    drivingFront: null,
    drivingBack: null,
    policeNumber: "",
    policeIssueDate: null,
    policeExpiryDate: null,
    policeCertificate: null,
    blueCardNumber: "",
    blueCardExpiry: null,
    blueCardCertificate: null,
    firstAidCertificateNumber: "",
    firstAidExpiry: null,
    firstAidCertificate: null,
    cprCertificateNumber: "",
    cprExpiry: null,
    cprCertificate: null,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\+?[0-9\s-]{8,15}$/;
const STEP_ORDER: StepId[] = ["basic", "support", "qual", "compliance"];

// ---------------------------------------------------------------------------
// Payload builder - maps our 4 step objects onto the /api/auth/register /
// /api/admin/updateUser body shape.
// ---------------------------------------------------------------------------
const toGenderEnum = (gender: string) => (gender ? gender.toUpperCase().replace(/-/g, "_") : "");

const buildDocuments = (compliance: ComplianceInfo) => {
    const documents: any[] = [];

    const pushDocument = (
        documentType: string,
        file: any,
        extra: Record<string, any> = {}
    ) => {
        if (!file) return;

        documents.push({
            documentType,
            ...extra,
            documentUrls: [
                {
                    name: file.name,
                    url: file.url,
                    size: file.size,
                    type: file.type ? file.type : getMimeType(file?.name),
                },
            ],
        });
    };

    // NDIS
    pushDocument(
        "NDIS Certificate of Registration",
        compliance.ndisCertificate
    );

    // Screening Check
    pushDocument(
        "Screening check upload",
        compliance.screeningCheck
    );

    // Orientation
    pushDocument(
        "Orientation certificate upload",
        compliance.orientationCertificate
    );

    // Right To Work
    pushDocument(
        "Rights to work",
        compliance.rightToWork
    );

    // Police Check
    pushDocument(
        "Police Verification",
        compliance.policeCertificate,
        {
            referenceNumber: compliance.policeNumber,
            startDate: compliance.policeIssueDate,
            expiryDate: compliance.policeExpiryDate,
        }
    );

    // Blue Card
    pushDocument(
        "Working with Children",
        compliance.blueCardCertificate,
        {
            referenceNumber: compliance.blueCardNumber,
            expiryDate: compliance.blueCardExpiry,
        }
    );

    // First Aid
    pushDocument(
        "First Aid",
        compliance.firstAidCertificate,
        {
            referenceNumber:
                compliance.firstAidCertificateNumber,
            expiryDate: compliance.firstAidExpiry,
        }
    );

    // CPR
    pushDocument(
        "CPR",
        compliance.cprCertificate,
        {
            referenceNumber:
                compliance.cprCertificateNumber,
            expiryDate: compliance.cprExpiry,
        }
    );

    // Driving License (Front + Back in same object)
    if (
        compliance.drivingFront ||
        compliance.drivingBack
    ) {
        const drivingDocs = [];

        if (compliance.drivingFront) {
            drivingDocs.push({
                name: compliance.drivingFront.name,
                url: compliance.drivingFront.url,
                size: compliance.drivingFront.size,
                type: compliance.drivingFront?.file?.type ? compliance.drivingFront.file?.type : getMimeType(compliance.drivingFront?.name),
                documentSide: "Front side",
            });
        }

        if (compliance.drivingBack) {
            drivingDocs.push({
                name: compliance.drivingBack.name,
                url: compliance.drivingBack.url,
                size: compliance.drivingBack.size,
                type: compliance.drivingBack.file?.type ? compliance.drivingBack.file?.type : getMimeType(compliance.drivingBack.name),
                documentSide: "Back side",
            });
        }

        documents.push({
            documentType: "Identify & Legal",
            referenceNumber:
                compliance.drivingLicenseNumber,
            expiryDate:
                compliance.drivingLicenseExpiry,
            documentUrls: drivingDocs,
        });
    }

    return documents;
};

const buildSupportServices = (support: SupportInfo) =>
    (Object.keys(support) as Array<keyof SupportInfo>)
        .filter((key) => !!support[key]?.length)
        .flatMap((key) =>
            (support[key] as Array<{ label: string; value: string }>).map((item) => ({
                serviceCategoryId: SERVICE_CATEGORY_IDS[key],
                serviceId: Number(item.value),
                name: item?.label
            }))
        );

const buildRegisterPayload = (
    workerId: number | string | null,
    personal: PersonalInfo,
    support: SupportInfo,
    qualification: QualificationInfo,
    compliance: ComplianceInfo
) => ({
    ...(workerId != null ? { userId: workerId } : {}),
    firstName: personal.firstName,
    lastName: personal.lastName,
    email: personal.email,
    password: 'Test@123',
    phoneNumber: personal.mobile,
    countryCode: personal.countryCode,
    type: ACCOUNT_TYPE,
    dateOfBirth: personal.dateOfBirth,
    gender: toGenderEnum(personal.gender),
    userAddress: {
        street1: personal.address,
        suburb: personal.suburb,
        state: personal.state,
        zipCode: personal.postalCode,
    },
    idProof: personal.idProof,
    documents: buildDocuments(compliance),
    userBio: {
        yearsOfExperience: Number(personal.experience) || 0,
        newClientAvailability: personal.availableForNewClients ?? false,
        primaryLanguageId: personal.primaryLanguage?.value ? Number(personal.primaryLanguage.value) : null,
        currentEmploymentStatus: personal.employmentStatus?.value ?? null,
        qualificationId: qualification.qualificationType?.value ? Number(qualification.qualificationType.value) : null,
        degree: qualification.degreeName,
        institute: qualification.institution,
        yearOfCompleted: qualification.yearsCompleted,
        certificationName: qualification.certificationName,
        certificationNumber: qualification.certificationNumber,
        certificationDocuments: qualification.certificate,
        isPetFriendly: personal.preferences.includes("petFriendly"),
        isNonSmoker: personal.preferences.includes("nonSmoker"),
        isOwnVehicle: personal.preferences.includes("ownVehicle"),
        isEmergencyShift: personal.preferences.includes("emergencyShift"),
    },
    supportServices: buildSupportServices(support),
    // TODO: these fields aren't in the sample payload schema yet - confirm the
    // exact keys your backend wants for driving/police/blue-card/first-aid/CPR
    // numbers + expiry dates, then move them into the right place above.
    // complianceDetails: {
    //     drivingLicenseNumber: compliance.drivingLicenseNumber,
    //     drivingLicenseExpiry: compliance.drivingLicenseExpiry,
    //     policeNumber: compliance.policeNumber,
    //     policeIssueDate: compliance.policeIssueDate,
    //     policeExpiryDate: compliance.policeExpiryDate,
    //     blueCardNumber: compliance.blueCardNumber,
    //     blueCardExpiry: compliance.blueCardExpiry,
    //     firstAidCertificateNumber: compliance.firstAidCertificateNumber,
    //     firstAidExpiry: compliance.firstAidExpiry,
    //     cprCertificateNumber: compliance.cprCertificateNumber,
    //     cprExpiry: compliance.cprExpiry,
    // },
});

// ---------------------------------------------------------------------------
// Reverse mapping helpers - API (getProfile) shape -> form shape.
// These mirror buildRegisterPayload / buildDocuments / buildSupportServices
// above but in the opposite direction.
// ---------------------------------------------------------------------------

// user.userDocuments[] -> ComplianceInfo
const mapDocumentsToCompliance = (docs: any[] = []): ComplianceInfo => {
    const result = getDefaultComplianceInfo();

    docs.forEach((doc) => {
        const label = doc?.documentType?.name;
        docs.forEach((doc) => {
            const label = doc?.documentType?.name?.toLowerCase();

            const field = Object.entries(DOCUMENT_LABEL_TO_FIELD)
                .find(([key]) => key.toLowerCase() === label)?.[1];

            if (field) {
                (result as any)[field] = doc.documentUrls?.[0]
                    ? { ...doc.documentUrls[0], uploadedAt: doc.documentUrls?.[0] ? doc.documentUrls?.[0]?.createdAt : doc.createdAt }
                    : null;
            }
        });

        if (label === "Police Verification") {
            result.policeNumber = doc.referenceNumber ?? "";
            result.policeIssueDate = doc.startDate ?? null;
            result.policeExpiryDate = doc.expiryDate ?? null;
            result.policeCertificate = doc.documentUrls[0] ?? null;
        }

        if (label === "Identify & Legal") {
            result.drivingLicenseNumber = doc.referenceNumber ?? "";
            result.drivingLicenseExpiry = doc.expiryDate ?? null;
            result.drivingFront = doc.documentUrls?.[0] ?? null;
            result.drivingBack = doc.documentUrls?.[1] ?? null;
        }

        if (label === "Working with Children") {
            result.blueCardNumber = doc.referenceNumber ?? "";
            result.blueCardExpiry = doc.expiryDate ?? null;
            result.blueCardCertificate = doc.documentUrls[0] ?? null;
        }

        if (label === "First Aid") {
            result.firstAidCertificateNumber = doc.referenceNumber ?? "";
            result.firstAidExpiry = doc.expiryDate ?? null;
            result.firstAidCertificate = doc.documentUrls[0] ?? null;
        }

        if (label === "CPR") {
            result.cprCertificateNumber = doc.referenceNumber ?? "";
            result.cprCertificate = doc.documentUrls[0] ?? null;
            result.cprExpiry = doc.expiryDate ?? null;
        }
    });

    return result;
};

// user.serviceCategories[] -> SupportInfo
const mapServiceCategoriesToSupportInfo = (
    categories: Record<string, any[]> = {}
): SupportInfo => {
    const result = getDefaultSupportInfo();

    Object.entries(categories).forEach(([categoryName, services]) => {
        const key = SUPPORT_CATEGORY_NAME_TO_KEY[categoryName];
        if (!key) return;

        result[key] = services.map((service) => ({
            label: service.name,
            value: String(service.id),
            serviceCategoryId: service?.serviceCategoryId
        }));
    });

    return result;
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
interface WorkerStore {
    // table
    workers: Worker[];
    workersLoading: boolean;
    workersError: string | null;
    searchValue: string;
    currentPage: number;
    totalPages: number;

    // form
    mode: FormMode;
    workerId: number | string | null;
    activeStep: StepId;
    personalInfo: PersonalInfo;
    supportInfo: SupportInfo;
    qualificationInfo: QualificationInfo;
    complianceInfo: ComplianceInfo;
    errors: FormErrors;
    isFormLoading: boolean;
    isSubmitting: boolean;
    submitSuccess: boolean;

    uploadingKeys: Record<string, boolean>;
    uploadErrors: Record<string, string>;

    // table actions
    fetchWorkers: () => Promise<void>;
    setSearchValue: (value: string) => void;
    setCurrentPage: (page: number) => void;
    status?: boolean;
    updateState?: (val: boolean) => void;
    updateWorkerStatus: (id: number | string, status: Worker["status"]) => Promise<boolean>;
    deleteWorker: (id: number | string) => Promise<boolean>;

    // form actions
    initForm: (mode: FormMode, workerId?: number | string | null) => Promise<void>;
    setActiveStep: (step: StepId) => void;
    setPersonalField: <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => void;
    setSupportField: <K extends keyof SupportInfo>(field: K, value: SupportInfo[K]) => void;
    setQualificationField: <K extends keyof QualificationInfo>(field: K, value: QualificationInfo[K]) => void;
    setComplianceField: <K extends keyof ComplianceInfo>(field: K, value: ComplianceInfo[K]) => void;
    validatePersonalStep: () => boolean;
    validateSupportStep: () => boolean;
    validateQualificationStep: () => boolean;
    validateComplianceStep: () => boolean;
    goToNextStep: (from: StepId) => boolean;
    submitForm: () => Promise<boolean>;
    resetForm: () => void;
    closeSubmitSuccess: () => void;
}

export const useWorkerStore = create<WorkerStore>((set, get) => ({
    workers: [],
    workersLoading: false,
    workersError: null,
    searchValue: "",
    currentPage: 1,
    totalPages: 1,

    mode: "create",
    workerId: null,
    activeStep: "basic",
    personalInfo: getDefaultPersonalInfo(),
    supportInfo: getDefaultSupportInfo(),
    qualificationInfo: getDefaultQualificationInfo(),
    complianceInfo: getDefaultComplianceInfo(),
    errors: { personal: {}, support: {}, qualification: {}, compliance: {} },
    isFormLoading: false,
    isSubmitting: false,
    submitSuccess: false,

    uploadingKeys: {},
    uploadErrors: {},

    // =========================== TABLE ===========================
    fetchWorkers: async () => {
        set({ workersLoading: true, workersError: null });
        try {
            const { searchValue, currentPage } = get();
            const res = await createApiRequest(ENDPOINTS.list, { search: searchValue, page: currentPage });
            const payload = res.data?.data ?? res.data ?? {};
            set({
                workers: payload.rows ?? payload.workers ?? payload ?? [],
                totalPages: payload.totalPages ?? 1,
                workersLoading: false,
            });
        } catch (err) {
            set({ workersError: "Failed to load workers", workersLoading: false });
        }
    },

    setSearchValue: (value) => set({ searchValue: value, currentPage: 1 }),
    setCurrentPage: (page) => set({ currentPage: page }),

    // ================= STATUS UPDATE (also used for delete) =================
    updateState: (val) =>
        set({ status: val }),
    updateWorkerStatus: async (id, status) => {
        try {
            await updateApiRequest(ENDPOINTS.updateStatus, { userId: id, status: status === 'ACTIVE' ? "ACTIVE" : "INACTIVE" });
            set((state) => ({
                workers: state.workers.map((w) => (w.id === id ? { ...w, status } : w)),
            }));
            return true;
        } catch (err) {
            set({ workersError: "Failed to update worker status" });
            return false;
        }
    },

    deleteWorker: async (id) => {
        // Same endpoint as status update - TODO confirm the exact status value
        // your backend treats as "deleted" (e.g. "DELETED" / "INACTIVE").
        try {
            await updateApiRequest(ENDPOINTS.updateStatus, { userId: id, status: "DELETED" });
            set((state) => ({ workers: state.workers.filter((w) => w.id !== id) }));
            return true;
        } catch (err) {
            set({ workersError: "Failed to delete worker" });
            return false;
        }
    },

    // ===================== FORM INIT (getProfile for edit/view) =====================
    initForm: async (mode, workerId = null) => {
        set({
            mode,
            workerId,
            activeStep: "basic",
            errors: { personal: {}, support: {}, qualification: {}, compliance: {} },
            submitSuccess: false,
        });

        if (mode === "create" || workerId == null) {
            set({
                personalInfo: getDefaultPersonalInfo(),
                supportInfo: getDefaultSupportInfo(),
                qualificationInfo: getDefaultQualificationInfo(),
                complianceInfo: getDefaultComplianceInfo(),
            });
            return;
        }

        set({ isFormLoading: true });
        try {
            const res = await getApiRequest(ENDPOINTS.getProfile, { userId: workerId });
            const record = res.data?.data ?? res.data ?? {};

            // getProfile returns { user, userBio, userLocation, userLanguage }
            // as top-level siblings - NOT a flat record. userLocation is an
            // array (we use the first/primary address). Destructure once here
            // so the rest of the mapping reads cleanly.
            const u = record.user ?? {};
            const bio = record.userBio ?? {};
            const loc = record.userLocation?.[0] ?? {};

            set({
                personalInfo: {
                    ...getDefaultPersonalInfo(),
                    firstName: u.firstName ?? "",
                    lastName: u.lastName ?? "",
                    dateOfBirth: u.dateOfBirth ?? null,
                    mobile: u.phone ?? "", // API field is "phone", not "phoneNumber"
                    countryCode: u.countryCode ?? "+61",
                    email: u.email ?? "",
                    address: loc.street1 ?? "",
                    suburb: loc.suburb ?? "",
                    state: loc.state ?? "",
                    postalCode: loc.zipCode ?? "", // API field is "zipCode"
                    gender: (u.gender ?? "").toLowerCase(),
                    idProof: u.idProof ?? null,
                    primaryLanguage: bio.primaryLanguageId
                        ? { label: bio.primaryLanguage?.name ?? "", value: bio?.primaryLanguage?.id ?? String(bio.primaryLanguageId) }
                        : { label: "", value: "" },
                    experience: bio.yearsOfExperience?.toString() ?? "",
                    employmentStatus: bio.currentEmploymentStatus
                        ? { label: bio.currentEmploymentStatus, value: bio.currentEmploymentStatus }
                        : { label: "", value: "" },
                    availableForNewClients: !!bio.newClientAvailability,
                    preferences: [
                        bio.isPetFriendly ? "petFriendly" : null,
                        bio.isNonSmoker ? "nonSmoker" : null,
                        bio.isOwnVehicle ? "ownVehicle" : null,
                        bio.isEmergencyShift ? "emergencyShift" : null,
                    ].filter(Boolean) as string[],
                },
                supportInfo: mapServiceCategoriesToSupportInfo(u.supportServices ?? []),
                qualificationInfo: {
                    ...getDefaultQualificationInfo(),
                    qualificationType: bio.qualification?.id
                        ? { label: bio?.qualification?.name, value: bio.qualification?.id ?? String(bio.qualificationId) }
                        : { label: "", value: "" },
                    degreeName: bio.degree ?? "",
                    institution: bio.institute ?? "",
                    yearsCompleted: bio.yearOfCompleted ?? "",
                    certificationName: bio.certificationName ?? "",
                    certificationNumber: bio.certificationNumber ?? "",
                    certificate: bio.certificationDocuments ?? null,
                },
                complianceInfo: mapDocumentsToCompliance(u.userDocuments ?? []),
                isFormLoading: false,
            });
        } catch (err) {
            set({ isFormLoading: false, workersError: "Failed to load worker profile" });
        }
    },

    setActiveStep: (step) => set({ activeStep: step }),

    setPersonalField: (field, value) =>
        set((state) => ({
            personalInfo: { ...state.personalInfo, [field]: value },
            errors: { ...state.errors, personal: { ...state.errors.personal, [field]: undefined } },
        })),

    setSupportField: (field, value) =>
        set((state) => ({
            supportInfo: { ...state.supportInfo, [field]: value },
            errors: { ...state.errors, support: { ...state.errors.support, [field]: undefined } },
        })),

    setQualificationField: (field, value) =>
        set((state) => ({
            qualificationInfo: { ...state.qualificationInfo, [field]: value },
            errors: { ...state.errors, qualification: { ...state.errors.qualification, [field]: undefined } },
        })),

    setComplianceField: (field, value) =>
        set((state) => ({
            complianceInfo: { ...state.complianceInfo, [field]: value },
            errors: { ...state.errors, compliance: { ...state.errors.compliance, [field]: undefined } },
        })),


    // =============================== VALIDATION ===============================
    validatePersonalStep: () => {
        const { personalInfo } = get();
        const errors: FormErrors["personal"] = {};

        if (!personalInfo.firstName.trim()) errors.firstName = "First name is required";
        if (!personalInfo.lastName.trim()) errors.lastName = "Last name is required";
        if (!personalInfo.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
        if (!personalInfo.mobile.trim()) errors.mobile = "Mobile number is required";
        else if (!MOBILE_REGEX.test(personalInfo.mobile.trim())) errors.mobile = "Enter a valid mobile number";
        if (!personalInfo.email.trim()) errors.email = "Email is required";
        else if (!EMAIL_REGEX.test(personalInfo.email.trim())) errors.email = "Enter a valid email";
        // if (mode === "create" && !personalInfo.password?.trim()) errors.password = "Password is required";
        if (!personalInfo.gender) errors.gender = "Please select a gender";
        if (!personalInfo.idProof) errors.idProof = "ID proof is required";
        if (!personalInfo.suburb.trim()) errors.suburb = "Suburb is required";
        if (!personalInfo.primaryLanguage?.label?.trim()) errors.primaryLanguage = "primary language is required";
        if (!personalInfo?.experience?.trim()) errors.experience = "year is required";

        set((state) => ({ errors: { ...state.errors, personal: errors } }));
        return Object.keys(errors).length === 0;
    },

    // No mandatory fields in this step today - kept as a hook point for future rules.
    validateSupportStep: () => {
        const { supportInfo } = get();

        const errors: FormErrors["support"] = {};

        if (!supportInfo.healthWellBeing?.length) {
            errors.healthWellBeing = "Health & Wellbeing is required";
        }

        if (!supportInfo.helpInHome?.length) {
            errors.helpInHome = "Help in Home is required";
        }

        if (!supportInfo.mentorLifeSkills?.length) {
            errors.mentorLifeSkills = "Mentor & Life Skills is required";
        }

        if (!supportInfo.personalCare?.length) {
            errors.personalCare = "Personal Care is required";
        }

        if (!supportInfo.socialAssistance?.length) {
            errors.socialAssistance = "Social Assistance is required";
        }

        if (!supportInfo.travelTransport?.length) {
            errors.travelTransport = "Travel & Transport is required";
        }

        set((state) => ({
            errors: {
                ...state.errors,
                support: errors,
            },
        }));

        return Object.keys(errors).length === 0;
    },

    validateQualificationStep: () => {
        const { qualificationInfo } = get();
        const errors: FormErrors["qualification"] = {};

        if (!qualificationInfo.qualificationType?.value) errors.qualificationType = "Please select a qualification type";

        set((state) => ({ errors: { ...state.errors, qualification: errors } }));
        return Object.keys(errors).length === 0;
    },

    validateComplianceStep: () => {
        const { complianceInfo } = get();
        const errors: FormErrors["compliance"] = {};

        // Sublabels in the UI mark these three "Mandatory for all registered providers".
        if (!complianceInfo.ndisCertificate) errors.ndisCertificate = "This document is required";
        if (!complianceInfo.orientationCertificate) errors.orientationCertificate = "This document is required";
        if (!complianceInfo.rightToWork) errors.rightToWork = "This document is required";
        if (!complianceInfo.screeningCheck) errors.screeningCheck = "This document is required";

        set((state) => ({ errors: { ...state.errors, compliance: errors } }));
        return Object.keys(errors).length === 0;
    },

    goToNextStep: (from) => {
        const state = get();
        let valid = true;

        if (from === "basic") valid = state.validatePersonalStep();
        else if (from === "support") valid = state.validateSupportStep();
        else if (from === "qual") valid = state.validateQualificationStep();
        else if (from === "compliance") valid = state.validateComplianceStep();

        if (!valid) return false;

        const nextIndex = STEP_ORDER.indexOf(from) + 1;
        if (nextIndex < STEP_ORDER.length) set({ activeStep: STEP_ORDER[nextIndex] });
        return true;
    },

    // ======================= SUBMIT (register / updateUser) =======================
    submitForm: async () => {
        const { mode, workerId, personalInfo, supportInfo, qualificationInfo, complianceInfo } = get();
        set({ isSubmitting: true });

        const payload = buildRegisterPayload(
            mode === "edit" ? workerId : null,
            personalInfo,
            supportInfo,
            qualificationInfo,
            complianceInfo
        );
        try {
            if (mode === "edit" && workerId != null) {
                await updateApiRequest(ENDPOINTS.update, payload);
            } else {
                await createApiRequest(ENDPOINTS.create, payload);
            }
            set({ isSubmitting: false, submitSuccess: true });
            return true;
        } catch (err) {
            set({ isSubmitting: false, workersError: "Failed to submit worker details" });
            return false;
        }
    },

    resetForm: () =>
        set({
            activeStep: "basic",
            personalInfo: getDefaultPersonalInfo(),
            supportInfo: getDefaultSupportInfo(),
            qualificationInfo: getDefaultQualificationInfo(),
            complianceInfo: getDefaultComplianceInfo(),
            errors: { personal: {}, support: {}, qualification: {}, compliance: {} },
            submitSuccess: false,
        }),

    closeSubmitSuccess: () => set({ submitSuccess: false }),
}));