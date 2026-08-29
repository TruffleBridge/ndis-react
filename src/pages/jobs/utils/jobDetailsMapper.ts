import type {
    JobDetails,
    JobInfo,
    JobLocation,
    JobSession,
    JobUser,
} from "@/types/jobDetails";

const EMPTY_VALUE = "Not provided";

const toArray = <T>(value: unknown): T[] =>
    Array.isArray(value) ? (value as T[]) : [];

const safeString = (
    value: string | number | null | undefined,
    fallback = EMPTY_VALUE,
): string => {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }

    return String(value);
};

const normalizeJobId = (value: unknown): string => {
    const raw = value === null || value === undefined ? "" : String(value).trim();

    if (!raw) {
        return EMPTY_VALUE;
    }

    return raw.replace(/^J/i, "");
};

const buildFallbackJobDetails = (): JobDetails => ({
    jobId: EMPTY_VALUE,
    job: {
        id: 0,
        title: "-",
        description: "-",
        category: "-",
        hourlyRate: 0,
        shift: "-",
        hoursPerDay: 0,
        serviceRequirement: "-",
        status: "-",
        experienceLevel: null,
        genderPreference: null,
        isNdisCompliant: false,
        publishStatus: "-",
        frequency: null,
        preferredStartDate: null,
        clientPaidToNimora: null,
        isUrgentShift: false,
        postedBy: 0,
        createdAt: "",
        updatedAt: "",
    },
    jobServiceCategories: [],
    serviceType: "-",
    serviceCategory: "-",
    requiredSkills: [],
    preferredLanguages: [],
    certifications: [],
    locations: [],
    sessions: [],
    client: null,
    worker: null,
    booking: null,
    bookings: [],
    payments: [],
    jobStatus: "-",
    paymentStatus: "-",
});

export const normalizeJobDetails = (
    data: Record<string, any> | null | undefined,
): JobDetails | null => {
    if (!data) {
        return null;
    }

    const jobInfo: any = (data.job ?? {}) as Partial<JobInfo>;
    const client = (data.client ?? null) as JobUser | null;
    const worker = (data.worker ?? null) as JobUser | null;
    const sessions = toArray<JobSession>(data.sessions);
    const locations = toArray<JobLocation>(data.locations);
    const bookings: any = toArray<Record<string, any>>(data.bookings);
    const payments = toArray<Record<string, any>>(data.payments);

    return {
        jobId: normalizeJobId(data.jobId ?? jobInfo.id ?? data.id),
        job: {
            id: Number(jobInfo.id ?? data.jobId ?? 0),
            title: safeString(jobInfo.title, "-"),
            description: safeString(jobInfo.description, "-"),
            category: safeString(jobInfo.category, "-"),
            hourlyRate: Number(jobInfo.hourlyRate ?? 0),
            shift: safeString(jobInfo.shift, "-"),
            hoursPerDay: Number(jobInfo.hoursPerDay ?? 0),
            serviceRequirement: safeString(jobInfo.serviceRequirement, "-"),
            status: safeString(jobInfo.status, "-"),
            experienceLevel: jobInfo.experienceLevel ?? null,
            genderPreference: jobInfo.genderPreference ?? null,
            isNdisCompliant: Boolean(jobInfo.isNdisCompliant),
            publishStatus: safeString(jobInfo.publishStatus, "-"),
            frequency: jobInfo.frequency ?? null,
            preferredStartDate: jobInfo.preferredStartDate ?? null,
            clientPaidToNimora: jobInfo.clientPaidToNimora ?? null,
            isUrgentShift: Boolean(jobInfo.isUrgentShift),
            postedBy: Number(jobInfo.postedBy ?? 0),
            createdAt: jobInfo.createdAt ?? "",
            updatedAt: jobInfo.updatedAt ?? "",
        },
        jobServiceCategories: toArray(data.jobServiceCategories),
        serviceType: safeString(data.serviceType ?? jobInfo.serviceType, "-"),
        serviceCategory: safeString(data.serviceCategory ?? jobInfo.category, "-"),
        requiredSkills: toArray(data.requiredSkills ?? jobInfo.requiredSkills),
        preferredLanguages: toArray(data.preferredLanguages),
        certifications: toArray(data.certifications),
        locations,
        sessions,
        client,
        worker,
        booking: data.booking ?? bookings[0] ?? null,
        bookings,
        payments,
        jobStatus: safeString(data.jobStatus ?? jobInfo.status ?? data.status, "-"),
        paymentStatus: safeString(data.paymentStatus, "-"),
    };
};

export const mapJobManagementDetail = (
    data: Record<string, any> | null | undefined,
): JobDetails => normalizeJobDetails(data) ?? buildFallbackJobDetails();