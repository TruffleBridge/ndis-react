import {
    Box,
    Grid,
    Button,
} from "@mui/material";

import {
    AutocompleteField,
    DateField,
    InputTextField,
    SectionCard,
    UploadVariant1,
} from "../../../components";

import {
    ArrowForwardOutlined,
} from "@mui/icons-material";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

import { WorkerStyles } from "../styles";
import type { QualificationInfo } from "../utils/types";
import dayjs from "dayjs";

interface QualificationProps {
    data: QualificationInfo;
    setData: React.Dispatch<
        React.SetStateAction<QualificationInfo>
    >;
    isView: boolean;
    handlePrev?: () => void;
    handleNext?: () => void;
}

const Qualification = ({
    data,
    setData,
    isView,
    handlePrev,
    handleNext,
}: QualificationProps) => {

    const updateField = (
        key: keyof QualificationInfo,
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

            {/* Scrollable Body */}

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    pr: 1,
                }}
            >

                <SectionCard title="Education">

                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <AutocompleteField
                                label="Qualification Type"
                                value={data.qualificationType}
                                options={[]}
                                placeholder="Select"
                                readOnly={isView}
                                // disabled={isView}
                                isView={isView}
                                onChange={(value) =>
                                    updateField(
                                        "qualificationType",
                                        value
                                    )
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <InputTextField
                                label="Degree Name"
                                placeholder="Enter degree name"
                                value={data.degreeName}
                                isView={isView}
                                onChange={(value) =>
                                    updateField(
                                        "degreeName",
                                        value
                                    )
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <InputTextField
                                label="Institution"
                                placeholder="Enter institution"
                                value={data.institution}
                                isView={isView}
                                onChange={(value) =>
                                    updateField(
                                        "institution",
                                        value
                                    )
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <InputTextField
                                label="Years Completed"
                                placeholder="Enter years"
                                value={data.yearsCompleted}
                                isView={isView}
                                onChange={(value) =>
                                    updateField(
                                        "yearsCompleted",
                                        value
                                    )
                                }
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
                                onChange={(value) =>
                                    updateField(
                                        "certificationName",
                                        value
                                    )
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <InputTextField
                                label="Certification Number"
                                placeholder="Enter certification number"
                                value={data.certificationNumber}
                                isView={isView}
                                onChange={(value) =>
                                    updateField(
                                        "certificationNumber",
                                        value
                                    )
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <DateField
                                label="Certification Expiry"
                                value={dayjs(data.certificationExpiry)}
                                isView={isView}
                                onChange={(value) =>
                                    updateField(
                                        "certificationExpiry",
                                        value
                                    )
                                }
                            />
                        </Grid>

                    </Grid>
                </SectionCard>

                <Grid size={{ xs: 12 }}>
                    <UploadVariant1
                        label="Upload Certificate"
                        value={data.certificate}
                        // isView={isView}
                        onChange={(file) =>
                            updateField(
                                "certificate",
                                file
                            )
                        }
                    />
                </Grid>

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
                        <ArrowForwardOutlined
                            sx={{ fontSize: 12 }}
                        />
                    }
                    onClick={handleNext}
                // disabled={isView}
                >
                    Next
                </Button>
            </Box>

        </Box>
    );
};

export default Qualification;