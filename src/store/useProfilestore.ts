import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AdminProfile } from "@/types/profile";
import { getApiRequest, updateApiRequest } from "@/api/api";
import { handleApiError } from "@/utils/errorHandler";

interface ProfileState {
    // ---- data ----
    profile: AdminProfile;
    draftProfile: AdminProfile; // holds edits until "Update" is clicked

    // ---- ui state ----
    isEditMode: boolean;
    isSaving: boolean;
    getlistLoading: boolean;

    // ---- actions ----
    setField: <K extends keyof AdminProfile>(field: K, value: AdminProfile[K]) => void;
    enterEditMode: () => void;
    cancelEdit: () => void;
    updateProfile: () => Promise<void>;
    initForm: () => Promise<void>;
    logout: () => void;
    errors: string | null;
}

// ---- mock initial admin data (replace with API response) ----
const initialProfile: AdminProfile = {
    id: "",
    fullName: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    avatarUrl: "",
    status: null,
};

export const useProfileStore = create<ProfileState>()(
    devtools((set, get) => ({
        profile: initialProfile,
        draftProfile: initialProfile,
        isEditMode: false,
        isSaving: false,
        errors: "",
        getlistLoading: false,


        setField: (field, value) =>
            set((state) => ({
                draftProfile: { ...state.draftProfile, [field]: value },
            })),

        enterEditMode: () =>
            set((state) => ({
                isEditMode: true,
                draftProfile: { ...state.profile }, // fresh copy to edit
            })),

        cancelEdit: () =>
            set((state) => ({
                isEditMode: false,
                draftProfile: { ...state.profile }, // discard changes
            })),


        initForm: async () => {


            // Edit and View both need the existing record - same GET, different
            // `isView` flag downstream in the components.
            set({ getlistLoading: true });
            try {
                const res = await getApiRequest("/profile/getProfile");
                const record = res.data?.data?.user ?? res.data?.user ?? {};
                const record_ = res.data?.data ?? res.data ?? {};
                const loc = record_.userLocation?.[0] ?? {};
                const roles_ = record.roles?.[0] ?? {};
                set({
                    getlistLoading: false,
                    profile: {
                        ...record,
                        id: record?.id ?? "",
                        fullName: [record?.firstName, record?.lastName]
                            .filter(Boolean)
                            .join(" ").trim() || "",
                        email: record?.email ?? "",
                        phone: record?.phone ?? "",
                        role: roles_?.name ?? "",
                        address: loc?.street1 ?? "",
                        city: loc?.suburb ?? "",
                        state: loc?.state ?? "",
                        pincode: loc?.zipCode ?? "",
                        avatarUrl: record?.profilePicture ?? "",
                        status: record?.activeStatus ? "Active" : "Inactive",
                    },
                    draftProfile: {
                        id: record?.id ?? "",
                        fullName: [record?.firstName, record?.lastName]
                            .filter(Boolean)
                            .join(" ").trim() || "",
                        email: record?.email ?? "",
                        phone: record?.phone ?? "",
                        role: roles_?.name ?? "",
                        address: loc?.street1 ?? "",
                        city: loc?.suburb ?? "",
                        state: loc?.state ?? "",
                        pincode: loc?.zipCode ?? "",
                        avatarUrl: record?.profilePicture ?? "",
                        status: record?.activeStatus ? "Active" : "Inactive",

                    },
                });

            } catch (err) {
                set({ getlistLoading: false, errors: "Failed to load client record" });
            }
        },

        updateProfile: async () => {
            const { draftProfile } = get();
            set({ isSaving: true });
            const payload = {
                userId: draftProfile?.id ?? "",
                firstName: draftProfile?.fullName ?? "",
                email: draftProfile?.email ?? "",
                role: draftProfile?.role ?? "",
                phoneNumber: draftProfile?.phone ?? "",
                countryCode: "+61", // TODO: make this dynamic if needed
                userAddress: {
                    street1: draftProfile?.address ?? "",
                    suburb: draftProfile?.city ?? "",
                    state: draftProfile?.state ?? "",
                    zipCode: draftProfile?.pincode ?? "",
                },
                profilePicture: draftProfile?.avatarUrl ?? "",
                status: draftProfile?.status ?? "",
            }
            try {
                // TODO: replace with real API call
                const res = await updateApiRequest("/admin/updateUser", payload);
                const updatedRecord = res.data?.status || res?.data?.data?.status;
                if (updatedRecord) {
                    set({ isEditMode: false, isSaving: false });
                } else {
                    set({ isSaving: false, errors: "Failed to update user" });
                }
                return updatedRecord;
            } catch (err) {
                const message = handleApiError(err, "Failed to update user");
                set({ isSaving: false, errors: message ?? "Failed to submit worker details" });
                throw err;
            }
        },

        logout: () => {
            // TODO: clear auth tokens / call logout API, then redirect
            window.location.href = "/login";
            localStorage.removeItem("authToken");
            localStorage.clear();
        },
    }))
);