import type { ReactNode } from "react";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AssuredWorkloadOutlinedIcon from "@mui/icons-material/AssuredWorkloadOutlined";
import { PolicyIcon, WorkerIcon } from "../../../assets";

// Step 1: Personal Information constants
export const GENDER_OPTIONS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-binary", value: "non-binary" },
    { label: "Prefer not to say", value: "na" },
];

// Step 3: Document Registration constants.
// Centralising the field config means DocumentRegisterStep can `.map()` over
// this list instead of hand-repeating a <UploadVariant2 /> per document, and
// `key` is exactly what each upload is stored under in DocumentFormData.
export interface DocumentFieldConfig {
    key: string;
    label: string;
    sublabel: string;
    icon?: ReactNode;
    section: "mandatory" | "recommended";
}

export const DOCUMENT_FIELDS: DocumentFieldConfig[] = [
    { key: "ndisCertificate", label: "NDIS Certificate of Registration", sublabel: "Mandatory for all registered providers", section: "mandatory" },
    { key: "ndisAudit", label: "NDIS Audit Certificate", sublabel: "Latest audit documents", icon: <RuleOutlinedIcon  htmlColor="#3E4947"  />, section: "mandatory" },
    { key: "publicLiabilityInsurance", label: "Public Liability Insurance", sublabel: "Mandatory for all registered providers", icon: <ShieldOutlinedIcon  htmlColor="#3E4947"  />, section: "mandatory" },
    { key: "personalIndemnityInsurance", label: "Personal Indemnity Insurance", sublabel: "Mandatory for all registered providers", icon: <AssuredWorkloadOutlinedIcon htmlColor="#3E4947" />, section: "mandatory" },
    { key: "workersCompInsurance", label: "Workers Compensation Insurance", sublabel: "Mandatory for all registered providers", icon: <WorkerIcon color="#3E4947" />, section: "mandatory" },
    { key: "incidentManagementPolicy", label: "Incident Management Policy", sublabel: "Mandatory for all registered providers", icon: <PolicyIcon />, section: "mandatory" },
    { key: "complianceManagementPolicy", label: "Compliance Management Policy", sublabel: "Mandatory for all registered providers", section: "mandatory" },
    { key: "privatePolicy", label: "Private Policy", sublabel: "Mandatory for all registered providers", section: "mandatory" },
    { key: "whsPolicy", label: "WHS Policy", sublabel: "Mandatory for all registered providers", section: "mandatory" },
    { key: "annualComplianceDeclaration", label: "Annual Compliance Declaration", sublabel: "Mandatory for all registered providers", section: "recommended" },
    { key: "riskManagementPolicy", label: "Risk Management Policy", sublabel: "Latest audit documents", section: "recommended" },
    { key: "infectionControlPolicy", label: "Infection Control Policy", sublabel: "Mandatory for all registered providers", section: "recommended" },
    { key: "restrictivePractisePolicy", label: "Restrictive Practise Policy", sublabel: "Mandatory for all registered providers", section: "recommended" },
];

// Left sidebar step list for ClientFormPage
export const FORM_STEPS = [
    { id: "info", label: "Personal Infomation" },
    { id: "business", label: "NDIS Business" },
    { id: "document", label: "Document Registration" },
] as const;