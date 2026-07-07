import { Box, Typography, Button, Grid } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import dayjs, { type Dayjs } from "dayjs";

import { DateField, InputTextField, ToggleGroup } from "../../../components";
import { UploadVariant1 } from "../../../components/newFileUpload/FileUpload";
import { ClientStyles } from "../styles";
import { GENDER_OPTIONS } from "../utils/constants";
import type { PersonalFormData } from "../utils/types";
import { useNavigate } from "react-router-dom";

interface PersonalProps {
    data: PersonalFormData;
    onChange: <K extends keyof PersonalFormData>(field: K, value: PersonalFormData[K]) => void;
    isView?: boolean;
    handleNext?: () => void;
}

/**
 * Fully controlled: every value comes from `data`, every edit goes through
 * `onChange`. No local state here - this is what lets Create / Edit / View
 * all reuse the exact same component, with ClientFormPage as the single
 * source of truth. `isView` disables every field so View mode is read-only.
 *
 * `dob` is stored as a plain ISO date string ("YYYY-MM-DD") in form state so
 * the state stays serializable/JSON-friendly. DateField works in `Dayjs`
 * objects though, so we convert on the way in and out.
 */
const PersonalInformation = ({ data, onChange, isView, handleNext }: PersonalProps) => {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ textAlign: "left", flexShrink: 0, mb: 1 }}>
                <Typography sx={ClientStyles.title}>Personal Information</Typography>
                <Typography sx={ClientStyles.subtitle}>
                    Just the basics - take about 30 seconds to set up a secure identity
                </Typography>
            </Box>

            <Box sx={ClientStyles.scrollArea}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <InputTextField
                            label="First Name"
                            value={data.firstName}
                            placeholder="e.g. Jane Cooper"
                            isView={isView}
                            onChange={(e) => onChange("firstName", e)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }} sx={ClientStyles.dateFieldGrid}>
                        <DateField
                            label="Date of Birth"
                            value={data.dob ? dayjs(data.dob) : null}
                            isView={isView}
                            onChange={(value: Dayjs | null) =>
                                onChange("dob", value ? value.format("MM/DD/YYYY") : null)
                            }
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <InputTextField
                            label="Mobile Number"
                            placeholder="+61 400 000 000"
                            value={data.mobile}
                            isView={isView}
                            onChange={(e) => onChange("mobile", e)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <InputTextField
                            label="Email Address"
                            value={data.email}
                            placeholder="jane@gmail.com"
                            isView={isView}
                            onChange={(e) => onChange("email", e)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <ToggleGroup
                            label="Gender"
                            value={data.gender}
                            options={GENDER_OPTIONS}
                            disabled={isView}
                            onChange={(value: string) => onChange("gender", value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <UploadVariant1
                            label="Upload ID Proof"
                            value={data.idProofFile}
                            // isView={isView}
                            onChange={(file) => onChange("idProofFile", file)}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box
                sx={{
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #E2E8F0",
                    pt: 2,
                    mt: 1,
                    bgcolor: "#fff",
                }}
            >
                <Button
                    sx={{ ...ClientStyles.nextCta, bgcolor: "transparent !important", color: "#222124", fontWeight: 500, border: "1px solid #E2E8F0" }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <Button sx={ClientStyles.nextCta} endIcon={<ArrowForwardOutlined sx={{ fontSize: "12px" }} />} onClick={handleNext}>
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default PersonalInformation;