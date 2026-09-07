import { create } from "zustand";
// TODO: fix this path to point at your actual api.ts (the one with
// getApiRequest / createApiRequest / updateApiRequest / deleteApiRequest).
import {
    getApiRequest,
    createApiRequest,
    // updateApiRequest,
    updateApiRequest,
} from "@/api/api";

import type {
    Client,
    ClientDocument,
    PersonalFormData,
    BusinessFormData,
    DocumentFormData,
    FormMode,
    FormErrors,
    StepId,
} from "@/types/client";
import dayjs from "dayjs";
import { DOCUMENT_FIELDS } from "@/pages/clients/utils/constants";
import { handleApiError } from "@/utils/errorHandler";

// ---------------------------------------------------------------------------
// Endpoints - swap these placeholders for the real ones. Kept in one place
// so changing them later is a one-line edit, not a find-and-replace.
// ---------------------------------------------------------------------------
const ENDPOINTS = {
    list: "/admin/clientManagementList",
    create: "/auth/register",
    view: (id: number | string) => `/profile/getProfile?userId=${id}`,
    update: `/admin/updateUser`,
    status: `/admin/updateUserStatus`,
    delete: (id: number | string) => `/something/${id}`,
};

const getDefaultPersonalData = (): PersonalFormData => ({
    firstName: "",
    dob: null,
    mobile: "",
    email: "",
    gender: "",
    idProofFile: null,
});

const getDefaultBusinessData = (): BusinessFormData => ({
    businessName: "",
    abn: "",
    acn: "",
    address: "",
    suburb: "",
    state: "",
    postalCode: "",
});

const getDefaultDocumentData = (): DocumentFormData => ({});

const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;
const MOBILE_REGEX = /^\+?[0-9\s-]{8,15}$/;

const STEP_ORDER: StepId[] = ["info", "business", "document"];

interface ClientStore {
    // ---------------- table state ----------------
    clients: Client[];
    clientsLoading: boolean;
    clientsError: string | null;
    searchValue: string;
    currentPage: number;
    totalPages: number;

    // ---------------- form state ----------------
    mode: FormMode;
    clientId: number | string | null;
    activeStep: StepId;
    personalData: PersonalFormData;
    businessData: BusinessFormData;
    documentData: DocumentFormData;
    errors: FormErrors;
    isFormLoading: boolean;
    isSubmitting: boolean;
    submitSuccess: boolean;

    // ---------------- table actions ----------------
    fetchClients: (payload?: any) => Promise<void>;
    setSearchValue: (value: string) => void;
    setCurrentPage: (page: number) => void;
    deleteClient?: (id: number | string) => Promise<boolean>;
    deleteStatus?: boolean;

    // ---------------- form actions ----------------
    initForm: (mode: FormMode, clientId?: number | string | null) => Promise<void>;
    setActiveStep: (step: StepId) => void;
    setPersonalField: <K extends keyof PersonalFormData>(field: K, value: PersonalFormData[K]) => void;
    setBusinessField: <K extends keyof BusinessFormData>(field: K, value: BusinessFormData[K]) => void;
    setDocumentField: (key: string, file: ClientDocument | null) => void;
    validatePersonalStep: () => boolean;
    validateBusinessStep: () => boolean;
    validateDocumentStep: (mandatoryKeys: string[]) => boolean;
    goToNextStep: (from: StepId, mandatoryDocKeys?: string[]) => boolean;
    submitForm: () => Promise<boolean>;
    resetForm: () => void;
    closeSubmitSuccess: () => void;
    status?: boolean;
    updateState?: (key: string, val: boolean) => void;
    getStatusUpdate: (id: any) => Promise<any>
}

export const useClientStore = create<ClientStore>((set, get) => ({
    clients: [],
    clientsLoading: false,
    clientsError: null,
    searchValue: "",
    currentPage: 0,
    totalPages: 1,

    mode: "create",
    clientId: null,
    activeStep: "info",
    personalData: getDefaultPersonalData(),
    businessData: getDefaultBusinessData(),
    documentData: getDefaultDocumentData(),
    errors: { personal: {}, business: {}, document: {} },
    isFormLoading: false,
    isSubmitting: false,
    submitSuccess: false,
    deleteStatus: false,

    // =========================== TABLE (getTableApi) ===========================
    fetchClients: async (payload_: any) => {
        set({ clientsLoading: true, clientsError: null });
        try {
            const { searchValue, currentPage } = get();
            const res = await createApiRequest(ENDPOINTS.list, {
                "offset": currentPage * 10,
                "limit": payload_?.limit ?? 10,
                search: searchValue,
                ...(payload_?.filter && { filters: payload_?.filter })
            });
            const payload = res.data?.data ?? res.data ?? {};
            set({
                clients: payload?.rows ?? payload.clients ?? payload ?? [],
                totalPages: payload.totalCount ?? 1,
                clientsLoading: false,
            });
        } catch (err) {
            set({ clientsError: "Failed to load clients", clientsLoading: false });
        }
    },

    setSearchValue: (value) => set({ searchValue: value, currentPage: 0 }),
    setCurrentPage: (page) => set({ currentPage: page - 1 }),

    // ========================== table status update =====================
    updateState: (key, val) =>
        set(
            key === "delete"
                ? { deleteStatus: val }
                : { status: val }
        ),
    getStatusUpdate: async (id: any) => {
        const { status, deleteStatus } = get();
        try {
            await updateApiRequest(ENDPOINTS.status, {
                "userId": id,
                "status": deleteStatus ? "DELETED" : status ? "ACTIVE" : "INACTIVE",
                module: "Clients",
            });
            set((state) => ({ clients: state.clients.filter((c) => c.id !== id) }));
            return true;
        } catch (err) {
            const message = handleApiError(err, deleteStatus ? "Failed to delete" : "Failed to active or inactive");
            set({ clientsError: message ?? "Failed to delete client" });
            return false;
        }
    },

    // =========================== DELETE (getDelete) ===========================
    // deleteClient: async (id) => {
    //     try {
    //         await deleteApiRequest(ENDPOINTS.delete(id));
    //         set((state) => ({ clients: state.clients.filter((c) => c.id !== id) }));
    //         return true;
    //     } catch (err) {
    //         set({ clientsError: "Failed to delete client" });
    //         return false;
    //     }
    // },

    // ===================== FORM INIT (getView / getEdit) =====================
    initForm: async (mode, clientId = null) => {
        set({
            mode,
            clientId,
            activeStep: "info",
            errors: { personal: {}, business: {}, document: {} },
            submitSuccess: false,
        });

        if (mode === "create" || clientId == null) {
            set({
                personalData: getDefaultPersonalData(),
                businessData: getDefaultBusinessData(),
                documentData: getDefaultDocumentData(),
            });
            return;
        }

        // Edit and View both need the existing record - same GET, different
        // `isView` flag downstream in the components.
        set({ isFormLoading: true });
        try {
            const res = await getApiRequest(ENDPOINTS.view(clientId));
            const record = res.data?.data?.user ?? res.data ?? {};

            const mappedDoc: Record<string, any> = {};

            (record?.userDocuments ?? []).forEach((doc: any) => {
                const field = DOCUMENT_FIELDS.find(
                    (item) => item.label === doc.documentType?.name
                );

                if (field) {
                    // First uploaded file
                    mappedDoc[field.key] = { documentType: doc?.documentType?.name, ...doc.documentUrls?.[0] ?? null };

                    // If your UI expects array, use this instead:
                    // mappedDoc[field.key] = doc.documentUrls ?? [];
                }
            });

            set({
                personalData: {
                    ...getDefaultPersonalData(),
                    ...record,
                    mobile: record?.phone,
                    gender: record?.gender?.toLowerCase() ?? "",
                    dob: record?.dateOfBirth,
                    idProofFile: record.idProof ?? null,
                },
                businessData: {
                    ...getDefaultBusinessData(),
                    ...record.businessInfo,
                    abn: record?.businessInfo?.activeABN,
                    address: record?.businessInfo?.street1,
                    postalCode: record?.businessInfo?.zipCode || record?.businessInfo?.zipcode,
                },

                documentData: {
                    ...getDefaultDocumentData(),
                    ...mappedDoc,
                },
                isFormLoading: false,
            });

        } catch (err) {
            set({ isFormLoading: false, clientsError: "Failed to load client record" });
        }
    },

    setActiveStep: (step) => set({ activeStep: step }),

    setPersonalField: (field, value) =>
        set((state) => ({
            personalData: { ...state.personalData, [field]: value },
            // clear that field's error the moment the user edits it
            errors: { ...state.errors, personal: { ...state.errors.personal, [field]: undefined } },
        })),

    setBusinessField: (field, value) =>
        set((state) => ({
            businessData: { ...state.businessData, [field]: value },
            errors: { ...state.errors, business: { ...state.errors.business, [field]: undefined } },
        })),

    setDocumentField: (key, file) =>
        set((state) => ({
            documentData: { ...state.documentData, [key]: file },
            errors: { ...state.errors, document: { ...state.errors.document, [key]: "" } },
        })),

    // =============================== VALIDATION ===============================
    validatePersonalStep: () => {
        const { personalData } = get();
        const errors: FormErrors["personal"] = {};

        if (!personalData?.firstName.trim()) errors.firstName = "First name is required";
        if (!personalData?.dob) errors.dob = "Date of birth is required";
        if (!personalData?.mobile.trim()) errors.mobile = "Mobile number is required";
        else if (!MOBILE_REGEX.test(personalData?.mobile.trim())) errors.mobile = "Enter a valid mobile number";
        if (!personalData?.email.trim()) errors.email = "Email is required";
        else if (!EMAIL_REGEX.test(personalData?.email.trim())) errors.email = "Enter a valid email";
        if (!personalData?.gender) errors.gender = "Please select a gender";
        if (!personalData?.idProofFile) errors.idProofFile = "ID proof is required";

        set((state) => ({ errors: { ...state.errors, personal: errors } }));
        return Object.keys(errors).length === 0;
    },

    validateBusinessStep: () => {
        const { businessData } = get();
        const errors: FormErrors["business"] = {};

        if (!businessData.businessName.trim()) errors.businessName = "Business name is required";
        if (!businessData.abn.trim()) errors.abn = "ABN is required";
        else if (businessData.abn.trim().length !== 11) errors.abn = "ABN must be 11 digits";
        if (businessData.acn.trim() && businessData.acn.trim().length !== 9) errors.acn = "ACN must be 9 digits";
        if (!businessData.address.trim()) errors.address = "Address is required";
        if (!businessData.suburb.trim()) errors.suburb = "Suburb is required";

        set((state) => ({ errors: { ...state.errors, business: errors } }));
        return Object.keys(errors).length === 0;
    },

    validateDocumentStep: (mandatoryKeys) => {
        const { documentData } = get();
        const errors: FormErrors["document"] = {};

        mandatoryKeys.forEach((key) => {
            if (!documentData[key]) errors[key] = "This document is required";
        });

        set((state) => ({ errors: { ...state.errors, document: errors } }));
        return Object.keys(errors).length === 0;
    },

    // Runs the right validator for the step you're leaving, and only advances
    // activeStep when it passes - this is the "validation pass ana move" rule.
    goToNextStep: (from, mandatoryDocKeys = []) => {
        const state = get();
        let valid = true;

        if (from === "info") valid = state.validatePersonalStep();
        else if (from === "business") valid = state.validateBusinessStep();
        else if (from === "document") valid = state.validateDocumentStep(mandatoryDocKeys);

        if (!valid) return false;

        const nextIndex = STEP_ORDER.indexOf(from) + 1;
        if (nextIndex < STEP_ORDER.length) set({ activeStep: STEP_ORDER[nextIndex] });
        return true;
    },

    // ======================= SUBMIT (getCreateApi / edit) =======================
    submitForm: async () => {
        const { mode, clientId, personalData, businessData, documentData, fetchClients } = get();
        set({ isSubmitting: true });

        const payload = {
            ...(mode === "edit" && { userId: clientId }),
            firstName: personalData?.firstName,
            email: personalData?.email,
            phoneNumber: personalData?.mobile,
            countryCode: "+61", // or personalData?.countryCode
            type: "client",
             ...(mode === "edit" && { module: "Clients" }),
            dateOfBirth: dayjs(personalData?.dob).format("YYYY-MM-DD"),
            gender: personalData?.gender?.toUpperCase(),
            password: "Test@123",

            idProof: {
                name: personalData?.idProofFile?.name,
                url: personalData?.idProofFile?.url ? personalData?.idProofFile?.url : personalData?.idProofFile || "",
                size: personalData?.idProofFile?.size,
                type: personalData?.idProofFile?.file?.type || "",
                uploadedAt: personalData?.idProofFile?.uploadedAt,
            },

            businessInfo: {
                businessName: businessData.businessName,
                activeABN: businessData.abn,
                acn: businessData.acn,
                street1: businessData.address,
                suburb: businessData.suburb,
                state: businessData.state,
                zipCode: businessData.postalCode,
            },

            documents: Object.values(documentData).map((doc: any) => ({
                documentType: doc.documentType,
                documentUrls: [
                    {
                        name: doc.name,
                        url: doc.url || "",
                        size: doc.size,
                        type: doc.file?.type || "",
                        uploadedAt: doc.uploadedAt,
                    },
                ],
            })),
        };

        try {
            if (mode === "edit" && clientId != null) {
                await updateApiRequest(ENDPOINTS.update, payload);
            } else {
                await createApiRequest(ENDPOINTS.create, payload);
            }
            fetchClients();
            set({ isSubmitting: false, submitSuccess: true });
            return true;
        } catch (err) {
            const message = handleApiError(err, "Failed to client");
            set({ isSubmitting: false, clientsError: message ?? "Failed to submit client details" });
            return false;
        }
    },

    resetForm: () =>
        set({
            activeStep: "info",
            personalData: getDefaultPersonalData(),
            businessData: getDefaultBusinessData(),
            documentData: getDefaultDocumentData(),
            errors: { personal: {}, business: {}, document: {} },
            submitSuccess: false,
        }),

    closeSubmitSuccess: () => set({ submitSuccess: false }),
}));