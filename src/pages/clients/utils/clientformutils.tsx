import type {
    BusinessFormData,
    ClientRecord,
    ClientSubmitPayload,
    DocumentFormData,
    FormMode,
    PersonalFormData,
} from "./types";
import { DOCUMENT_FIELDS } from "./constants";


export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    uploadedAt: Date;
}

// Mock file helper - the upload components store a real `UploadedFile`
// (which wraps a browser `File`), so seeding mock "already uploaded" data
// for Edit/View needs a real File instance too. This is demo-only; a real
// backend would instead return a URL/metadata for an already-uploaded file.
const createMockUploadedFile = (name: string, sizeBytes = 128_000): UploadedFile => {
    const type = name.endsWith(".pdf") ? "application/pdf" : "image/png";
    return {
        file: new File(["mock file content"], name, { type }),
        name,
        size: sizeBytes,
        uploadedAt: new Date("2026-01-15"),
    };
};

// Default ("empty") data builders - used whenever mode === "create"

export const getDefaultPersonalData = (): PersonalFormData => ({
    firstName: "",
    dob: null,
    mobile: "",
    email: "",
    gender: "",
    idProofFile: null,
});

export const getDefaultBusinessData = (): BusinessFormData => ({
    businessName: "",
    abn: "",
    acn: "",
    address: "",
    suburb: "",
    state: "",
    postalCode: "",
});

export const getDefaultDocumentData = (): DocumentFormData =>
    DOCUMENT_FIELDS.reduce<DocumentFormData>((acc, field) => {
        acc[field.key] = null;
        return acc;
    }, {});

// Mock "database" - simulates records that would normally be fetched from an
// API. Keyed by the same numeric `id` used in the ClientTable rows, so
// Edit/View can look up a full record in O(1) with no network call.
const MOCK_CLIENT_DB: Record<number, ClientRecord> = {
    1: {
        id: 1,
        personal: {
            firstName: "Jane Cooper",
            dob: "1990-04-12",
            mobile: "+61 400 111 222",
            email: "lanasteiner@gmail.com",
            gender: "female",
            idProofFile: createMockUploadedFile("jane-cooper-id.pdf"),
        },
        business: {
            businessName: "Care Solutions Pty. Ltd",
            abn: "12345678901",
            acn: "123456789",
            address: "123 Example Street",
            suburb: "Sydney",
            state: "NSW",
            postalCode: "2000",
        },
        documents: {
            ndisCertificate: createMockUploadedFile("ndis-certificate.pdf"),
            ndisAudit: createMockUploadedFile("ndis-audit.pdf"),
            publicLiabilityInsurance: createMockUploadedFile("public-liability.pdf"),
            personalIndemnityInsurance: null,
            workersCompInsurance: createMockUploadedFile("workers-comp.pdf"),
            incidentManagementPolicy: null,
            complianceManagementPolicy: null,
            privatePolicy: null,
            whsPolicy: null,
            annualComplianceDeclaration: null,
            riskManagementPolicy: null,
            infectionControlPolicy: null,
            restrictivePractisePolicy: null,
        },
    },
    2: {
        id: 2,
        personal: {
            firstName: "Phoenix Baker",
            dob: "1988-11-02",
            mobile: "+61 400 333 444",
            email: "phoenixbaker@gmail.com",
            gender: "male",
            idProofFile: createMockUploadedFile("phoenix-baker-id.pdf"),
        },
        business: {
            businessName: "Phoenix Home Care",
            abn: "98765432109",
            acn: "",
            address: "45 Collins Street",
            suburb: "Melbourne",
            state: "VIC",
            postalCode: "3000",
        },
        documents: getDefaultDocumentData(),
    },
    // Add more seeded rows here as needed - any id not listed falls back to
    // a blank record via getClientRecordById() below, so nothing crashes.
};

/**
 * Simulates an API GET for a single client record.
 * Falls back to a default/empty record shape if the id isn't in the mock DB,
 * so Edit/View never crash for rows that don't have seeded mock data.
 */
export const getClientRecordById = (id: number): ClientRecord => {
    return (
        MOCK_CLIENT_DB[id] ?? {
            id,
            personal: getDefaultPersonalData(),
            business: getDefaultBusinessData(),
            documents: getDefaultDocumentData(),
        }
    );
};

// Payload builder - combines the 3 child forms into a single submit payload
export const buildSubmitPayload = (
    mode: FormMode,
    clientId: number | null,
    personal: PersonalFormData,
    business: BusinessFormData,
    documents: DocumentFormData
): ClientSubmitPayload => ({
    id: clientId,
    mode,
    personal,
    business,
    documents,
});

/**
 * Simulates persisting the payload (POST for create, PATCH for edit).
 * Swap the body of this function out for a real API call later - nothing
 * else in the module needs to change, since every component only ever
 * talks to this function, never to `fetch` directly.
 */
export const submitClientPayload = async (
    payload: ClientSubmitPayload
): Promise<{ success: true }> => {
    console.log(`[mock API] ${payload.mode === "create" ? "Creating" : "Updating"} client`, payload);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
};