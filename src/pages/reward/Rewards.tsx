// ═══════════════════════════════════════════════════════════════
// Demo Page — Variant Switcher
// ═══════════════════════════════════════════════════════════════

import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { UploadVariant1, UploadVariant2, UploadVariant3, type UploadedFile } from "../../components/newFileUpload/FileUpload";

const VARIANTS = ["Variant 1", "Variant 2", "Variant 3"] as const;

type VariantType = (typeof VARIANTS)[number];

const MAX_SIZE = 5 * 1024 * 1024;

function validate(file: File) {
  if (
    ![
      "application/pdf",
      "image/jpeg",
      "image/png",
    ].includes(file.type)
  ) {
    return "Only PDF, JPG and PNG are allowed.";
  }

  if (file.size > MAX_SIZE) {
    return "Maximum size is 5 MB.";
  }

  return null;
}

export default function FileUploadDemo() {
  const [active, setActive] =
    useState<VariantType>("Variant 1");

  const PRIMARY = "#2E7D6B";
  const PRIMARY_LIGHT = "#E8F5F1";


  const LABEL_COLOR = "#1A1A1A";

  const [idProof, setIdProof] =
    useState<UploadedFile | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const handleUpload = (file: File) => {
    const err = validate(file);

    if (err) {
      setError(err);
      return;
    }

    setError(null);

    setIdProof({
      file,
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
    });
  };



  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FA",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 780 }}>
        {/* Variant Switcher */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 4 }}
        >
          {VARIANTS.map((v) => (
            <Chip
              key={v}
              label={v}
              onClick={() => setActive(v)}
              sx={{
                fontWeight: 600,
                fontSize: 13,
                px: 1,
                borderRadius: "8px",
                backgroundColor:
                  active === v ? PRIMARY : "#fff",
                color:
                  active === v ? "#fff" : LABEL_COLOR,
                border: `1.5px solid ${active === v
                  ? PRIMARY
                  : "#D1D5DB"
                  }`,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    active === v
                      ? PRIMARY
                      : PRIMARY_LIGHT,
                },
              }}
            />
          ))}
        </Stack>

        {/* Main Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            p: { xs: 2.5, sm: 4 },
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: PRIMARY,
              mb: 3,
              letterSpacing: -0.3,
            }}
          >
            {active}
          </Typography>

          {active === "Variant 1" && (
            <UploadVariant1 />
          )}

          {active === "Variant 2" && (
            <UploadVariant2 />
          )}

          {active === "Variant 3" && (
            <UploadVariant3
              label="Upload ID Proof"
              uploadedFile={idProof}
              error={error}
              onFile={handleUpload}
              onRemove={() => setIdProof(null)}
              onClearError={() => setError(null)}
            />
          )}
        </Paper>
      </Box>
    </Box>
  );
}