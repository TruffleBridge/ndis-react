import { createApiRequest } from "@/api/api";
import { handleApiError } from "@/utils/errorHandler";
import { create } from "zustand";

interface ExportStore {
    loading: boolean;
    error: string | null;

    exportExcel: (
        endpoint: string,
        payload: object
    ) => Promise<void>;
}

export const useExportStore = create<ExportStore>((set) => ({
    loading: false,
    error: null,

    exportExcel: async (endpoint, payload) => {
        try {
            set({
                loading: true,
                error: null,
            });

            const response = await createApiRequest(
                endpoint,
                payload
            );

            const { base64, filename } = response.data.data;

            const blob = new Blob(
                [
                    Uint8Array.from(atob(base64), (c) =>
                        c.codePointAt(0) ?? 0
                    ),
                ],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = filename || "export.xlsx";

            document.body.appendChild(a);
            a.click();

            a.remove();
            URL.revokeObjectURL(url);

        } catch (error: unknown) {
            const message = handleApiError(error, "Excel export failed");
            set({ error: message ?? "Excel export failed" });

            throw error;

        } finally {
            set({
                loading: false,
            });
        }
    },
}));
