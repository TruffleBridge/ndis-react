import { useState } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowForwardIosOutlined } from "@mui/icons-material";

import PersonalInformation from "./steps/personal";
import BusinessStep from "./steps/business";
import DocumentRegisterStep from "./steps/documentRegister";
import type { UploadedFile } from "../../components/newFileUpload/FileUpload";
import { ClientIcon } from "../../assets";
import { CustomModal, PageHeader } from "../../components";
import { ClientStyles } from "./styles";
import { FORM_STEPS } from "./utils/constants";
import {
    buildSubmitPayload,
    getClientRecordById,
    getDefaultBusinessData,
    getDefaultDocumentData,
    getDefaultPersonalData,
    submitClientPayload,
} from "./utils/clientformutils";
import type {
    BusinessFormData,
    ClientFormNavState,
    DocumentFormData,
    FormMode,
    PersonalFormData,
} from "./utils/types";


const ClientFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // The table passes { mode, clientId } via navigate(path, { state }).
    // Falling back to "create" with no id covers direct navigation to this
    
    const navState = (location.state as ClientFormNavState | null) ?? { mode: "create" as FormMode };
    const { mode, clientId = null } = navState;

    const isView = mode === "view";

    // Step + form state. Lazy useState initializers ensure the correct
    // data (mock record for edit/view, blank defaults for create) loads
    // exactly once on mount - no useEffect and no flash-of-empty-form.
    const [activeStep, setActiveStep] = useState<string>("info");

    const [personalData, setPersonalData] = useState<PersonalFormData>(() =>
        clientId != null ? getClientRecordById(clientId).personal : getDefaultPersonalData()
    );
    const [businessData, setBusinessData] = useState<BusinessFormData>(() =>
        clientId != null ? getClientRecordById(clientId).business : getDefaultBusinessData()
    );
    const [documentData, setDocumentData] = useState<DocumentFormData>(() =>
        clientId != null ? getClientRecordById(clientId).documents : getDefaultDocumentData()
    );

    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generic field-level change handlers, one per child form. Each just
    // "controlled form" pattern that lets the child components stay dumb
    // and identical across create, edit and view.
    const handlePersonalChange = <K extends keyof PersonalFormData>(field: K, value: PersonalFormData[K]) => {
        setPersonalData((prev) => ({ ...prev, [field]: value }));
    };

    const handleBusinessChange = <K extends keyof BusinessFormData>(field: K, value: BusinessFormData[K]) => {
        setBusinessData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDocumentChange = (key: string, file: UploadedFile | null) => {
        setDocumentData((prev) => ({ ...prev, [key]: file }));
    };

    // Reset - returns the whole module to its initial state. Called after
    // a successful Submit and on Cancel, per the requirements.
    const resetForm = () => {
        setActiveStep("info");
        setPersonalData(getDefaultPersonalData());
        setBusinessData(getDefaultBusinessData());
        setDocumentData(getDefaultDocumentData());
    };

    const handleCancel = () => {
        resetForm();
        navigate("/clients");
    };

    const handleSubmit = async () => {
        if (isView) return; // safety guard - view mode never submits

        setIsSubmitting(true);
        // This is the one place the 3 child forms' state gets combined into
        // a single payload, exactly as required.
        const payload = buildSubmitPayload(mode, clientId, personalData, businessData, documentData);
        await submitClientPayload(payload);
        setIsSubmitting(false);
        setSubmitModalOpen(true);
    };

    const handleModalPrimary = () => {
        setSubmitModalOpen(false);
        resetForm();
        navigate("/");
    };

    // Step renderer - each child form is fully controlled: it receives
    // its slice of state + change handler + isView, nothing else.
    const renderRightSide = () => {
        switch (activeStep) {
            case "info":
                return (
                    <PersonalInformation
                        data={personalData}
                        onChange={handlePersonalChange}
                        isView={isView}
                        handleNext={() => setActiveStep("business")}
                    />
                );
            case "business":
                return (
                    <BusinessStep
                        data={businessData}
                        onChange={handleBusinessChange}
                        isView={isView}
                        handleNext={() => setActiveStep("document")}
                        handlePrev={() => setActiveStep("info")}
                    />
                );
            case "document":
                return (
                    <DocumentRegisterStep
                        data={documentData}
                        onChange={handleDocumentChange}
                        isView={isView}
                        isSubmitting={isSubmitting}
                        // In view mode there's nothing to persist, so the final
                        // CTA just closes the flow instead of submitting.
                        handleNext={isView ? handleCancel : handleSubmit}
                        handlePrev={() => setActiveStep("business")}
                    />
                );
            default:
                return null;
        }
    };

    const pageTitle = mode === "create" ? "Add New Client" : mode === "edit" ? "Edit Client" : "View Client";

    return (
        <Box>
            <PageHeader icon={<ClientIcon color="#3A3838" />} title={pageTitle} subtitle="Create Role" />
            <Box sx={ClientStyles.formLayout}>
                {/* LEFT SIDEBAR */}
                <Paper elevation={0} sx={ClientStyles.sideMenu}>
                    <Stack spacing={1}>
                        {FORM_STEPS.map((step) => {
                            const isActive = activeStep === step.id;
                            return (
                                <Box
                                    key={step.id}
                                    onClick={() => setActiveStep(step.id)}
                                    sx={{
                                        p: 1.3,
                                        mt: "0 !important",
                                        cursor: "pointer",
                                        bgcolor: isActive ? "#F2FCFA" : "transparent",
                                        borderLeft: isActive ? "4px solid primary.main" : "4px solid transparent",
                                        transition: "0.2s",
                                        display: "flex",
                                        gap: 1,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        "&:hover": { bgcolor: "#f5f5f5" },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: isActive ? 600 : 500,
                                            fontSize: 13,
                                            color: isActive ? "#1E293B" : "#64748B",
                                        }}
                                    >
                                        {step.label}
                                    </Typography>
                                    <ArrowForwardIosOutlined sx={{ fontSize: 18, color: "#94A3B8" }} />
                                </Box>
                            );
                        })}
                    </Stack>
                </Paper>

                {/* RIGHT SIDE */}
                <Box sx={ClientStyles.rightSide}>{renderRightSide()}</Box>
            </Box>

            <CustomModal
                open={submitModalOpen}
                onClose={() => setSubmitModalOpen(false)}
                type="success"
                title="Client Successfully Created!"
                description="Welcome to Nimora. Your profile is ready, and you can now start finding the right support workers for your needs."
                backText="Back"
                primaryText="Go to Dashboard"
                onBack={() => setSubmitModalOpen(false)}
                onPrimary={handleModalPrimary}
            />
        </Box>
    );
};

export default ClientFormPage;