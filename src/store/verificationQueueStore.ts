import { create } from "zustand";
import type {
  VerificationCategory,
  VerificationDocument,
  VerificationQueueItem,
  VerificationQueueState,
} from "../types/verificationDetailQueue";
import { createApiRequest } from "@/api/api";

export const useVerificationQueueStore = create<VerificationQueueState>((set, get) => ({
  queueList: [],
  loading: false,
  error: null,

  activeTab: "Client",

  isPanelOpen: false,
  selectedJob: null,
  selectedDocument: null,
  actionLoading: false,
  actionError: null,

  fetchVerificationQueue: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await createApiRequest("admin/userDocumentsList", { userId: id });
      const res = response?.data?.data ?? response?.data;
      set({ queueList: res.documents, loading: false });
    } catch (err: any) {
      set({
        error: err?.message || "Something went wrong while loading the verification queue.",
        loading: false,
      });
    }
  },

  setActiveTab: (tab: VerificationCategory) => set({ activeTab: tab }),

  openDocumentPanel: (jobId: string, documentId?: string) => {
    debugger;
    const job = get().queueList.find((item) => item.id === jobId) || null;
    const document =
      (documentId ? job?.documents.find((doc) => doc.id === documentId) : job?.documents[0]) ||
      job?.documents[0] ||
      null;

    set({
      selectedJob: job,
      selectedDocument: document,
      isPanelOpen: true,
      actionError: null,
    });
  },

  closeDocumentPanel: () =>
    set({ isPanelOpen: false, selectedJob: null, selectedDocument: null, actionError: null }),

  selectDocument: (document: VerificationDocument) => set({ selectedDocument: document }),

  approveDocument: async (jobId: string, documentId: string) => {
    set({ actionLoading: true, actionError: null });
    try {
      await createApiRequest("verificationDocument/approve", { jobId, documentId });

      set((state) => {
        const updatedList = applyDocumentStatus(state.queueList, jobId, documentId, "Completed");
        const updatedJob = updatedList.find((job) => job.id === jobId) || null;
        const updatedDoc = updatedJob?.documents.find((doc) => doc.id === documentId) || null;

        return {
          queueList: updatedList,
          selectedJob: state.selectedJob?.id === jobId ? updatedJob : state.selectedJob,
          selectedDocument:
            state.selectedDocument?.id === documentId ? updatedDoc : state.selectedDocument,
          actionLoading: false,
        };
      });
    } catch (err: any) {
      set({ actionError: err?.message || "Failed to approve document.", actionLoading: false });
    }
  },

  rejectDocument: async (jobId: string, documentId: string) => {
    set({ actionLoading: true, actionError: null });
    try {
      await createApiRequest("verificationDocument/reject", { jobId, documentId });

      set((state) => {
        const updatedList = applyDocumentStatus(state.queueList, jobId, documentId, "Rejected");
        const updatedJob = updatedList.find((job) => job.id === jobId) || null;
        const updatedDoc = updatedJob?.documents.find((doc) => doc.id === documentId) || null;

        return {
          queueList: updatedList,
          selectedJob: state.selectedJob?.id === jobId ? updatedJob : state.selectedJob,
          selectedDocument:
            state.selectedDocument?.id === documentId ? updatedDoc : state.selectedDocument,
          actionLoading: false,
        };
      });
    } catch (err: any) {
      set({ actionError: err?.message || "Failed to reject document.", actionLoading: false });
    }
  },
}));

// ------------------------------------------------------------
// Helper: immutably update one document's status inside the list
// and recompute the parent job's completed count / overall status.
// ------------------------------------------------------------
function applyDocumentStatus(
  list: VerificationQueueItem[],
  jobId: string,
  documentId: string,
  status: "Completed" | "Rejected"
): VerificationQueueItem[] {
  return list.map((job) => {
    if (job.id !== jobId) return job;

    const documents = job.documents.map((doc) =>
      doc.id === documentId ? { ...doc, status } : doc
    );
    const completedDocuments = documents.filter((doc) => doc.status === "Completed").length;
    const overallStatus = completedDocuments === documents.length ? "Completed" : "Pending";

    return { ...job, documents, completedDocuments, overallStatus };
  });
}
