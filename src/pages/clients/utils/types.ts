import type { UploadedFile } from "../../../components/newFileUpload/FileUpload";

// Shared type definitions for the Client module (Table + Multi-step Form)

/** Mode the ClientFormPage is currently operating in */
export type FormMode = "create" | "edit" | "view";

/** Step 1 - Personal Information form data */
export interface PersonalFormData {
    firstName: string;
    dob: string | null;
    mobile: string;
    email: string;
    gender: string;
    idProofFile: UploadedFile | null;
}

/** Step 2 - NDIS Business form data */
export interface BusinessFormData {
    businessName: string;
    abn: string;
    acn: string;
    address: string;
    suburb: string;
    state: string;
    postalCode: string;
}

/**
 * Step 3 - Document Registration form data.
 * Keyed by document key (see DOCUMENT_FIELDS in constants.tsx) -> the
 * uploaded file, or null if not yet uploaded.
 */
export type DocumentFormData = Record<string, UploadedFile | null>;

/** The full record persisted for a client (mock "DB" row shape) */
export interface ClientRecord {
    id: number;
    personal: PersonalFormData;
    business: BusinessFormData;
    documents: DocumentFormData;
}

/** Payload shape produced on Submit - combines all 3 child forms */
export interface ClientSubmitPayload {
    id: number | null; // null when creating a brand-new client
    mode: FormMode;
    personal: PersonalFormData;
    business: BusinessFormData;
    documents: DocumentFormData;
}

/** Navigation state passed from the table row action -> the form page */
export interface ClientFormNavState {
    mode: FormMode;
    clientId?: number;
}