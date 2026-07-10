import { Box, Typography, Button, Grid } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import dayjs, { type Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";

import { DateField, InputTextField, ToggleGroup } from "../../../components";
import { UploadVariant1 } from "../../../components/newFileUpload/FileUpload";
import { ClientStyles } from "../styles";
import { GENDER_OPTIONS } from "../utils/constants";
import { useClientStore } from "../../../store/useClient";
import { useUploadStore } from "../../../store/useUpload";
import { getViewFunction } from "../../../utils/viewfunction";

interface PersonalProps {
    isView?: boolean;
    handleNext?: () => void;
}

/**
 * Fully store-driven now: values come from useClientStore, edits go through
 * setPersonalField, and `isView` disables every field. Create / Edit / View
 * all reuse this exact component - the store already has the right data
 * loaded for whichever mode ClientFormPage booted into.
 *
 * `dob` is stored as a plain string in form state so the state stays
 * serializable/JSON-friendly. DateField works in `Dayjs` objects though, so
 * we convert on the way in and out.
 */
const PersonalInformation = ({ isView, handleNext }: PersonalProps) => {
    const navigate = useNavigate();

    const personalData = useClientStore((s) => s.personalData);
    const setPersonalField = useClientStore((s) => s.setPersonalField);
    const errors = useClientStore((s) => s.errors.personal);
    const goToNextStep = useClientStore((s) => s.goToNextStep);
    const uploadDocument = useUploadStore((s) => s.uploadDocument);
    const idProofUploadError = useUploadStore((s) => s.uploadErrors.idProofFile);

    const onNext = () => {
        if (isView) {
            handleNext?.();
            return;
        }
        // Validation lives in the store - only moves to the next step when it passes.
        const valid = goToNextStep("info");
        if (valid) handleNext?.();
    };

    const handleUpload = async (file: any) => {
        const files = file?.file
        if (!files) {
            setPersonalField("idProofFile", null);
            return;
        }
        // Actually uploads to /api/uploads/, stamps documentType
        // = "ID Proof" on the response, then saves it into the store.
        const uploaded = await uploadDocument(files, "ID Proof", "idProofFile");
        if (uploaded) setPersonalField("idProofFile", {
            ...file,
            url: uploaded?.url,
        });
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ textAlign: "left", flexShrink: 0, mb: 1 }}>
                <Typography sx={ClientStyles.title}>Personal Information</Typography>
                <Typography sx={ClientStyles.subtitle}>
                    Just the basics - take about 30 seconds to set up a secure identity
                </Typography>
            </Box>

            <Box sx={ClientStyles.scrollArea}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: isView ? 3 : 6 }}>
                        {isView ? getViewFunction('First Name', personalData.firstName, 'plain') :
                            <InputTextField
                                label="First Name"
                                value={personalData.firstName}
                                placeholder="e.g. Jane Cooper"
                                isView={isView}
                                error={!!errors.firstName}
                                errors={errors.firstName}
                                required
                                onChange={(e) => setPersonalField("firstName", e)}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, md: isView ? 3 : 6 }} sx={ClientStyles.dateFieldGrid}>
                        {isView ? getViewFunction('Date of Birth', dayjs(personalData.dob).format('YYYY-MM-DD'), 'plain') : <DateField
                            label="Date of Birth"
                            value={personalData.dob ? dayjs(personalData.dob) : null}
                            isView={isView}
                            disableFuture
                            minDate={dayjs("1900-01-01")}
                            maxDate={dayjs(new Date())}
                            referenceDate={dayjs("1900-01-01")}
                            openToYear="year"
                            required
                            error={errors.dob}
                            onChange={(value: Dayjs | null) =>
                                setPersonalField("dob", value ? value.format("MM/DD/YYYY") : null)
                            }
                        />}
                    </Grid>

                    <Grid size={{ xs: 12, md: isView ? 3 : 6 }}>
                        {isView ? getViewFunction('Mobile Number', personalData?.mobile, 'plain') :
                            <InputTextField
                                label="Mobile Number"
                                placeholder="+61 400 000 000"
                                value={personalData?.mobile}
                                isView={isView}
                                required
                                error={!!errors.mobile}
                                errors={errors.mobile}
                                onChange={(e) => setPersonalField("mobile", e)}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, md: isView ? 3 : 6 }}>
                        {isView ? getViewFunction('Email Address', personalData?.email, 'plain') :
                            <InputTextField
                                label="Email Address"
                                value={personalData?.email}
                                placeholder="jane@gmail.com"
                                isView={isView}
                                required
                                error={!!errors.email}
                                errors={errors.email}
                                onChange={(e) => setPersonalField("email", e)}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <ToggleGroup
                            label="Gender"
                            value={personalData.gender}
                            options={GENDER_OPTIONS}
                            disabled={isView}
                            errors={errors.gender}
                            onChange={(value: string) => setPersonalField("gender", value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <UploadVariant1
                            label="Upload ID Proof"
                            value={personalData.idProofFile}
                            disabled={isView}
                            onChange={(file) => handleUpload(file)}
                            errors={errors.idProofFile || idProofUploadError}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box
                sx={{
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #E2E8F0",
                    pt: 2,
                    mt: 1,
                    bgcolor: "#fff",
                }}
            >
                <Button
                    sx={{ ...ClientStyles.nextCta, bgcolor: "transparent !important", color: "#222124", fontWeight: 500, border: "1px solid #E2E8F0" }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <Button sx={ClientStyles.nextCta} endIcon={<ArrowForwardOutlined sx={{ fontSize: "12px" }} />} onClick={onNext}>
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default PersonalInformation;