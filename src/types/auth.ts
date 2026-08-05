export interface User {
    id: number;
    firstName: string;
    lastName: string | null;
    email: string;
    phone: string | null;
    countryCode: string | null;
    authProvider: string;
    providerId: string | null;
    profilePicture: string | null;
    emailVerified: boolean;
    activeStatus: boolean;
    deleteStatus: boolean;
    passwordResetToken: string | null;
    passwordResetExpiry: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    idProof: string | null;
    otp: string | null;
    otpExpiry: string | null;
    stripeConnectAccountId: string | null;
    stripeConnectOnboarded: boolean;
    stripeCustomerId: string | null;
    timezone: string | null;
    createdBy: string | null;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponseData {
    user: User;
    accessToken: string;
}

export interface LoginApiResponse {
    status: boolean;
    message: string;
    data: LoginResponseData;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface AuthActions {
    login: (
        payload: LoginPayload
    ) => Promise<{ success: boolean; message?: string }>;
    forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    clearError: () => void;
    setUser: (user: User) => void;
    refreshToken: () => Promise<boolean>;   // ADD THIS
}

export type AuthStore = AuthState & AuthActions;