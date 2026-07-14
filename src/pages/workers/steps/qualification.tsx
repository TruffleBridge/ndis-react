import { Box, Grid, Button } from "@mui/material";

import { AutocompleteField, InputTextField, SectionCard, UploadVariant1 } from "@/components";

import { ArrowForwardOutlined } from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { WorkerStyles } from "../styles";
import { useWorkerStore } from "@/store/useWorker";
import type { Option } from "@/types/worker";
import { useUploadStore } from "@/store/useUpload";
import { useLookupStore } from "@/store/useMasterAPI";
import { useEffect } from "react";
import { getViewFunction } from "@/utils/viewfunction";

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

    const qualifications = useLookupStore((s) => s.qualifications);
    const queryQualifications = useLookupStore((s) => s.queryQualifications);
    const getQualificationOptions = useLookupStore((s) => s.getQualificationOptions);

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
            uploadedAt: uploaded?.uploadedAt
        });
    }

    useEffect(() => {
        if (!isView) { queryQualifications({ reset: true }); }
    }, []);

    return (
        <Box sx={WorkerStyles.mainHeightRes}>
            <Box sx={WorkerStyles.subHeightRes}>
                <SectionCard title="Education">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            {isView ? getViewFunction('Qualification Type', data?.qualificationType?.label, 'plain') :
                                <AutocompleteField
                                    label="Qualification Type"
                                    value={data.qualificationType}
                                    options={getQualificationOptions()}
                                    placeholder="Select"
                                    error={errors.qualificationType}
                                    onChange={(value) => setField("qualificationType", value as Option)}
                                    onSearch={(search) => queryQualifications({ search })}
                                    onLoadMore={() => queryQualifications()}
                                    hasMore={qualifications.hasMore}
                                    loadingMore={qualifications.loading}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            {isView ? getViewFunction('Degree Name', data?.degreeName, 'plain') :
                                <InputTextField
                                    label="Degree Name"
                                    placeholder="Enter degree name"
                                    value={data.degreeName}
                                    isView={isView}
                                    onChange={(value) => setField("degreeName", value)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            {isView ? getViewFunction('Institution', data?.institution, 'plain') :
                                <InputTextField
                                    label="Institution"
                                    placeholder="Enter institution"
                                    value={data.institution}
                                    isView={isView}
                                    onChange={(value) => setField("institution", value)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            {isView ? getViewFunction('Years Completed', data?.yearsCompleted, 'plain') :
                                <InputTextField
                                    label="Years Completed"
                                    placeholder="Enter years"
                                    value={data.yearsCompleted}
                                    isView={isView}
                                    onChange={(value) => setField("yearsCompleted", value)}
                                />}
                        </Grid>
                    </Grid>
                </SectionCard>

                <SectionCard title="Certifications">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            {isView ? getViewFunction('Certification Name', data?.certificationName, 'plain') :
                                <InputTextField
                                    label="Certification Name"
                                    placeholder="Enter certification name"
                                    value={data.certificationName}
                                    isView={isView}
                                    onChange={(value) => setField("certificationName", value)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            {isView ? getViewFunction('Certification Number', data?.certificationNumber, 'plain') :
                                <InputTextField
                                    label="Certification Number"
                                    placeholder="Enter certification number"
                                    value={data.certificationNumber}
                                    isView={isView}
                                    onChange={(value) => setField("certificationNumber", value)}
                                />}
                        </Grid>

                        {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            {isView ? getViewFunction('Certification Expiry', dayjs(data.certificationExpiry).format("YYYY-MM-DD"), 'plain') :
                                <DateField
                                    label="Certification Expiry"
                                    value={data.certificationExpiry ? dayjs(data.certificationExpiry) : null}
                                    disablePast
                                    onChange={(value) =>
                                        setField("certificationExpiry", value ? value.format("YYYY-MM-DD") : null)
                                    }
                                />}
                        </Grid> */}
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