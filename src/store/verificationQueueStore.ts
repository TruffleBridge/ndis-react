import { create } from "zustand";

import type {
  ApiVerificationDocument,
  DocumentStatus,
  VerificationCategory,
  VerificationDocument,
  VerificationQueueItem,
  VerificationQueueState,
  UserDocumentsApiResponse,
} from "../types/verificationDetailQueue";

import { createApiRequest, updateApiRequest } from "@/api/api";
import { handleApiError } from "@/utils/errorHandler";

const mapApiDocument = (
  document: ApiVerificationDocument
): VerificationDocument => {
  const file = document.documentUrls?.[0] ?? null;

  return {
    id: String(document.id),

    documentTypeId: document.documentTypeId,

    documentName:
      document.documentType?.name ||
      file?.name ||
      "Unknown Document",

    documentType:
      document.documentType?.name ||
      "Unknown Document",

    status: document.status,

    referenceNumber: document.referenceNumber,

    startDate: document.startDate,

    expiryDate: document.expiryDate,

    isVerificationExpires: document.isVerificationExpires,

    notes: document.notes,

    isCurrent: document.isCurrent,

    isActive: document.isActive,

    documentUrl: file?.url ?? null,

    fileName: file?.name ?? null,

    fileSize: file?.size ?? null,

    fileType: file?.type || "application/pdf",

    uploadedAt: file?.uploadedAt ?? null,
  };
};

const mapApiResponseToQueueItem = (
  response: UserDocumentsApiResponse
): VerificationQueueItem => {
  const documents = (response.documents || []).map(mapApiDocument);

  const completedDocuments = documents.filter(
    (doc) => doc.status === "VERIFIED"
  ).length;

  const rejectedDocuments = documents.filter(
    (doc) => doc.status === "REJECTED"
  ).length;

  const pendingDocuments = documents.filter(
    (doc) => doc.status === "PENDING"
  ).length;

  let overallStatus: DocumentStatus = "PENDING";

  if (documents.length > 0 && pendingDocuments === 0) {
    if (rejectedDocuments > 0) {
      overallStatus = "REJECTED";
    } else {
      overallStatus = "VERIFIED";
    }
  }

  const userName = [
    response.user?.firstName,
    response.user?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: String(response.user.id),

    name: userName || "Unknown User",

    refId: `USER-${response.user.id}`,

    category: "Client",

    documents,

    totalDocuments: documents.length,

    completedDocuments,

    rejectedDocuments,

    overallStatus,

    user: response.user,
  };
};

export const useVerificationQueueStore =
  create<VerificationQueueState>((set, get) => ({
    queueList: [],

    loading: false,

    error: null,

    activeTab: "Client",

    isPanelOpen: false,

    selectedJob: null,

    selectedDocument: null,

    actionLoading: false,

    actionError: null,

    /* --------------------------------------------------
     * Fetch user documents
     * -------------------------------------------------- */

    fetchVerificationQueue: async (id: string) => {
      set({
        loading: true,
        error: null,
        selectedJob: null,
        selectedDocument: null,
        actionError: null,
      });

      try {
        const response = await createApiRequest(
          "admin/userDocumentsList",
          {
            userId: id,
          }
        );

        const res: UserDocumentsApiResponse =
          response?.data?.data ?? response?.data;

        if (!res?.user) {
          throw new Error("Invalid user documents response.");
        }

        const queueItem = mapApiResponseToQueueItem(res);

        // First document default selection
        const firstDocument =
          queueItem.documents?.[0] ?? null;

        set({
          queueList: [queueItem],

          selectedJob: queueItem,

          selectedDocument: firstDocument,

          isPanelOpen: true,

          loading: false,

          actionError: null,
        });
      } catch (err: any) {
        const message = handleApiError(
          err,
          "Something went wrong while loading the verification queue"
        );

        set({
          error: message,
          loading: false,
          selectedJob: null,
          selectedDocument: null,
          isPanelOpen: false,
        });
      }
    },


    /* --------------------------------------------------
     * Active tab
     * -------------------------------------------------- */

    setActiveTab: (tab: VerificationCategory) => {
      set({
        activeTab: tab,
      });
    },

    /* --------------------------------------------------
     * Open document panel
     * -------------------------------------------------- */

    openDocumentPanel: (
      jobId: string,
      documentId?: string
    ) => {
      const job =
        get().queueList.find(
          (item) => item.id === jobId
        ) || null;

      if (!job) {
        return;
      }

      const document =
        documentId
          ? job.documents.find(
            (doc) => doc.id === documentId
          ) || null
          : job.documents?.[0] || null;

      set({
        selectedJob: job,

        selectedDocument: document,

        isPanelOpen: true,

        actionError: null,
      });
    },


    /* --------------------------------------------------
     * Close panel
     * -------------------------------------------------- */

    closeDocumentPanel: () => {
      set({
        isPanelOpen: false,

        selectedJob: null,

        selectedDocument: null,

        actionError: null,
      });
    },

    /* --------------------------------------------------
     * Select document
     * -------------------------------------------------- */

    selectDocument: (
      document: VerificationDocument
    ) => {
      set({
        selectedDocument: document,
        actionError: null,
      });
    },


    /* --------------------------------------------------
     * Update document status
     * -------------------------------------------------- */

    updateDocumentStatus: async () => {
      // kept internally through approve/reject below
    },

    /* --------------------------------------------------
     * Approve
     * PUT /admin/updateUserDocumentStatus
     * -------------------------------------------------- */

    approveDocument: async (
      jobId: string,
      documentId: string
    ) => {
      set({
        actionLoading: true,
        actionError: null,
      });

      try {
        await updateApiRequest(
          "admin/updateUserDocumentStatus",
          {
            documentId: Number(documentId),
            status: "VERIFIED",
          },
        );

        updateLocalDocument(
          set,
          jobId,
          documentId,
          "VERIFIED"
        );
      } catch (err: any) {
        const message = handleApiError(err, "Failed to approve document.");
        set({
          actionError: message,
          actionLoading: false,
        });
      }
    },

    /* --------------------------------------------------
     * Reject
     * PUT /admin/updateUserDocumentStatus
     * -------------------------------------------------- */

    rejectDocument: async (
      jobId: string,
      documentId: string
    ) => {
      set({
        actionLoading: true,
        actionError: null,
      });

      try {
        await createApiRequest(
          "admin/updateUserDocumentStatus",
          {
            documentId: Number(documentId),
            status: "REJECTED",
          },
          "PUT"
        );

        updateLocalDocument(
          set,
          jobId,
          documentId,
          "REJECTED"
        );
      } catch (err: any) {
        const message = handleApiError(err, "Failed to reject document.");
        set({
          actionError: message,
          actionLoading: false,
        });
      }
    },
  }));

/* --------------------------------------------------
 * Local state update after API success
 * -------------------------------------------------- */

function updateLocalDocument(
  set: any,
  jobId: string,
  documentId: string,
  status: "VERIFIED" | "REJECTED"
) {
  set((state: VerificationQueueState) => {
    const updatedList = state.queueList.map(
      (job) => {
        if (job.id !== jobId) {
          return job;
        }

        const documents = job.documents.map(
          (doc) =>
            doc.id === documentId
              ? {
                ...doc,
                status,
              }
              : doc
        );

        const completedDocuments =
          documents.filter(
            (doc) => doc.status === "VERIFIED"
          ).length;

        const rejectedDocuments =
          documents.filter(
            (doc) => doc.status === "REJECTED"
          ).length;

        const pendingDocuments =
          documents.filter(
            (doc) => doc.status === "PENDING"
          ).length;

        let overallStatus: DocumentStatus =
          "PENDING";

        if (pendingDocuments === 0) {
          if (rejectedDocuments > 0) {
            overallStatus = "REJECTED";
          } else {
            overallStatus = "VERIFIED";
          }
        }

        return {
          ...job,

          documents,

          completedDocuments,

          rejectedDocuments,

          overallStatus,
        };
      }
    );

    const updatedJob =
      updatedList.find(
        (job) => job.id === jobId
      ) || null;

    const updatedDocument =
      updatedJob?.documents.find(
        (doc) => doc.id === documentId
      ) || null;

    return {
      queueList: updatedList,

      selectedJob:
        state.selectedJob?.id === jobId
          ? updatedJob
          : state.selectedJob,

      selectedDocument:
        state.selectedDocument?.id === documentId
          ? updatedDocument
          : state.selectedDocument,

      actionLoading: false,

      actionError: null,
    };
  });
}
