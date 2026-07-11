import { Box, Grid, Button } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { FormLabel } from "../../../components";
import { UploadVariant2 } from "../../../components/newFileUpload/FileUpload";
import { ClientStyles } from "../styles";
import { DOCUMENT_FIELDS } from "../utils/constants";
import { useClientStore } from "../../../store/useClient";
import { useUploadStore } from "../../../store/useUpload";

interface DocumentRegisterProps {
    isView?: boolean;
    isSubmitting?: boolean;
    handlePrev?: () => void;
    /** Wired by the parent to Submit (create/edit) or Cancel-and-close (view) */
    handleNext?: () => void;
}

/**
 * Renders every document upload by looping over DOCUMENT_FIELDS, split into
 * "mandatory" and "recommended" sections exactly like before - but now reads
 * from and writes into useClientStore instead of local/parent props.
 *
 * Each uploaded file gets `documentType` set to that field's label before
 * being saved into the store, exactly as required.
 */
const DocumentRegisterStep = ({ isView, isSubmitting, handleNext, handlePrev }: DocumentRegisterProps) => {
    const documentData = useClientStore((s) => s.documentData);
    const setDocumentField = useClientStore((s) => s.setDocumentField);
    const errors = useClientStore((s) => s.errors.document);
    const goToNextStep = useClientStore((s) => s.goToNextStep);
    const mode = useClientStore((s) => s.mode);

    const mandatoryFields = DOCUMENT_FIELDS.filter((f) => f.section === "mandatory");
    const recommendedFields = DOCUMENT_FIELDS.filter((f) => f.section === "recommended");
    const mandatoryKeys = mandatoryFields.map((f) => f.key);
    const uploadDocument = useUploadStore((s) => s.uploadDocument);
    const idProofUploadError = useUploadStore((s) => s.uploadErrors);

    const onNext = () => {
        if (isView) {
            handleNext?.();
            return;
        }
        // Only mandatory documents block progress - "recommended" stays optional.
        const valid = goToNextStep("document", mandatoryKeys);
        if (valid) handleNext?.();
    };

    const handleUpload = async (field: string, file: any) => {
        const files = file?.file
        if (!files) {
            setDocumentField(field, file)
            return;
        }
        // Actually uploads to /api/uploads/, stamps documentType
        // = "ID Proof" on the response, then saves it into the store.
        const uploaded = await uploadDocument(files, "ID Proof", "idProofFile");
        if (uploaded) setDocumentField(field, {
            ...file,
            url: uploaded?.url,
        });
    }

    return (
        <Box sx={ClientStyles.mainHeightRes}>
            <Box sx={ClientStyles.subHeightRes}>
                <Grid container spacing={0}>
                    {mandatoryFields.map((field) => (
                        <Grid size={{ xs: 12 }} key={field.key} sx={{ mb: 1 }}>
                            <UploadVariant2
                                icon={field.icon}
                                label={field.label}
                                sublabel={field.sublabel}
                                value={documentData[field.key] ?? null}
                                disabled={isView}
                                onChange={(file) => handleUpload(field.key, file ? { ...file, documentType: field.label } : null)}
                                // onChange={(file) =>
                                //     setDocumentField(field.key, file ? { ...file, documentType: field.label } : null)
                                // }
                                errors={errors[field.key] || idProofUploadError[field.key]}
                            />
                        </Grid>
                    ))}

                    <FormLabel
                        label="Strongly Recommended"
                        optional
                        sxText={{ fontSize: 14, color: "#000000", fontWeight: 500, mt: 2, mb: 1 }}
                    />

                    {recommendedFields.map((field) => (
                        <Grid size={{ xs: 12 }} key={field.key} sx={{ mb: 1 }}>
                            <UploadVariant2
                                icon={field.icon}
                                label={field.label}
                                sublabel={field.sublabel}
                                value={documentData[field.key] ?? null}
                                disabled={isView}
                                onChange={(file) => handleUpload(field.key, file ? { ...file, documentType: field.label } : null)}
                            // onChange={(file) =>
                            //     setDocumentField(field.key, file ? { ...file, documentType: field.label } : null)
                            // }
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={ClientStyles.bottomFixed}>
                <Button
                    sx={{ ...ClientStyles.nextCta, bgcolor: "transparent !important", color: "#222124", fontWeight: 500, border: "1px solid #E2E8F0" }}
                    startIcon={<ArrowBackOutlinedIcon sx={{ width: 18, height: 18, color: "#222124" }} />}
                    onClick={handlePrev}
                >
                    Prev
                </Button>

                <Button
                    sx={ClientStyles.nextCta}
                    endIcon={!isView && <ArrowForwardOutlined sx={{ fontSize: 12 }} />}
                    onClick={onNext}
                    disabled={isSubmitting}
                >
                    {isView ? "Close" : mode === 'edit' ? "Update" : isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </Box>
        </Box>
    );
};

export default DocumentRegisterStep;