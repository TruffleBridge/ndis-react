import { Box, Typography, Grid, Button } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { FormLabel } from "../../../components";
import { UploadVariant2, type UploadedFile } from "../../../components/newFileUpload/FileUpload";
import { ClientStyles } from "../styles";
import { DOCUMENT_FIELDS } from "../utils/constants";
import type { DocumentFormData } from "../utils/types";

interface DocumentRegisterProps {
    data: DocumentFormData;
    onChange: (key: string, file: UploadedFile | null) => void;
    isView?: boolean;
    isSubmitting?: boolean;
    handlePrev?: () => void;
    /** Wired by the parent to Submit (create/edit) or Cancel-and-close (view) */
    handleNext?: () => void;
}

/**
 * Renders every document upload by looping over DOCUMENT_FIELDS instead of
 * hand-repeating each <UploadVariant2 />, split into "mandatory" and
 * "recommended" sections exactly like the original static markup.
 *
 * Each UploadVariant2 is now fully controlled: `value={data[field.key]}`
 * means an already-uploaded mock file (Edit/View) or a freshly-picked file
 * (Create) both render immediately, and `onChange` writes straight back into
 * ClientFormPage's `documentData` state under that field's key.
 */
const DocumentRegisterStep = ({ data, onChange, isView, isSubmitting, handleNext, handlePrev }: DocumentRegisterProps) => {
    const mandatoryFields = DOCUMENT_FIELDS.filter((f) => f.section === "mandatory");
    const recommendedFields = DOCUMENT_FIELDS.filter((f) => f.section === "recommended");

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ mb: 1, flexShrink: 0, textAlign: "left" }}>
                <Typography sx={ClientStyles.title}>Document Registration</Typography>
                <Typography sx={ClientStyles.subtitle}>
                    Please upload the official registered documents for the NDIS provider business registration
                </Typography>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                <Grid container spacing={0}>
                    {mandatoryFields.map((field) => (
                        <Grid size={{ xs: 12 }} key={field.key}>
                            <UploadVariant2
                                icon={field.icon}
                                label={field.label}
                                sublabel={field.sublabel}
                                value={data[field.key] ?? null}
                                disabled={isView}
                                onChange={(file) => onChange(field.key, file)}
                            />
                        </Grid>
                    ))}

                    <FormLabel
                        label="Strongly Recommended"
                        optional
                        sxText={{ fontSize: 14, color: "#000000", fontWeight: 500, mt: 2, mb: 1 }}
                    />

                    {recommendedFields.map((field) => (
                        <Grid size={{ xs: 12 }} key={field.key}>
                            <UploadVariant2
                                icon={field.icon}
                                label={field.label}
                                sublabel={field.sublabel}
                                value={data[field.key] ?? null}
                                disabled={isView}
                                onChange={(file) => onChange(field.key, file)}
                            />
                        </Grid>
                    ))}
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
                    sx={{ ...ClientStyles.nextCta, bgcolor: "transparent !important", color: "#222124", fontWeight: 500, border: "1px solid #E2E8F0" }}
                    startIcon={<ArrowBackOutlinedIcon sx={{ width: 18, height: 18, color: "#222124" }} />}
                    onClick={handlePrev}
                >
                    Prev
                </Button>

                <Button
                    sx={ClientStyles.nextCta}
                    endIcon={<ArrowForwardOutlined sx={{ fontSize: 12 }} />}
                    onClick={handleNext}
                    disabled={isSubmitting}
                >
                    {isView ? "Close" : isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </Box>
        </Box>
    );
};

export default DocumentRegisterStep;