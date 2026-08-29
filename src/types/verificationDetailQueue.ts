// ============================================================
// Verification Queue — Type Definitions
// ============================================================

export type DocumentStatus = "Completed" | "Pending" | "Rejected";
export type VerificationCategory = "Client" | "Support Worker";

// Extra structured fields shown in the preview panel for an
// identity-style document (passport / ID card). Optional because
// not every document type has a structured preview.
export interface IdentityPreview {
  documentType: string; // e.g. "P" (Passport)
  issuingCountry: string; // e.g. "AUS"
  documentNo: string; // Passport / ID number
  surname: string;
  givenNames: string;
  sex: string;
  nationality: string;
  dateOfBirth: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  photoUrl: string;
}

export interface VerificationDocument {
  id: string;
  documentName: string;
  status: DocumentStatus;
  fileUrl: string;
  identityPreview?: IdentityPreview;
}

export interface VerificationQueueItem {
  id: string;
  refId: string;
  name: string;
  email: string;
  category: VerificationCategory;
  submittedDate: string;
  totalDocuments: number;
  completedDocuments: number;
  overallStatus: DocumentStatus;
  documents: VerificationDocument[];
}

// ------------------------------------------------------------
// Zustand store contract
// ------------------------------------------------------------
export interface VerificationQueueState {
  queueList: VerificationQueueItem[];
  loading: boolean;
  error: string | null;

  activeTab: VerificationCategory;

  // Right-side document preview panel
  isPanelOpen: boolean;
  selectedJob: VerificationQueueItem | null;
  selectedDocument: VerificationDocument | null;
  actionLoading: boolean;
  actionError: string | null;

  fetchVerificationQueue: (id?: string) => Promise<void>;
  setActiveTab: (tab: VerificationCategory) => void;

  openDocumentPanel: (jobId: string, documentId?: string) => void;
  closeDocumentPanel: () => void;
  selectDocument: (document: VerificationDocument) => void;

  approveDocument: (jobId: string, documentId: string) => Promise<void>;
  rejectDocument: (jobId: string, documentId: string) => Promise<void>;
}
