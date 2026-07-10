import { useEffect } from "react";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowForwardIosOutlined } from "@mui/icons-material";

import PersonalInformation from "./steps/personal";
import BusinessStep from "./steps/business";
import DocumentRegisterStep from "./steps/documentRegister";
import { ClientIcon } from "../../assets";
import { CustomModal, Loading, PageHeader } from "../../components";
import { ClientStyles } from "./styles";
import { FORM_STEPS, progressValue } from "./utils/constants";
import { useClientStore } from "../../store/useClient";
import type { ClientFormNavState, FormMode, StepId } from "../../types/client";

const ClientFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // The table passes { mode, clientId } via navigate(path, { state }).
    // Falling back to "create" with no id covers direct navigation to this page.
    const navState = (location.state as ClientFormNavState | null) ?? { mode: "create" as FormMode };
    const { mode, clientId = null } = navState;

    const isView = mode === "view";

    const activeStep = useClientStore((s) => s.activeStep);
    const setActiveStep = useClientStore((s) => s.setActiveStep);
    const initForm = useClientStore((s) => s.initForm);
    const resetForm = useClientStore((s) => s.resetForm);
    const submitForm = useClientStore((s) => s.submitForm);
    const isSubmitting = useClientStore((s) => s.isSubmitting);
    const submitSuccess = useClientStore((s) => s.submitSuccess);
    const closeSubmitSuccess = useClientStore((s) => s.closeSubmitSuccess);
    const isFormLoading = useClientStore((s) => s.isFormLoading);

    // Loads the right record for edit/view (getViewApi/getEditApi under the
    // hood) or resets to blanks for create - runs once whenever mode/id changes.
    useEffect(() => {
        initForm(mode, clientId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, clientId]);

    const handleCancel = () => {
        navigate("/clients");
    };

    const handleSubmit = async () => {
        if (isView) return; // safety guard - view mode never submits
        await submitForm();
    };

    const handleModalPrimary = () => {
        resetForm();
        navigate("/");
    };

    const backCta = () => {
        closeSubmitSuccess();
        navigate("/clients");
    }

    const goToStep = (step: StepId) => setActiveStep(step);

    // Step renderer - each child form now pulls its own slice of state
    // straight from the store, so it only needs isView + the nav callback.
    const renderRightSide = () => {
        switch (activeStep) {
            case "info":
                return (
                    <PersonalInformation
                        isView={isView}
                        handleNext={() => goToStep("business")}
                    />);
            case "business":
                return (
                    <BusinessStep
                        isView={isView}
                        handleNext={() => goToStep("document")}
                        handlePrev={() => goToStep("info")}
                    />
                );
            case "document":
                return (
                    <DocumentRegisterStep
                        isView={isView}
                        isSubmitting={isSubmitting}
                        // In view mode there's nothing to persist, so the final
                        // CTA just closes the flow instead of submitting.
                        handleNext={isView ? handleCancel : handleSubmit}
                        handlePrev={() => goToStep("business")}
                    />
                );
            default:
                return null;
        }
    };

    const getHeader = () => {
        switch (activeStep) {
            case "info":
                return 'Personal Information';
            case "business":
                return 'NDIS Business';
            case "document":
                return 'Document Registration';
            default:
                return null;
        }
    }
    const getSubHeader = () => {
        switch (activeStep) {
            case "info":
                return 'Just the basics - take about 30 seconds to set up a secure identity';
            case "business":
                return 'Please provide the official registered business name as it appears on your NDIS provider registration documents';
            case "document":
                return 'Please upload the official registered documents for the NDIS provider business registration';
            default:
                return null;
        }
    }

    const pageTitle = mode === "create" ? "Add New Client" : mode === "edit" ? "Edit Client" : "View Client";

    return (
        <Box>
            {isFormLoading ?
                <Loading />
                :
                <>
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
                                            // onClick={() => goToStep(step.id)}
                                            sx={{
                                                p: 1.3,
                                                mt: "0 !important",
                                                cursor: "pointer",
                                                bgcolor: isActive ? "#F2FCFA" : "transparent",
                                                borderLeft: isActive ? "4px solid" : "4px solid",
                                                borderColor: isActive ? "primary.main" : "transparent",
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
                        <Box sx={ClientStyles.rightSideMain}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '10px',
                            }}>
                                <PageHeader mainSx={{ boxShadow: 'none', border: 'none', p: 0 }}
                                    title={getHeader && getHeader()}
                                    subtitle={getSubHeader && getSubHeader()} />

                                <CircularProgress
                                    size={42}
                                    thickness={4}
                                    value={progressValue(activeStep)}
                                    variant="determinate"
                                    enableTrackSlot
                                    sx={{
                                        color: "primary.main",
                                    }}
                                />
                            </div>
                            <Box sx={ClientStyles.rightSide}>
                                {renderRightSide()}
                            </Box>
                        </Box>
                    </Box>
                </>}
            <CustomModal
                open={submitSuccess}
                onClose={closeSubmitSuccess}
                type="success"
                title={mode === "edit" ? "Client Successfully Updated!" : "Client Successfully Created!"}
                description="Welcome to Nimora. Your profile is ready, and you can now start finding the right support workers for your needs."
                backText="Back"
                primaryText="Go to Dashboard"
                onBack={backCta}
                onPrimary={handleModalPrimary}
            />
        </Box>
    );
};

export default ClientFormPage;