import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AdminProfile } from "@/types/profile";

interface ProfileState {
    // ---- data ----
    profile: AdminProfile;
    draftProfile: AdminProfile; // holds edits until "Update" is clicked

    // ---- ui state ----
    isEditMode: boolean;
    isSaving: boolean;

    // ---- actions ----
    setField: <K extends keyof AdminProfile>(field: K, value: AdminProfile[K]) => void;
    enterEditMode: () => void;
    cancelEdit: () => void;
    updateProfile: () => Promise<void>;
    logout: () => void;
}

// ---- mock initial admin data (replace with API response) ----
const initialProfile: AdminProfile = {
    id: "ADM-1001",
    fullName: "Karthik Raja",
    email: "karthik.raja@company.com",
    phone: "+91 98765 43210",
    employeeId: "EMP-2044",
    role: "Super Admin",
    department: "Operations",
    designation: "Portal Administrator",
    joiningDate: "2022-03-14",
    address: "12, Anna Nagar 2nd Street",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    avatarUrl: "",
    status: "Active",
};

export const useProfileStore = create<ProfileState>()(
    devtools((set) => ({
        profile: initialProfile,
        draftProfile: initialProfile,
        isEditMode: false,
        isSaving: false,

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

        updateProfile: async () => {
            set({ isSaving: true });
            try {
                // TODO: replace with real API call
                // await api.put(`/admin/profile/${get().draftProfile.id}`, get().draftProfile);
                await new Promise((resolve) => setTimeout(resolve, 800));

                set((state) => ({
                    profile: { ...state.draftProfile },
                    isEditMode: false,
                    isSaving: false,
                }));
            } catch (err) {
                set({ isSaving: false });
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