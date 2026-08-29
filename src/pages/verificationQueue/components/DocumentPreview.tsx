import React from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import type {
  VerificationDocument,
} from "@/types/verificationDetailQueue";

interface DocumentPreviewProps {
  document:
    | VerificationDocument
    | null;

  actionLoading: boolean;

  actionError: string | null;

  onApprove: () => void;

  onReject: () => void;
}

/* --------------------------------------------------
 * Helpers
 * -------------------------------------------------- */

const formatDate = (
  date: string | null
) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-AU",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatFileSize = (
  size: number | null
) => {
  if (!size) {
    return "-";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(
      1
    )} KB`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} MB`;
};

const getStatusColor = (
  status: VerificationDocument["status"]
) => {
  switch (status) {
    case "VERIFIED":
      return "success";

    case "REJECTED":
      return "error";

    default:
      return "warning";
  }
};

const getStatusLabel = (
  status: VerificationDocument["status"]
) => {
  switch (status) {
    case "VERIFIED":
      return "Verified";

    case "REJECTED":
      return "Rejected";

    default:
      return "Pending";
  }
};

/* --------------------------------------------------
 * Document info field
 * -------------------------------------------------- */

interface InfoFieldProps {
  label: string;

  value: string;
}

const InfoField: React.FC<
  InfoFieldProps
> = ({
  label,
  value,
}) => {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 0.25,

          fontWeight: 600,

          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
};

/* --------------------------------------------------
 * PDF Preview
 * -------------------------------------------------- */

interface PdfPreviewProps {
  document: VerificationDocument;
}

const PdfPreview: React.FC<
  PdfPreviewProps
> = ({
  document,
}) => {
  if (!document.documentUrl) {
    return (
      <Box
        sx={{
          minHeight: 500,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          border: "1px dashed",

          borderColor: "divider",

          borderRadius: 2,

          bgcolor: "grey.50",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Document preview is not available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        border: "1px solid",

        borderColor: "divider",

        borderRadius: 2,

        overflow: "hidden",

        bgcolor: "grey.100",
      }}
    >
      <Box
        sx={{
          height: {
            xs: 450,
            md: 600,
          },
        }}
      >
        <iframe
          src={document.documentUrl}
          title={document.documentName}
          width="100%"
          height="100%"
          style={{
            border: "none",
          }}
        />
      </Box>
    </Box>
  );
};

/* --------------------------------------------------
 * Component
 * -------------------------------------------------- */

const DocumentPreview: React.FC<
  DocumentPreviewProps
> = ({
  document,
  actionLoading,
  actionError,
  onApprove,
  onReject,
}) => {
  if (!document) {
    return (
      <Paper
        variant="outlined"
        sx={{
          height: "100%",

          minHeight: 300,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          p: 2.5,

          borderRadius: 3,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Select a document to preview
        </Typography>
      </Paper>
    );
  }

  const isDecided =
    document.status !== "PENDING";

  return (
    <Paper
      variant="outlined"
      sx={{
        height: "100%",

        display: "flex",

        flexDirection: "column",

        p: {
          xs: 2,
          sm: 2.5,
        },

        borderRadius: 3,
      }}
    >
      {/* Header */}

      <Stack
        sx={{
          flexWrap: "wrap",

          direction: "row",

          alignItems: "center",

          justifyContent:
            "space-between",

          mb: 2,

          rowGap: 1,

          gap: 1,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,

              overflow: "hidden",

              textOverflow:
                "ellipsis",

              whiteSpace: "nowrap",
            }}
          >
            Viewing:{" "}
            <Box
              component="span"
              sx={{
                color:
                  "primary.main",
              }}
            >
              {document.documentName}
            </Box>
          </Typography>
        </Box>

        <Chip
          label={getStatusLabel(
            document.status
          )}
          color={getStatusColor(
            document.status
          )}
          size="small"
        />
      </Stack>

      {/* Document Details */}

      <Paper
        variant="outlined"
        sx={{
          p: 2,

          mb: 2,

          borderRadius: 2,

          bgcolor: "grey.50",
        }}
      >
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr 1fr",

              md: "repeat(3, 1fr)",
            },

            gap: 2,
          }}
        >
          <InfoField
            label="Document Type"
            value={
              document.documentType
            }
          />

          <InfoField
            label="Reference Number"
            value={
              document.referenceNumber ||
              "-"
            }
          />

          <InfoField
            label="Uploaded"
            value={formatDate(
              document.uploadedAt
            )}
          />

          <InfoField
            label="Start Date"
            value={formatDate(
              document.startDate
            )}
          />

          <InfoField
            label="Expiry Date"
            value={formatDate(
              document.expiryDate
            )}
          />

          <InfoField
            label="File Size"
            value={formatFileSize(
              document.fileSize
            )}
          />
        </Box>
      </Paper>

      {/* PDF */}

      <Box
        sx={{
          flex: 1,

          minWidth: 0,

          mb: 2,
        }}
      >
        <PdfPreview
          document={document}
        />
      </Box>

      {/* Open document */}

      {document.documentUrl && (
        <Button
          component="a"
          href={document.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="text"
          size="small"
          startIcon={
            <OpenInNewIcon />
          }
          sx={{
            alignSelf:
              "flex-start",

            textTransform:
              "none",

            mb: 1,
          }}
        >
          Open document in new tab
        </Button>
      )}

      {/* Error */}

      {actionError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,

            borderRadius: 2,
          }}
        >
          {actionError}
        </Alert>
      )}

      {/* Actions */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        sx={{
          gap: 1.5,

          mt: 1,

          pt: 2.5,

          borderTop: "1px solid",

          borderColor:
            "divider",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          color="error"
          disabled={
            actionLoading ||
            isDecided
          }
          onClick={onReject}
          startIcon={
            actionLoading ? (
              <CircularProgress
                size={16}
                color="inherit"
              />
            ) : (
              <CancelOutlinedIcon />
            )
          }
          sx={{
            borderRadius: 2,

            textTransform:
              "none",

            fontWeight: 600,

            py: 1.1,
          }}
        >
          Reject
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="success"
          disabled={
            actionLoading ||
            isDecided
          }
          onClick={onApprove}
          startIcon={
            actionLoading ? (
              <CircularProgress
                size={16}
                color="inherit"
              />
            ) : (
              <CheckCircleOutlineOutlined />
            )
          }
          sx={{
            borderRadius: 2,

            textTransform:
              "none",

            fontWeight: 600,

            py: 1.1,
          }}
        >
          Approve
        </Button>
      </Stack>
    </Paper>
  );
};

export default DocumentPreview;
