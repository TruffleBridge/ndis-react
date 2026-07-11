import { Box, Grid, Button } from "@mui/material";

import { AutocompleteField, DateField, InputTextField, SectionCard, UploadVariant1 } from "../../../components";

import { ArrowForwardOutlined } from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { WorkerStyles } from "../styles";
import dayjs from "dayjs";
import { useWorkerStore } from "../../../store/useWorker";
import type { Option } from "../../../types/worker";
import { useUploadStore } from "../../../store/useUpload";

interface QualificationProps {
    isView?: boolean;
    handlePrev?: () => void;
    handleNext?: () => void;
}

const Qualification = ({ isView, handlePrev, handleNext }: QualificationProps) => {
    const data = useWorkerStore((s) => s.qualificationInfo);
    const setField = useWorkerStore((s) => s.setQualificationField);
    const errors = useWorkerStore((s) => s.errors.qualification);
    const goToNextStep = useWorkerStore((s) => s.goToNextStep);
    const uploadDocument = useUploadStore((s) => s.uploadDocument);
    const certificateUploadError = useUploadStore((s) => s.uploadErrors.certificate);
    // const isUploadingCertificate = useWorkerStore((s) => s.uploadingKeys.certificate);

    const onNext = () => {
        if (isView) {
            handleNext?.();
            return;
        }
        const valid = goToNextStep("qual");
        if (valid) handleNext?.();
    };


    const handleUpload = async (file: any) => {
        const files = file?.file
        if (!files) {
            setField("certificate", null);
            return;
        }
        // Actually uploads to /api/uploads/, stamps documentType
        // = "ID Proof" on the response, then saves it into the store.
        const uploaded = await uploadDocument(files, "Upload Certificate", "certificate");
        if (uploaded) setField("certificate", {
            ...file,
            url: uploaded?.url,
        });
    }

    return (
        <Box sx={WorkerStyles.mainHeightRes}>
            <Box sx={WorkerStyles.subHeightRes}>
                <SectionCard title="Education">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <AutocompleteField
                                label="Qualification Type"
                                value={data.qualificationType}
                                options={[]}
                                placeholder="Select"
                                readOnly={isView}
                                isView={isView}
                                error={errors.qualificationType}
                                onChange={(value) => setField("qualificationType", value as Option)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <InputTextField
                                label="Degree Name"
                                placeholder="Enter degree name"
                                value={data.degreeName}
                                isView={isView}
                                onChange={(value) => setField("degreeName", value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <InputTextField
                                label="Institution"
                                placeholder="Enter institution"
                                value={data.institution}
                                isView={isView}
                                onChange={(value) => setField("institution", value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <InputTextField
                                label="Years Completed"
                                placeholder="Enter years"
                                value={data.yearsCompleted}
                                isView={isView}
                                onChange={(value) => setField("yearsCompleted", value)}
                            />
                        </Grid>
                    </Grid>
                </SectionCard>

                <SectionCard title="Certifications">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputTextField
                                label="Certification Name"
                                placeholder="Enter certification name"
                                value={data.certificationName}
                                isView={isView}
                                onChange={(value) => setField("certificationName", value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputTextField
                                label="Certification Number"
                                placeholder="Enter certification number"
                                value={data.certificationNumber}
                                isView={isView}
                                onChange={(value) => setField("certificationNumber", value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <DateField
                                label="Certification Expiry"
                                value={data.certificationExpiry ? dayjs(data.certificationExpiry) : null}
                                onChange={(value) =>
                                    setField("certificationExpiry", value ? value.format("YYYY-MM-DD") : null)
                                }
                            />
                        </Grid>
                    </Grid>
                </SectionCard>

                <Grid size={{ xs: 12 }}>
                    <UploadVariant1
                        label="Upload Certificate"
                        value={data.certificate}
                        // loading={isUploadingCertificate}
                        disabled={isView}
                        onChange={(file) => handleUpload(file)}
                        errors={certificateUploadError || certificateUploadError}
                    />
                </Grid>
            </Box>

            <Box sx={WorkerStyles.bottomFixed}>
                <Button
                    sx={{
                        ...WorkerStyles.nextCta,
                        bgcolor: "transparent !important",
                        color: "#222124",
                        fontWeight: 500,
                        border: "1px solid #E2E8F0",
                    }}
                    startIcon={<ArrowBackOutlinedIcon sx={{ width: 18, height: 18, color: "#222124" }} />}
                    onClick={handlePrev}
                >
                    Prev
                </Button>

                <Button sx={WorkerStyles.nextCta} endIcon={<ArrowForwardOutlined sx={{ fontSize: 12 }} />} onClick={onNext}>
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default Qualification;