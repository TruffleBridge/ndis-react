export type DocumentStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type VerificationCategory = "Client";

export interface ApiDocumentUrl {
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface ApiDocumentType {
  id: number;
  name: string;
}

export interface ApiVerificationDocument {
  id: number;
  userId: number;
  documentTypeId: number;
  referenceNumber: string | null;
  isVerificationExpires: boolean;
  startDate: string | null;
  expiryDate: string | null;
  documentUrls: ApiDocumentUrl[];
  notes: string | null;
  isCurrent: boolean;
  status: DocumentStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  documentType: ApiDocumentType;
}

export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string;
  countryCode: string;
  profilePicture: string | null;
}

export interface UserDocumentsApiResponse {
  user: ApiUser;
  documents: ApiVerificationDocument[];
  count: number;
}

/* --------------------------------------------------
 * Frontend types
 * -------------------------------------------------- */

export interface VerificationDocument {
  id: string;
  documentTypeId: number;
  documentName: string;
  status: DocumentStatus;

  referenceNumber: string | null;
  startDate: string | null;
  expiryDate: string | null;
  isVerificationExpires: boolean;

  notes: string | null;
  isCurrent: boolean;
  isActive: boolean;

  documentUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  uploadedAt: string | null;

  documentType: string;

  // Kept optional so existing identity preview UI won't break.
  identityPreview?: {
    photoUrl?: string;
    givenNames: string;
    surname: string;
    documentType: string;
    issuingCountry: string;
    documentNo: string;
    sex: string;
    nationality: string;
    dateOfBirth: string;
    dateOfIssue: string;
    dateOfExpiry: string;
  };
}

export interface VerificationQueueItem {
  id: string;
  name: string;
  refId: string;
  category: VerificationCategory;

  documents: VerificationDocument[];

  totalDocuments: number;
  completedDocuments: number;
  rejectedDocuments: number;

  overallStatus: DocumentStatus;

  user: ApiUser;
}

export interface VerificationQueueState {
  queueList: VerificationQueueItem[];

  loading: boolean;
  error: string | null;

  activeTab: VerificationCategory;

  isPanelOpen: boolean;
  selectedJob: VerificationQueueItem | null;
  selectedDocument: VerificationDocument | null;

  actionLoading: boolean;
  actionError: string | null;

  fetchVerificationQueue: (id: string) => Promise<void>;

  setActiveTab: (tab: VerificationCategory) => void;

  openDocumentPanel: (
    jobId: string,
    documentId?: string
  ) => void;

  closeDocumentPanel: () => void;

  selectDocument: (document: VerificationDocument) => void;

  approveDocument: (
    jobId: string,
    documentId: string
  ) => Promise<void>;

  rejectDocument: (
    jobId: string,
    documentId: string
  ) => Promise<void>;
}
