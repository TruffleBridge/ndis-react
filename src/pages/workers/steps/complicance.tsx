import {
    Box,
    Grid,
    Button,
} from "@mui/material";

import {
    DateField,
    InputTextField,
    SectionCard,
    UploadVariant2,
    UploadVariant3,
} from "../../../components";

import {
    ArrowForwardOutlined,
} from "@mui/icons-material";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";

import { WorkerStyles } from "../styles";
import { ClientStyles } from "../../clients/styles";
import type { ComplianceInfo } from "../utils/types";
import dayjs from "dayjs";

interface ComplianceProps {
    data: ComplianceInfo;
    setData: React.Dispatch<
        React.SetStateAction<ComplianceInfo>
    >;
    isView: boolean;
    handlePrev?: () => void;
    handleSubmit?: () => void;
}

const Compliance = ({
    data,
    setData,
    isView,
    handlePrev,
    handleSubmit,
}: ComplianceProps) => {

    const updateField = (
        key: keyof ComplianceInfo,
        value: any
    ) => {
        setData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    pr: 1,
                }}
            >

                <SectionCard title="Verifications">

                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant2
                                label="NDIS Certificate of Registration"
                                sublabel="Mandatory for all registered providers"
                                value={data?.ndisCertificate && data?.ndisCertificate}
                                // isView={isView}
                                onChange={(file) =>
                                    updateField(
                                        "ndisCertificate",
                                        file
                                    )
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant2
                                icon={
                                    <RuleOutlinedIcon
                                        sx={ClientStyles.svgSx}
                                    />
                                }
                                label="Screening Check Upload"
                                sublabel="Latest audit documents"
                                value={data?.screeningCheck && data?.screeningCheck}
                                // isView={isView}
                                onChange={(file) =>
                                    updateField(
                                        "screeningCheck",
                                        file
                                    )
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant2
                                label="Orientation Certificate Upload"
                                sublabel="Mandatory for all registered providers"
                                value={data?.orientationCertificate && data?.orientationCertificate}
                                // isView={isView}
                                onChange={(file) =>
                                    updateField(
                                        "orientationCertificate",
                                        file
                                    )
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant2
                                label="Right To Work"
                                sublabel="Mandatory for all registered providers"
                                value={data?.rightToWork && data?.rightToWork}
                                // isView={isView}
                                onChange={(file) =>
                                    updateField(
                                        "rightToWork",
                                        file
                                    )
                                }
                            />
                        </Grid>

                    </Grid>

                </SectionCard>

                <SectionCard title="Identity & Legal">

                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputTextField
                                label="Driving License Number"
                                value={data.drivingLicenseNumber}
                                placeholder="Enter driving license"
                                isView={isView}
                                onChange={(value) =>
                                    updateField(
                                        "drivingLicenseNumber",
                                        value
                                    )
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <DateField
                                label="Driving License Expiry"
                                value={dayjs(data.drivingLicenseExpiry)}
                                isView={isView}
                                onChange={(value) =>
                                    updateField(
                                        "drivingLicenseExpiry",
                                        value
                                    )
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <UploadVariant3
                                label="Frontside Upload"
                                value={data.drivingFront}
                                onChange={(file) =>
                                    updateField("drivingFront", file)
                                }
                                // onRemove={() =>
                                //     updateField("drivingFront", null)
                                // }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <UploadVariant3
                                label="Backside Upload"
                                value={data.drivingBack}
                                onChange={(file) =>
                                    updateField("drivingBack", file)
                                }
                                // onRemove={() =>
                                //     updateField("drivingBack", null)
                                // }
                            />
                        </Grid>

                    </Grid>
                </SectionCard>

                <SectionCard title="Police Verification">
                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <InputTextField
                                label="National Police Check Number"
                                value={data.policeNumber}
                                placeholder="Enter national police"
                                isView={isView}
                                onChange={(value) =>
                                    updateField("policeNumber", value)
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <DateField
                                label="Issue Date"
                                value={dayjs(data.policeIssueDate)}
                                isView={isView}
                                onChange={(value) =>
                                    updateField("policeIssueDate", value)
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <DateField
                                label="Expiry Date"
                                value={dayjs(data.policeExpiryDate)}
                                isView={isView}
                                onChange={(value) =>
                                    updateField("policeExpiryDate", value)
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant3
                                label="Upload Certificate"
                                value={data.policeCertificate}
                                onChange={(file) =>
                                    updateField("policeCertificate", file)
                                }
                                // onRemove={() =>
                                //     updateField("policeCertificate", null)
                                // }
                            />
                        </Grid>

                    </Grid>
                </SectionCard>

                <SectionCard title="Working with Children">
                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputTextField
                                label="Blue Card Number"
                                value={data.blueCardNumber}
                                placeholder="Enter blue card number"
                                isView={isView}
                                onChange={(value) =>
                                    updateField("blueCardNumber", value)
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <DateField
                                label="Expiry Date"
                                value={dayjs(data.blueCardExpiry)}
                                isView={isView}
                                onChange={(value) =>
                                    updateField("blueCardExpiry", value)
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant3
                                label="Upload Certificate"
                                value={data.blueCardCertificate}
                                onChange={(file) =>
                                    updateField("blueCardCertificate", file)
                                }
                                // onRemove={() =>
                                //     updateField("blueCardCertificate", null)
                                // }
                            />
                        </Grid>

                    </Grid>
                </SectionCard>
                <SectionCard title="First Aid">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputTextField
                                label="Certificate Number"
                                placeholder="Enter certificate number"
                                value={data.firstAidCertificateNumber}
                                isView={isView}
                                onChange={(value) =>
                                    updateField("firstAidCertificateNumber", value)
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <DateField
                                label="Expiry Date"
                                value={dayjs(data.firstAidExpiry)}
                                isView={isView}
                                onChange={(value) =>
                                    updateField("firstAidExpiry", value)
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant3
                                label="Upload Certificate"
                                value={data.firstAidCertificate}
                                onChange={(file) =>
                                    updateField("firstAidCertificate", file)
                                }
                                // onRemove={() =>
                                //     updateField("firstAidCertificate", null)
                                // }
                            />
                        </Grid>
                    </Grid>
                </SectionCard>

                <SectionCard title="CPR">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputTextField
                                label="Certificate Number"
                                placeholder="Enter certificate number"
                                value={data.cprCertificateNumber}
                                isView={isView}
                                onChange={(value) =>
                                    updateField("cprCertificateNumber", value)
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <DateField
                                label="Expiry Date"
                                value={dayjs(data.cprExpiry)}
                                isView={isView}
                                onChange={(value) =>
                                    updateField("cprExpiry", value)
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <UploadVariant3
                                label="Upload Certificate"
                                value={data.cprCertificate}
                                onChange={(file) =>
                                    updateField("cprCertificate", file)
                                }
                                // onRemove={() =>
                                //     updateField("cprCertificate", null)
                                // }
                            />
                        </Grid>
                    </Grid>
                </SectionCard>

            </Box>

            <Box
                sx={{
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #E2E8F0",
                    pt: 2,
                    mt: 2,
                    bgcolor: "#fff",
                }}
            >
                <Button
                    sx={{
                        ...WorkerStyles.nextCta,
                        bgcolor: "transparent !important",
                        color: "#222124",
                        fontWeight: 500,
                        border: "1px solid #E2E8F0",
                    }}
                    startIcon={
                        <ArrowBackOutlinedIcon sx={{ width: 18, height: 18, color: '#222124' }} />
                    }
                    onClick={handlePrev}
                >
                    Prev
                </Button>

                <Button
                    sx={WorkerStyles.nextCta}
                    endIcon={
                        <ArrowForwardOutlined sx={{ fontSize: 12 }} />
                    }
                    onClick={handleSubmit}
                // disabled={isView}
                >
                    {isView ? "Close" : "Submit"}
                </Button>
            </Box>
        </Box>
    );
};

export default Compliance;