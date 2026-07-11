import { useEffect } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowForwardIosOutlined } from "@mui/icons-material";

import PersonalInformation from "./steps/basicInfo";
import SupportServices from "./steps/support";
import Qualification from "./steps/qualification";
import Compliance from "./steps/complicance";

import { WorkerIcon } from "../../assets";
import { CircularProgressWithLabel, CustomModal, PageHeader } from "../../components";
import { WorkerStyles } from "./styles";
import { progressValue } from "../../utils/helper";
import { getHeader, getSubHeader } from "./utils/constants";
import { useWorkerStore } from "../../store/useWorker";
import type { StepId, WorkerFormNavState, FormMode } from "../../types/worker";

const steps = [
    { id: "basic", label: "Basic Info" },
    { id: "support", label: "Support Services" },
    { id: "qual", label: "Qualifications & Credentials" },
    { id: "compliance", label: "Compliance & Verification" },
];

const WorkerPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navState = (location.state as WorkerFormNavState | null) ?? { mode: "create" as FormMode };
    const { mode, workerId = null } = navState;
    const isView = mode === "view";

    const activeStep = useWorkerStore((s) => s.activeStep);
    const setActiveStep = useWorkerStore((s) => s.setActiveStep);
    const initForm = useWorkerStore((s) => s.initForm);
    const resetForm = useWorkerStore((s) => s.resetForm);
    const submitForm = useWorkerStore((s) => s.submitForm);
    const submitSuccess = useWorkerStore((s) => s.submitSuccess);
    const closeSubmitSuccess = useWorkerStore((s) => s.closeSubmitSuccess);

    // Loads the right record for edit/view (getProfile) or resets to blanks
    // for create - runs once whenever mode/id changes.
    useEffect(() => {
        initForm(mode, workerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, workerId]);

    const goToStep = (step: StepId) => setActiveStep(step);

    const handleSubmit = async () => {
        if (isView) {
            navigate("/workers");
            return;
        }
        await submitForm();
    };

    const handleModalPrimary = () => {
        closeSubmitSuccess();
        resetForm();
        navigate("/");
    };

    const renderRightSide = () => {
        switch (activeStep) {
            case "basic":
                return <PersonalInformation isView={isView} handleNext={() => goToStep("support")} />;

            case "support":
                return (
                    <SupportServices
                        isView={isView}
                        handlePrev={() => goToStep("basic")}
                        handleNext={() => goToStep("qual")}
                    />
                );

            case "qual":
                return (
                    <Qualification
                        isView={isView}
                        handlePrev={() => goToStep("support")}
                        handleNext={() => goToStep("compliance")}
                    />
                );

            case "compliance":
                return (
                    <Compliance
                        isView={isView}
                        handlePrev={() => goToStep("qual")}
                        handleSubmit={handleSubmit}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ height: "100%" }}>
            <PageHeader
                icon={<WorkerIcon color="#3A3838" />}
                title={mode === "create" ? "Add New Worker" : mode === "edit" ? "Edit Worker" : "View Worker"}
                subtitle="Create Role"
            />
            <Box sx={WorkerStyles.formLayout}>
                {/* LEFT SIDEBAR */}
                <Paper elevation={0} sx={WorkerStyles.sideMenu}>
                    <Stack spacing={1}>
                        {steps.map((step) => {
                            const isActive = activeStep === step.id;

                            return (
                                <Box
                                    key={step.id}
                                    onClick={() => goToStep(step.id as StepId)}
                                    sx={{
                                        p: 1.3,
                                        mt: "0 !important",
                                        cursor: "pointer",
                                        bgcolor: isActive ? "#F2FCFA" : "transparent",
                                        borderLeft: isActive ? "4px solid" : "4px solid transparent",
                                        borderLeftColor: isActive ? "primary.main" : "transparent",
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
                                            textAlign: isActive ? "left" : "start",
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
                <Box sx={WorkerStyles.rightSideMain}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: "10px" }}>
                        <PageHeader
                            mainSx={{ boxShadow: "none", border: "none", p: 0 }}
                            title={getHeader && getHeader(activeStep)}
                            subtitle={getSubHeader && getSubHeader(activeStep)}
                        />

                        <CircularProgressWithLabel value={progressValue(activeStep)} />
                    </Box>
                    <Box sx={WorkerStyles.rightSide}>{renderRightSide()}</Box>
                </Box>
            </Box>

            <CustomModal
                open={submitSuccess}
                onClose={closeSubmitSuccess}
                type="success"
                title="Worker Created Successfully"
                description="Welcome to Nimora. Your profile is ready, and you can now start finding the right support workers for your needs."
                backText="Back"
                primaryText="Dashboard"
                onBack={closeSubmitSuccess}
                onPrimary={handleModalPrimary}
            />
        </Box>
    );
};

export default WorkerPage;