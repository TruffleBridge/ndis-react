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

import {
  createApiRequest,
  updateApiRequest,
} from "@/api/api";

import { handleApiError } from "@/utils/errorHandler";

/* --------------------------------------------------
 * API DOCUMENT -> FRONTEND DOCUMENT
 * -------------------------------------------------- */

const mapApiDocument = (
  document: ApiVerificationDocument
): VerificationDocument => {
  /*
   * IMPORTANT:
   *
   * Don't use only:
   *
   * document.documentUrls?.[0]
   *
   * because a document can have multiple files.
   *
   * Example:
   *
   * Driving License
   *   documentUrls[0] = Front
   *   documentUrls[1] = Back
   */

  const files = document.documentUrls ?? [];
  const firstFile = files[0] ?? null;

  return {
    id: String(document.id),

    documentTypeId: document.documentTypeId,

    documentName:
      document.documentType?.name ||
      firstFile?.name ||
      "Unknown Document",

    documentType:
      document.documentType?.name ||
      "Unknown Document",

    status: document.status,

    referenceNumber: document.referenceNumber,

    startDate: document.startDate,

    expiryDate: document.expiryDate,

    isVerificationExpires:
      document.isVerificationExpires,

    notes: document.notes,

    isCurrent: document.isCurrent,

    isActive: document.isActive,

    /*
     * Store ALL files.
     */
    documentUrls: files,

    /*
     * Keep first-file values for
     * existing components.
     */
    documentUrl: firstFile?.url ?? null,

    fileName: firstFile?.name ?? null,

    fileSize: firstFile?.size ?? null,

    fileType: firstFile?.type ?? null,

    uploadedAt:
      firstFile?.uploadedAt ??
      firstFile?.createdAt ??
      null,
  };
};

/* --------------------------------------------------
 * API RESPONSE -> QUEUE ITEM
 * -------------------------------------------------- */

const mapApiResponseToQueueItem = (
  response: UserDocumentsApiResponse
): VerificationQueueItem => {
  const documents = (response.documents || []).map(
    mapApiDocument
  );

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

  if (
    documents.length > 0 &&
    pendingDocuments === 0
  ) {
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

/* --------------------------------------------------
 * STORE
 * -------------------------------------------------- */

export const useVerificationQueueStore =
  create<VerificationQueueState>((set, get) => ({
    /* --------------------------------------------------
     * INITIAL STATE
     * -------------------------------------------------- */

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
     * FETCH USER DOCUMENTS
     * -------------------------------------------------- */

    fetchVerificationQueue: async (id: string) => {
      /*
       * Reset selected document first.
       *
       * This is important when coming again
       * from parent table.
       *
       * Every new user entry starts with
       * document[0].
       */

      set({
        loading: true,

        error: null,

        selectedJob: null,

        selectedDocument: null,

        isPanelOpen: false,

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
          throw new Error(
            "Invalid user documents response."
          );
        }

        const queueItem =
          mapApiResponseToQueueItem(res);

        /*
         * DEFAULT FIRST DOCUMENT
         */

        const firstDocument =
          queueItem.documents?.[0] ?? null;

        set({
          queueList: [queueItem],

          selectedJob: queueItem,

          selectedDocument: firstDocument,

          isPanelOpen: true,

          loading: false,

          error: null,

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
     * ACTIVE TAB
     * -------------------------------------------------- */

    setActiveTab: (tab: VerificationCategory) => {
      set({
        activeTab: tab,
      });
    },

    /* --------------------------------------------------
     * OPEN DOCUMENT PANEL
     * -------------------------------------------------- */

    openDocumentPanel: (
      jobId: string,
      documentId?: string
    ) => {
      const job =
        get().queueList.find(
          (item) => item.id === jobId
        ) ?? null;

      if (!job) {
        return;
      }

      /*
       * If documentId is provided:
       * select that document.
       *
       * Otherwise:
       * select first document.
       */

      const document = documentId
        ? job.documents.find(
            (doc) => doc.id === documentId
          ) ?? null
        : job.documents?.[0] ?? null;

      set({
        selectedJob: job,

        selectedDocument: document,

        isPanelOpen: true,

        actionError: null,
      });
    },

    /* --------------------------------------------------
     * CLOSE PANEL
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
     * SELECT DOCUMENT
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
     * APPROVE DOCUMENT
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
          }
        );

        updateLocalDocument(
          set,
          jobId,
          documentId,
          "VERIFIED"
        );
      } catch (err: any) {
        const message = handleApiError(
          err,
          "Failed to approve document."
        );

        set({
          actionError: message,

          actionLoading: false,
        });
      }
    },

    /* --------------------------------------------------
     * REJECT DOCUMENT
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
        await updateApiRequest(
          "admin/updateUserDocumentStatus",
          {
            documentId: Number(documentId),

            status: "REJECTED",
          }
        );

        updateLocalDocument(
          set,
          jobId,
          documentId,
          "REJECTED"
        );
      } catch (err: any) {
        const message = handleApiError(
          err,
          "Failed to reject document."
        );

        set({
          actionError: message,

          actionLoading: false,
        });
      }
    },
  }));

/* --------------------------------------------------
 * UPDATE LOCAL DOCUMENT AFTER API SUCCESS
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
                  /*
                   * IMPORTANT:
                   * This preserves documentUrls.
                   */
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
      ) ?? null;

    /*
     * Keep selected document pointing
     * to the updated object.
     */
    const updatedDocument =
      updatedJob?.documents.find(
        (doc) => doc.id === documentId
      ) ?? null;

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