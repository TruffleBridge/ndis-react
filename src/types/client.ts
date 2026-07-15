export type FormMode = "create" | "edit" | "view";

export interface RawUploadedFile {
    file: File;
    name: string;
    size: number;
    uploadedAt: Date;
    url?:string
}

export interface ClientFormNavState {
  mode: FormMode;
  clientId?: number | string | null;
}

/**
 * Same shape as the /api/uploads/ response's `data`, plus the `documentType`
 * (the field's label) that we stack on top of it before saving into store.
 */
export interface ClientDocument extends RawUploadedFile {
  documentType?: string;
}

export interface PersonalFormData {
  firstName: string;
  dob: string | null;
  mobile: string;
  email: string;
  gender: string;
  idProofFile: ClientDocument | null;
}

export interface BusinessFormData {
  businessName: string;
  abn: string;
  acn: string;
  address: string;
  suburb: string;
  state: string;
  postalCode: string;
}

// Keyed by DOCUMENT_FIELDS[i].key
export interface DocumentFormData {
  [key: string]: ClientDocument | null;
}

export interface Client {
  id: number;
  clientId: string;
  avatar?: string;
  clientName: string;
  email: string;
  supportType: string;
  assignedWorker: string;
  activeJobs: number;
  location: string;
  fundingType: string;
  clientStatus: "ACTIVE" | "INACTIVE" | "PENDING";
  [key: string]: unknown;
}

export type StepId = "info" | "business" | "document";

export interface PersonalFormErrors {
  firstName?: string;
  dob?: string;
  mobile?: string;
  email?: string;
  gender?: string;
  idProofFile?: string;
}

export interface BusinessFormErrors {
  businessName?: string;
  abn?: string;
  acn?: string;
  address?: string;
  suburb?: string;
  state?: string;
  postalCode?: string;
}

export interface DocumentFormErrors {
  [key: string]: string;
}

export interface FormErrors {
  personal: PersonalFormErrors;
  business: BusinessFormErrors;
  document: DocumentFormErrors;
}