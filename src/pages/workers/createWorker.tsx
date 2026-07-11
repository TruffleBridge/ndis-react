import { useEffect, useState } from "react";
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

import {
    defaultPersonalInfo,
    defaultSupportInfo,
    defaultQualificationInfo,
    defaultComplianceInfo,
} from "./utils/defaultData";

import { workerDummy } from "./utils/dummyData";
import { progressValue } from "../../utils/helper";
import { getHeader, getSubHeader } from "./utils/constants";

const steps = [
    { id: "basic", label: "Basic Info" },
    { id: "support", label: "Support Services" },
    { id: "qual", label: "Qualifications & Credentials" },
    { id: "compliance", label: "Compliance & Verification" },
];

const WorkerPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState("basic");

    const [mode, setMode] = useState<"create" | "edit" | "view">("create");
    const [isView, setIsView] = useState(false);

    const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);

    const [supportInfo, setSupportInfo] = useState(defaultSupportInfo);

    const [qualificationInfo, setQualificationInfo] = useState(
        defaultQualificationInfo
    );

    const [complianceInfo, setComplianceInfo] = useState(
        defaultComplianceInfo
    );

    useEffect(() => {
        const currentMode =
            location.state?.mode || "create";

        setMode(currentMode);

        if (currentMode === "create") {
            resetForm();
            return;
        }

        setPersonalInfo(workerDummy.personalInfo);
        setSupportInfo(workerDummy.supportInfo);
        setQualificationInfo(workerDummy.qualificationInfo);
        setComplianceInfo(workerDummy.complianceInfo);

        if (currentMode === "view") {
            setIsView(true);
        } else {
            setIsView(false);
        }
    }, []);

    const resetForm = () => {
        setPersonalInfo(defaultPersonalInfo);
        setSupportInfo(defaultSupportInfo);
        setQualificationInfo(defaultQualificationInfo);
        setComplianceInfo(defaultComplianceInfo);

        setActiveStep("basic");
        setIsView(false);
    };

    const handleSubmit = () => {
        const payload = {
            personalInfo,
            supportInfo,
            qualificationInfo,
            complianceInfo,
        };

        console.log("Payload", payload);
        setOpen(true);
        resetForm();

        // navigate("/workers");
    };

    //   const handleCancel = () => {
    //     resetForm();

    //     navigate("/workers");
    //   };

    const renderRightSide = () => {
        switch (activeStep) {
            case "basic":
                return (
                    <PersonalInformation
                        data={personalInfo}
                        setData={setPersonalInfo}
                        isView={isView}
                        handleNext={() => setActiveStep("support")}
                    />
                );

            case "support":
                return (
                    <SupportServices
                        data={supportInfo}
                        setData={setSupportInfo}
                        isView={isView}
                        handlePrev={() => setActiveStep("basic")}
                        handleNext={() => setActiveStep("qual")}
                    />
                );

            case "qual":
                return (
                    <Qualification
                        data={qualificationInfo}
                        setData={setQualificationInfo}
                        isView={isView}
                        handlePrev={() => setActiveStep("support")}
                        handleNext={() => setActiveStep("compliance")}
                    />
                );

            case "compliance":
                return (
                    <Compliance
                        data={complianceInfo}
                        setData={setComplianceInfo}
                        isView={isView}
                        handlePrev={() => setActiveStep("qual")}
                        handleSubmit={handleSubmit}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ height: '100%' }}>
            <PageHeader
                icon={<WorkerIcon color="#3A3838" />}
                title={
                    mode === "create"
                        ? "Add New Worker"
                        : mode === "edit"
                            ? "Edit Worker"
                            : "View Worker"
                }
                subtitle="Create Role"
            />
            <Box sx={WorkerStyles.formLayout}>

                {/* LEFT SIDEBAR */}
                <Paper
                    elevation={0}
                    sx={WorkerStyles.sideMenu}
                >

                    <Stack spacing={1}>
                        {steps.map((step) => {
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
                                        borderLeft: isActive ? "4px solid" : "4px solid transparent",
                                        borderLeftColor: isActive ? "primary.main" : "transparent",
                                        transition: "0.2s",
                                        display: 'flex',
                                        gap: 1,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        "&:hover": {
                                            bgcolor: "#f5f5f5",
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: isActive ? 600 : 500,
                                            fontSize: 13,
                                            color: isActive ? "#1E293B" : "#64748B",
                                            textAlign: isActive ? "left" : 'start',
                                        }}
                                    >
                                        {step.label}
                                    </Typography>
                                    <ArrowForwardIosOutlined sx={{ fontSize: 18, color: '#94A3B8' }} />
                                </Box>
                            );
                        })}
                    </Stack>
                </Paper>

                {/* RIGHT SIDE */}
                <Box sx={WorkerStyles.rightSideMain}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                    }}>
                        <PageHeader mainSx={{ boxShadow: 'none', border: 'none', p: 0 }}
                            title={getHeader && getHeader(activeStep)}
                            subtitle={getSubHeader && getSubHeader(activeStep)} />

                        <CircularProgressWithLabel
                            value={progressValue(activeStep)}
                        />
                    </div>
                    <Box sx={WorkerStyles.rightSide}>
                        {renderRightSide()}
                    </Box>
                </Box>
            </Box>


            <CustomModal
                open={open}
                onClose={() => setOpen(false)}
                type="success"
                title="Worker Created Successfully"
                description="Welcome to Nimora. Your profile is ready, and you can now start finding the right support workers for your needs."
                backText="Back"
                primaryText="Dashboard"
                onBack={() => setOpen(false)}
                onPrimary={() => navigate("/")}
            />
        </Box>
    );
};

export default WorkerPage;