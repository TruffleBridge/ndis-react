import { Box, Grid, Button } from "@mui/material";

import { DateField, InputTextField, SectionCard, UploadVariant2, UploadVariant3 } from "../../../components";

import { ArrowForwardOutlined } from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";

import { WorkerStyles } from "../styles";
import { ClientStyles } from "../../clients/styles";
import dayjs from "dayjs";
import { useWorkerStore } from "@/store/useWorker";
import type { ComplianceInfo } from "@/types/worker";
import { useUploadStore } from "@/store/useUpload";
import { getViewFunction } from "@/utils/viewfunction";
import { usePermission } from "@/hooks/usePermission";

interface ComplianceProps {
    isView?: boolean;
    handlePrev?: () => void;
    handleSubmit?: () => void;
    mode?: boolean
}

const Compliance = ({ isView, handlePrev, handleSubmit, mode }: ComplianceProps) => {
    const data = useWorkerStore((s) => s.complianceInfo);
    const setField = useWorkerStore((s) => s.setComplianceField);
    const errors = useWorkerStore((s) => s.errors.compliance);
    const goToNextStep = useWorkerStore((s) => s.goToNextStep);
    const isSubmitting = useWorkerStore((s) => s.isSubmitting);
    const uploadDocument = useUploadStore((s) => s.uploadDocument);
    const uploadErrors = useUploadStore((s) => s.uploadErrors)

    const { canCreate, canUpdate } = usePermission('Workers');


    // One handler shared by every UploadVariant2/3 field below.
    const handleUpload = async (field: keyof ComplianceInfo, file: any) => {
        const files = file?.file
        if (!files) {
            setField(field, null);
            return;
        }
        const uploaded = await uploadDocument(files, file?.documentType ?? '', field);
        if (uploaded) setField(field, {
            ...file,
            url: uploaded?.url,
            uploadedAt: uploaded?.uploadedAt
        });
    }


    const onSubmit = async () => {
        if (isView) {
            handleSubmit?.();
            return;
        }
        // Compliance is the last step - validate before firing the real submit.
        const valid = goToNextStep("compliance");
        if (valid) handleSubmit?.();
    };

    return (
        <Box sx={WorkerStyles.mainHeightRes}>
            <Box sx={WorkerStyles.subHeightRes}>
                <SectionCard title="Verifications">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <UploadVariant2
                                label="NDIS Certificate of Registration"
                                sublabel="Mandatory for all registered providers"
                                value={data.ndisCertificate}
                                disabled={isView}
                                errors={errors?.ndisCertificate || uploadErrors?.ndisCertificate}
                                onChange={(file) => handleUpload("ndisCertificate", file ? { ...file, documentType: "NDIS Certificate of Registration" } : null)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant2
                                icon={<RuleOutlinedIcon sx={ClientStyles.svgSx} />}
                                label="Screening Check Upload"
                                sublabel="Latest audit documents"
                                value={data.screeningCheck}
                                disabled={isView}
                                errors={errors?.screeningCheck || uploadErrors?.screeningCheck}
                                onChange={(file) => handleUpload("screeningCheck", file ? { ...file, documentType: "Screening Check Upload" } : null)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant2
                                label="Orientation Certificate Upload"
                                sublabel="Mandatory for all registered providers"
                                value={data.orientationCertificate}
                                disabled={isView}
                                // loading={uploadingKeys.orientationCertificate}
                                errors={errors?.orientationCertificate || uploadErrors?.orientationCertificate}
                                onChange={(file) => handleUpload("orientationCertificate", file ? { ...file, documentType: "Orientation Certificate Upload" } : null)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant2
                                label="Rights To Work"
                                sublabel="Mandatory for all registered providers"
                                value={data.rightToWork}
                                disabled={isView}
                                errors={errors?.rightToWork || uploadErrors?.rightToWork}
                                onChange={(file) => handleUpload("rightToWork", file ? { ...file, documentType: "Rights To Work" } : null)}
                            />
                        </Grid>
                    </Grid>
                </SectionCard>

                <SectionCard title="Identity & Legal">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            {isView ? getViewFunction('Driving License Number', data.drivingLicenseNumber, 'plain') :
                                <InputTextField
                                    label="Driving License Number"
                                    value={data.drivingLicenseNumber}
                                    placeholder="Enter driving license"
                                    onChange={(value) => setField("drivingLicenseNumber", value)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            {isView ? getViewFunction('Driving License Expiry', data.drivingLicenseExpiry ? dayjs(data.drivingLicenseExpiry).format("YYYY-MM-DD") : '-', 'plain') :
                                <DateField
                                    label="Driving License Expiry"
                                    disablePast
                                    value={data.drivingLicenseExpiry ? dayjs(data.drivingLicenseExpiry) : null}
                                    onChange={(value) =>
                                        setField("drivingLicenseExpiry", value ? value.format("YYYY-MM-DD") : null)
                                    }
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <UploadVariant3
                                label="Frontside Upload"
                                value={data.drivingFront}
                                disabled={isView}
                                // loading={uploadingKeys.drivingFront}
                                onChange={(file) => handleUpload("drivingFront", file)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <UploadVariant3
                                label="Backside Upload"
                                value={data.drivingBack}
                                disabled={isView}
                                // loading={uploadingKeys.drivingBack}
                                onChange={(file) => handleUpload("drivingBack", file)}
                            />
                        </Grid>
                    </Grid>
                </SectionCard>

                <SectionCard title="Police Verification">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            {isView ? getViewFunction("National Police Check Number", data.policeNumber, 'plain') :
                                <InputTextField
                                    label="National Police Check Number"
                                    value={data.policeNumber}
                                    placeholder="Enter national police"
                                    onChange={(value) => setField("policeNumber", value)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            {isView ? getViewFunction('Issue Date', data.policeIssueDate ? dayjs(data.policeIssueDate).format("YYYY-MM-DD") : '-', 'plain') :
                                <DateField
                                    label="Issue Date"
                                    minDate={dayjs().startOf("year")}
                                    value={data.policeIssueDate ? dayjs(data.policeIssueDate) : null}
                                    onChange={(value) => setField("policeIssueDate", value ? value.format("YYYY-MM-DD") : null)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            {isView ? getViewFunction('Expiry Date', data.policeExpiryDate ? dayjs(data.policeExpiryDate).format("YYYY-MM-DD") : '-', 'plain') :
                                <DateField
                                    label="Expiry Date"
                                    minDate={
                                        data.policeIssueDate
                                            ? dayjs(data.policeIssueDate)
                                            : undefined
                                    }
                                    value={data.policeExpiryDate ? dayjs(data.policeExpiryDate) : null}
                                    onChange={(value) => setField("policeExpiryDate", value ? value.format("YYYY-MM-DD") : null)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant3
                                label="Upload Certificate"
                                value={data.policeCertificate}
                                disabled={isView}
                                // loading={uploadingKeys.policeCertificate}
                                onChange={(file) => handleUpload("policeCertificate", file)}
                            />
                        </Grid>
                    </Grid>
                </SectionCard>

                <SectionCard title="Working with Children">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            {isView ? getViewFunction('Blue Card Number', data.blueCardNumber, 'plain') :
                                <InputTextField
                                    label="Blue Card Number"
                                    value={data.blueCardNumber}
                                    placeholder="Enter blue card number"
                                    onChange={(value) => setField("blueCardNumber", value)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            {isView ? getViewFunction('Expiry Date', data.blueCardExpiry ? dayjs(data.blueCardExpiry).format("YYYY-MM-DD") : '-', 'plain') :
                                <DateField
                                    label="Expiry Date"
                                    disablePast
                                    value={data.blueCardExpiry ? dayjs(data.blueCardExpiry) : null}
                                    onChange={(value) => setField("blueCardExpiry", value ? value.format("YYYY-MM-DD") : null)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant3
                                label="Upload Certificate"
                                value={data.blueCardCertificate}
                                disabled={isView}
                                // loading={uploadingKeys.blueCardCertificate}
                                onChange={(file) => handleUpload("blueCardCertificate", file)}
                            />
                        </Grid>
                    </Grid>
                </SectionCard>

                <SectionCard title="First Aid">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            {isView ? getViewFunction('Certificate Number', data.firstAidCertificateNumber, 'plain') :
                                <InputTextField
                                    label="Certificate Number"
                                    placeholder="Enter certificate number"
                                    value={data.firstAidCertificateNumber}
                                    onChange={(value) => setField("firstAidCertificateNumber", value)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            {isView ? getViewFunction('Expiry Date', data.firstAidExpiry ? dayjs(data.firstAidExpiry).format("YYYY-MM-DD") : '-', 'plain') :
                                <DateField
                                    label="Expiry Date"
                                    disablePast
                                    value={data.firstAidExpiry ? dayjs(data.firstAidExpiry) : null}
                                    onChange={(value) => setField("firstAidExpiry", value ? value.format("YYYY-MM-DD") : null)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant3
                                label="Upload Certificate"
                                value={data.firstAidCertificate}
                                disabled={isView}
                                // loading={uploadingKeys.firstAidCertificate}
                                onChange={(file) => handleUpload("firstAidCertificate", file)}
                            />
                        </Grid>
                    </Grid>
                </SectionCard>

                <SectionCard title="CPR">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            {isView ? getViewFunction('Certificate Number', data.cprCertificateNumber, 'plain') :
                                <InputTextField
                                    label="Certificate Number"
                                    placeholder="Enter certificate number"
                                    value={data.cprCertificateNumber}
                                    onChange={(value) => setField("cprCertificateNumber", value)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            {isView ? getViewFunction('Expiry Date', data.cprExpiry ? dayjs(data.cprExpiry).format("YYYY-MM-DD") : '-', 'plain') :
                                <DateField
                                    disablePast
                                    label="Expiry Date"
                                    value={data.cprExpiry ? dayjs(data.cprExpiry) : null}
                                    onChange={(value) => setField("cprExpiry", value ? value.format("YYYY-MM-DD") : null)}
                                />}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant3
                                label="Upload Certificate"
                                value={data.cprCertificate}
                                disabled={isView}
                                // loading={uploadingKeys.cprCertificate}
                                onChange={(file) => handleUpload("cprCertificate", file)}
                            />
                        </Grid>
                    </Grid>
                </SectionCard>
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

                {((canCreate || (mode && canUpdate)) || isView) && <Button
                    sx={WorkerStyles.nextCta}
                    endIcon={!isView && <ArrowForwardOutlined sx={{ fontSize: 12 }} />}
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    {isView ? "Close" : mode ? "Update" : isSubmitting ? "Submitting..." : "Submit"}
                </Button>}
            </Box>
        </Box>
    );
};

export default Compliance;