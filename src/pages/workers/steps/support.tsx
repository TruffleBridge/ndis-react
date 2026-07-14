import { useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { AutocompleteField } from "../../../components";
import { WorkerStyles } from "../styles";
import { useWorkerStore } from "../../../store/useWorker";
import { useLookupStore } from "../../../store/useMasterAPI";
import type { Option } from "../../../types/worker";
import { getViewFunction } from "../../../utils/viewfunction";

interface SupportProps {
    isView?: boolean;
    handlePrev?: () => void;
    handleNext?: () => void;
}

// TODO: replace with actual serviceCategoryId values from backend
const CATEGORY = {
    HELP_IN_HOME: 1,
    SOCIAL_ASSISTANCE: 2,
    MENTOR_LIFE_SKILLS: 3,
    TRAVEL_TRANSPORT: 4,
    PERSONAL_CARE: 5,
    HEALTH_WELL_BEING: 6,
} as const;

const SupportService = ({ isView, handlePrev, handleNext }: SupportProps) => {
    const data = useWorkerStore((s) => s.supportInfo);
    const setField = useWorkerStore((s) => s.setSupportField);
    const goToNextStep = useWorkerStore((s) => s.goToNextStep);
    const errors = useWorkerStore((s) => s.errors.support);

    const queryServices = useLookupStore((s) => s.queryServices);
    const services = useLookupStore((s) => s.services);
    const getOptions = useLookupStore((s) => s.getOptions);

    useEffect(() => {
        if (!isView) {
            Object.values(CATEGORY).forEach((categoryId) => {
                queryServices(categoryId, { reset: true });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        {isView ? getViewFunction('Help in Home', data?.helpInHome, 'chip') :
                            <AutocompleteField
                                label="Help in Home"
                                value={data.helpInHome}
                                options={getOptions(CATEGORY.HELP_IN_HOME)}
                                multiple
                                error={errors.helpInHome}
                                placeholder="Select"
                                onChange={(value) => setField("helpInHome", value as Option[])}
                                onSearch={(search) => queryServices(CATEGORY.HELP_IN_HOME, { search })}
                                onLoadMore={() => queryServices(CATEGORY.HELP_IN_HOME)}
                                hasMore={services[CATEGORY.HELP_IN_HOME]?.hasMore ?? true}
                                loadingMore={services[CATEGORY.HELP_IN_HOME]?.loading ?? false}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {isView ? getViewFunction('Social Assistance', data?.socialAssistance, 'chip') :
                            <AutocompleteField
                                label="Social Assistance"
                                value={data.socialAssistance}
                                options={getOptions(CATEGORY.SOCIAL_ASSISTANCE)}
                                multiple
                                error={errors.socialAssistance}
                                placeholder="Select"
                                onChange={(value) => setField("socialAssistance", value as Option[])}
                                onSearch={(search) => queryServices(CATEGORY.SOCIAL_ASSISTANCE, { search })}
                                onLoadMore={() => queryServices(CATEGORY.SOCIAL_ASSISTANCE)}
                                hasMore={services[CATEGORY.SOCIAL_ASSISTANCE]?.hasMore ?? true}
                                loadingMore={services[CATEGORY.SOCIAL_ASSISTANCE]?.loading ?? false}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {isView ? getViewFunction('Mentor & Life Skills', data?.mentorLifeSkills, 'chip') :
                            <AutocompleteField
                                label="Mentor & Life Skills"
                                value={data.mentorLifeSkills}
                                options={getOptions(CATEGORY.MENTOR_LIFE_SKILLS)}
                                multiple
                                error={errors.mentorLifeSkills}
                                placeholder="Select"
                                onChange={(value) => setField("mentorLifeSkills", value as Option[])}
                                onSearch={(search) => queryServices(CATEGORY.MENTOR_LIFE_SKILLS, { search })}
                                onLoadMore={() => queryServices(CATEGORY.MENTOR_LIFE_SKILLS)}
                                hasMore={services[CATEGORY.MENTOR_LIFE_SKILLS]?.hasMore ?? true}
                                loadingMore={services[CATEGORY.MENTOR_LIFE_SKILLS]?.loading ?? false}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {isView ? getViewFunction('Travel & Transport', data?.travelTransport, 'chip') :
                            <AutocompleteField
                                label="Travel & Transport"
                                value={data.travelTransport}
                                options={getOptions(CATEGORY.TRAVEL_TRANSPORT)}
                                multiple
                                error={errors.travelTransport}
                                placeholder="Select"
                                onChange={(value) => setField("travelTransport", value as Option[])}
                                onSearch={(search) => queryServices(CATEGORY.TRAVEL_TRANSPORT, { search })}
                                onLoadMore={() => queryServices(CATEGORY.TRAVEL_TRANSPORT)}
                                hasMore={services[CATEGORY.TRAVEL_TRANSPORT]?.hasMore ?? true}
                                loadingMore={services[CATEGORY.TRAVEL_TRANSPORT]?.loading ?? false}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {isView ? getViewFunction('Personal Care', data?.personalCare, 'chip') :
                            <AutocompleteField
                                label="Personal Care"
                                value={data.personalCare}
                                options={getOptions(CATEGORY.PERSONAL_CARE)}
                                multiple
                                error={errors.personalCare}
                                placeholder="Select"
                                onChange={(value) => setField("personalCare", value as Option[])}
                                onSearch={(search) => queryServices(CATEGORY.PERSONAL_CARE, { search })}
                                onLoadMore={() => queryServices(CATEGORY.PERSONAL_CARE)}
                                hasMore={services[CATEGORY.PERSONAL_CARE]?.hasMore ?? true}
                                loadingMore={services[CATEGORY.PERSONAL_CARE]?.loading ?? false}
                            />}
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        {isView ? getViewFunction('Health & Well Being', data?.healthWellBeing, 'chip') :
                            <AutocompleteField
                                label="Health & Well Being"
                                value={data.healthWellBeing}
                                options={getOptions(CATEGORY.HEALTH_WELL_BEING)}
                                multiple
                                error={errors.healthWellBeing}
                                placeholder="Select"
                                onChange={(value) => setField("healthWellBeing", value as Option[])}
                                onSearch={(search) => queryServices(CATEGORY.HEALTH_WELL_BEING, { search })}
                                onLoadMore={() => queryServices(CATEGORY.HEALTH_WELL_BEING)}
                                hasMore={services[CATEGORY.HEALTH_WELL_BEING]?.hasMore ?? true}
                                loadingMore={services[CATEGORY.HEALTH_WELL_BEING]?.loading ?? false}
                            />}
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
                    startIcon={
                        <ArrowBackOutlinedIcon
                            sx={{ width: 18, height: 18, color: "#222124" }}
                        />
                    }
                    onClick={handlePrev}
                >
                    Prev
                </Button>

                <Button
                    sx={WorkerStyles.nextCta}
                    endIcon={<ArrowForwardOutlined sx={{ fontSize: 12 }} />}
                    onClick={onNext}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default SupportService;