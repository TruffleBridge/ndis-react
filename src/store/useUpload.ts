import { create } from "zustand";
import type { ClientDocument } from "@/types/client";
import { createApiRequest } from "@/api/api";

interface UploadStore {
    uploadDocument: (file: File, documentType: string, fieldKey: string) => Promise<ClientDocument | null>;
    uploadingKeys: Record<string, boolean>;
    uploadErrors: Record<string, string>;
}
const ENDPOINTS = {
    upload: '/uploads'
}

export const useUploadStore = create<UploadStore>((set) => ({
    // ============================ COMMON UPLOAD API ============================
    // POST /api/uploads/ (multipart) -> { status, message, data: { name, key,
    // url, signedUrl, size } }. We stack `documentType` (the field's label) on
    // top of that response before handing it back to the caller.
    uploadingKeys: {},
    uploadErrors: {},

    uploadDocument: async (file, documentType, fieldKey) => {
        set((state) => ({
            uploadingKeys: { ...state.uploadingKeys, [fieldKey]: true },
            uploadErrors: { ...state.uploadErrors, [fieldKey]: "" },
        }));

        try {
            const formData = new FormData();
            formData.append("file", file);

            // interceptor - nothing extra needed here.
            const res = await createApiRequest(ENDPOINTS.upload, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const body = res.data?.data ?? res.data;

            const uploaded: ClientDocument = {
                ...body,
                ...{
                    type: body?.fileType,
                    uploadedAt: body?.createdAt
                },
                documentType,
            };

            set((state) => ({ uploadingKeys: { ...state.uploadingKeys, [fieldKey]: false } }));
            return uploaded;
        } catch (err) {
            set((state) => ({
                uploadingKeys: { ...state.uploadingKeys, [fieldKey]: false },
                uploadErrors: { ...state.uploadErrors, [fieldKey]: "Upload failed. Please try again." },
            }));
            return null;
        }
    },

}));