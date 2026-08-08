import { Box, Grid, Button } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { InputTextField, SectionCard } from "@/components";
import { ClientStyles } from "../styles";
import { CompanyHomeIcon, CompanyIcon, LocationIcon, LocationIcon1 } from "@/assets";
import { useClientStore } from "@/store/useClient";
import { getViewFunction } from "@/utils/viewfunction";
import { onlyNumbers } from "@/utils/helper";

interface BusinessProps {
    isView?: boolean;
    handlePrev?: () => void;
    handleNext?: () => void;
}

/**
 * Fully store-driven, same pattern as PersonalInformation: values come from
 * useClientStore, edits go through setBusinessField, `isView` disables every
 * field.
 */
const BusinessStep = ({ isView, handleNext, handlePrev }: BusinessProps) => {
    const businessData = useClientStore((s) => s.businessData);
    const setBusinessField = useClientStore((s) => s.setBusinessField);
    const errors = useClientStore((s) => s.errors.business);
    const goToNextStep = useClientStore((s) => s.goToNextStep);

    const onNext = () => {
        if (isView) {
            handleNext?.();
            return;
        }
        const valid = goToNextStep("business");
        if (valid) handleNext?.();
    };

    return (
        <Box sx={ClientStyles.mainHeightRes}>
            <Box sx={ClientStyles.subHeightRes}>
                <SectionCard title="Entity Information" icon={<CompanyIcon />}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            {isView ? getViewFunction('Registered NDIS Business Name', businessData?.businessName, 'plain', <CompanyHomeIcon />) :
                                <InputTextField
                                    label="Registered NDIS Business Name"
                                    placeholder="e.g Care Solutions Pty. Ltd"
                                    value={businessData?.businessName}
                                    required
                                    error={!!errors.businessName}
                                    errors={errors.businessName}
                                    onChange={(e) => setBusinessField("businessName", e)}
                                    startAdornment={<CompanyHomeIcon />}
                                />}
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            {isView ? getViewFunction('Active ABN', businessData?.abn, 'plain') :
                                <InputTextField
                                    label="Active ABN"
                                    placeholder="#11-digit ABN"
                                    value={businessData?.abn}
                                    required
                                    error={!!errors.abn}
                                    errors={errors.abn}
                                    onChange={(e) => {
                                        if (e?.length !== 12) {
                                            setBusinessField("abn", onlyNumbers(e))
                                        }
                                    }
                                    }
                                    slotProps={{ htmlInput: { maxLength: 11 } }}
                                />}
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            {isView ? getViewFunction('ACN', businessData?.acn, 'plain') :
                                <InputTextField
                                    label="ACN"
                                    placeholder="#9-digit ACN"
                                    value={businessData?.acn}
                                    error={!!errors.acn}
                                    errors={errors.acn}
                                    onChange={(e) => {
                                        if (e?.length !== 10) {
                                            setBusinessField("acn", onlyNumbers(e))
                                        }
                                    }}
                                    slotProps={{ htmlInput: { maxLength: 9 } }}
                                />}
                        </Grid>
                    </Grid>
                </SectionCard>

                <SectionCard title="Business Address" icon={<LocationIcon1 />}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            {isView ? getViewFunction('Enter your business address', businessData?.address, 'plain', <LocationIcon />) :
                                <InputTextField
                                    label="Enter your business address"
                                    placeholder="123 example street"
                                    value={businessData?.address}
                                    required
                                    error={!!errors.address}
                                    errors={errors.address}
                                    onChange={(e) => setBusinessField("address", e)}
                                    startAdornment={<LocationIcon />}
                                />}
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            {isView ? getViewFunction('Enter suburb', businessData?.suburb, 'plain') :
                                <InputTextField
                                    label="Suburb"
                                    required
                                    placeholder="enter suburb"
                                    value={businessData?.suburb}
                                    error={!!errors.suburb}
                                    errors={errors.suburb}
                                    onChange={(e) => setBusinessField("suburb", e)}
                                />}
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            {isView ? getViewFunction('Enter state', businessData?.state, 'plain') :
                                <InputTextField
                                    label="State"
                                    placeholder="enter state"
                                    value={businessData?.state}
                                    onChange={(e) => setBusinessField("state", e)}
                                />}
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            {isView ? getViewFunction('Postal Code', businessData?.postalCode, 'plain') :
                                <InputTextField
                                    label="Postal Code"
                                    placeholder="0000"
                                    value={businessData?.postalCode}
                                    onChange={(e) => {
                                        setBusinessField("postalCode", onlyNumbers(e))
                                    }
                                    }
                                />}
                        </Grid>
                    </Grid>
                </SectionCard>
            </Box>

            <Box sx={ClientStyles.bottomFixed}>
                <Button
                    sx={{ ...ClientStyles.nextCta, bgcolor: "transparent !important", color: "#222124", fontWeight: 500, border: "1px solid #E2E8F0" }}
                    startIcon={<ArrowBackOutlinedIcon sx={{ width: 18, height: 18, color: "#222124" }} />}
                    onClick={handlePrev}
                >
                    Prev
                </Button>

                <Button sx={ClientStyles.nextCta} endIcon={<ArrowForwardOutlined sx={{ fontSize: 12 }} />} onClick={onNext}>
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default BusinessStep;