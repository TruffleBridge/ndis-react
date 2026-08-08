import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AdminProfile } from "@/types/profile";
import { createApiRequest, getApiRequest, updateApiRequest } from "@/api/api";
import { handleApiError } from "@/utils/errorHandler";

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const initialPasswordForm: PasswordForm = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

interface ProfileState {
    // ---- data ----
    profile: AdminProfile;
    draftProfile: AdminProfile; // holds edits until "Update" is clicked

    // ---- ui state ----
    isEditMode: boolean;
    isSaving: boolean;
    getlistLoading: boolean;
    errors: string | null;

    // ---- password change state ----
    passwordForm: PasswordForm;
    isPasswordSaving: boolean;
    passwordError: string | null;
    passwordSuccess: string | null;

    // ---- actions ----
    setField: <K extends keyof AdminProfile>(field: K, value: AdminProfile[K]) => void;
    enterEditMode: () => void;
    cancelEdit: () => void;
    updateProfile: () => Promise<void>;
    initForm: () => Promise<void>;
    logout: () => void;

    // ---- password actions ----
    setPasswordField: <K extends keyof PasswordForm>(field: K, value: PasswordForm[K]) => void;
    resetPasswordForm: () => void;
    updatePassword: () => Promise<boolean>;
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
    url: '',
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

        // password state
        passwordForm: initialPasswordForm,
        isPasswordSaving: false,
        passwordError: null,
        passwordSuccess: null,


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
                profilePicture: draftProfile?.url ?? "",
                status: draftProfile?.status ?? "",
            }
            try {
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

        // ---- password handlers ----
        setPasswordField: (field, value) =>
            set((state) => ({
                passwordForm: { ...state.passwordForm, [field]: value },
                passwordError: null,
                passwordSuccess: null,
            })),

        resetPasswordForm: () =>
            set({
                passwordForm: initialPasswordForm,
                passwordError: null,
                passwordSuccess: null,
            }),

        updatePassword: async () => {
            const { passwordForm } = get();
            const { currentPassword, newPassword, confirmPassword } = passwordForm;

            if (!currentPassword || !newPassword || !confirmPassword) {
                set({ passwordError: "Please fill all password fields" });
                return false;
            }
            if (newPassword !== confirmPassword) {
                set({ passwordError: "New password and confirm password do not match" });
                return false;
            }

            set({ isPasswordSaving: true, passwordError: null, passwordSuccess: null });
            try {
                const payload = { currentPassword, newPassword, confirmPassword };
                const res = await createApiRequest("/auth/updatePassword", payload);
                const success = res?.data?.status || res?.data?.data?.status;
                if (success) {
                    set({
                        isPasswordSaving: false,
                        passwordSuccess: "Password updated successfully",
                        passwordForm: initialPasswordForm,
                    });
                    return true;
                } else {
                    set({ isPasswordSaving: false, passwordError: "Failed to update password" });
                    return false;
                }
            } catch (err) {
                const message = handleApiError(err, "Failed to update password");
                set({ isPasswordSaving: false, passwordError: message ?? "Failed to update password" });
                return false;
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