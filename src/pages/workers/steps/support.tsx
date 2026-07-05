import {
    Box,
    Typography,
    Grid,
    Button,
} from "@mui/material";

import { ArrowForwardOutlined } from "@mui/icons-material";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

import { AutocompleteField } from "../../../components";

import { WorkerStyles } from "../styles";
import type { SupportInfo } from "../utils/types";

interface SupportProps {
    data: SupportInfo;
    setData: React.Dispatch<
        React.SetStateAction<SupportInfo>
    >;
    isView: boolean;
    handlePrev?: () => void;
    handleNext?: () => void;
}

const SupportService = ({
    data,
    setData,
    isView,
    handlePrev,
    handleNext,
}: SupportProps) => {

    const updateField = (
        key: keyof SupportInfo,
        value: any
    ) => {
        setData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <Box>
            <Box sx={{ minHeight: "290px" }}>

                <Box
                    sx={{
                        textAlign: "left",
                        mb: 1.3,
                    }}
                >
                    <Typography sx={WorkerStyles.title}>
                        Support Services
                    </Typography>

                    <Typography sx={WorkerStyles.subtitle}>
                        Just the basics - take about
                        30 seconds to set up a secure
                        identity
                    </Typography>
                </Box>

                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Help in Home"
                            value={data.helpInHome}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            // disabled={isView}
                            isView={isView}
                            onChange={(value) =>
                                updateField(
                                    "helpInHome",
                                    value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Social Assistance"
                            value={data.socialAssistance}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            // disabled={isView}
                            isView={isView}
                            onChange={(value) =>
                                updateField(
                                    "socialAssistance",
                                    value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Mentor & Life Skills"
                            value={data.mentorLifeSkills}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            // disabled={isView}
                            isView={isView}
                            onChange={(value) =>
                                updateField(
                                    "mentorLifeSkills",
                                    value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Travel & Transport"
                            value={data.travelTransport}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            // disabled={isView}
                            isView={isView}
                            onChange={(value) =>
                                updateField(
                                    "travelTransport",
                                    value
                                )
                            }
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Personal Care"
                            value={data.personalCare}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            // disabled={isView}
                            isView={isView}
                            onChange={(value) =>
                                updateField(
                                    "personalCare",
                                    value
                                )
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Health & Well Being"
                            value={data.healthWellBeing}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            // disabled={isView}
                            isView={isView}
                            onChange={(value) =>
                                updateField(
                                    "healthWellBeing",
                                    value
                                )
                            }
                        />
                    </Grid>

                </Grid>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                    borderTop: "1px solid #E2E8F0",
                    pt: "13px",
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
                //   disabled={isView}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default SupportService;