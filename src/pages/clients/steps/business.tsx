import { Box, Typography, Grid, Button } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { InputTextField, SectionCard } from "../../../components";
import { ClientStyles } from "../styles";
import { CompanyHomeIcon, CompanyIcon, LocationIcon, LocationIcon1 } from "../../../assets";
import type { BusinessFormData } from "../utils/types";

interface BusinessProps {
    data: BusinessFormData;
    onChange: <K extends keyof BusinessFormData>(field: K, value: BusinessFormData[K]) => void;
    isView?: boolean;
    handlePrev?: () => void;
    handleNext?: () => void;
}

/**
 * Fully controlled, same pattern as PersonalInformation: values come from
 * `data`, edits go through `onChange`, `isView` disables every field.
 */
const BusinessStep = ({ data, onChange, isView, handleNext, handlePrev }: BusinessProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ mb: 1, flexShrink: 0, textAlign: "left" }}>
                <Typography sx={ClientStyles.title}>NDIS Business</Typography>
                <Typography sx={ClientStyles.subtitle}>
                    Please provide the official registered business name as it appears on your NDIS provider registration documents
                </Typography>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                <SectionCard title="Entity Information" icon={<CompanyIcon />}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <InputTextField
                                label="Registered NDIS Business Name"
                                placeholder="e.g Care Solutions Pty. Ltd"
                                value={data.businessName}
                                required
                                isView={isView}
                                onChange={(e) => onChange("businessName", e)}
                                startAdornment={<CompanyHomeIcon />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputTextField
                                label="Active ABN"
                                placeholder="#11-digit ABN"
                                value={data.abn}
                                required
                                isView={isView}
                                onChange={(e) => onChange("abn", e)}
                                slotProps={{ htmlInput: { maxLength: 11 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <InputTextField
                                label="ACN"
                                placeholder="#9-digit ACN"
                                value={data.acn}
                                isView={isView}
                                onChange={(e) => onChange("acn", e)}
                                slotProps={{ htmlInput: { maxLength: 9 } }}
                            />
                        </Grid>
                    </Grid>
                </SectionCard>

                <SectionCard title="Business Address" icon={<LocationIcon1 />}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <InputTextField
                                label="Enter your business address"
                                placeholder="123 example street"
                                value={data.address}
                                required
                                isView={isView}
                                onChange={(e) => onChange("address", e)}
                                startAdornment={<LocationIcon />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <InputTextField
                                label="Suburb"
                                required
                                placeholder="enter suburb"
                                value={data.suburb}
                                isView={isView}
                                onChange={(e) => onChange("suburb", e)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <InputTextField
                                label="State"
                                placeholder="enter state"
                                value={data.state}
                                isView={isView}
                                onChange={(e) => onChange("state", e)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <InputTextField
                                label="Postal Code"
                                placeholder="0000"
                                value={data.postalCode}
                                isView={isView}
                                onChange={(e) => onChange("postalCode", e)}
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
                    sx={{ ...ClientStyles.nextCta, bgcolor: "transparent !important", color: "#222124", fontWeight: 500, border: "1px solid #E2E8F0" }}
                    startIcon={<ArrowBackOutlinedIcon sx={{ width: 18, height: 18, color: "#222124" }} />}
                    onClick={handlePrev}
                >
                    Prev
                </Button>

                <Button sx={ClientStyles.nextCta} endIcon={<ArrowForwardOutlined sx={{ fontSize: 12 }} />} onClick={handleNext}>
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default BusinessStep;