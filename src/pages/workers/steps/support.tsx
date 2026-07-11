import { Box, Grid, Button } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { AutocompleteField } from "../../../components";
import { WorkerStyles } from "../styles";
import { useWorkerStore } from "../../../store/useWorker";
import type { Option } from "../../../types/worker";

interface SupportProps {
    isView?: boolean;
    handlePrev?: () => void;
    handleNext?: () => void;
}

const SupportService = ({ isView, handlePrev, handleNext }: SupportProps) => {
    const data = useWorkerStore((s) => s.supportInfo);
    const setField = useWorkerStore((s) => s.setSupportField);
    const goToNextStep = useWorkerStore((s) => s.goToNextStep);

    const onNext = () => {
        if (isView) {
            handleNext?.();
            return;
        }
        const valid = goToNextStep("support");
        if (valid) handleNext?.();
    };

    return (
        <Box sx={WorkerStyles.mainHeightRes}>
            <Box sx={WorkerStyles.subHeightRes}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Help in Home"
                            value={data.helpInHome}
                            options={[]}
                            multiple
                            placeholder="Select"
                            readOnly={isView}
                            isView={isView}
                            onChange={(value) => setField("helpInHome", value as Option[])}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Social Assistance"
                            value={data.socialAssistance}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            isView={isView}
                            onChange={(value) => setField("socialAssistance", value as Option[])}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Mentor & Life Skills"
                            value={data.mentorLifeSkills}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            isView={isView}
                            onChange={(value) => setField("mentorLifeSkills", value as Option[])}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Travel & Transport"
                            value={data.travelTransport}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            isView={isView}
                            onChange={(value) => setField("travelTransport", value as Option[])}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Personal Care"
                            value={data.personalCare}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            isView={isView}
                            onChange={(value) => setField("personalCare", value as Option[])}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AutocompleteField
                            label="Health & Well Being"
                            value={data.healthWellBeing}
                            options={[]}
                            placeholder="Select"
                            readOnly={isView}
                            isView={isView}
                            onChange={(value) => setField("healthWellBeing", value as Option[])}
                        />
                    </Grid>
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

export default SupportService;