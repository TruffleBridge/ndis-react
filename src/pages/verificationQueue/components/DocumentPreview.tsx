import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import type { VerificationDocument } from "../../../types/verificationDetailQueue";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";

interface DocumentPreviewProps {
  document: VerificationDocument | null;
  actionLoading: boolean;
  actionError: string | null;
  onApprove: () => void;
  onReject: () => void;
}

interface IdentityFieldProps {
  label: string;
  value: string;
}

const IdentityField: React.FC<IdentityFieldProps> = ({
  label,
  value,
}) => {
  return (
    <Box
      sx={{
        minWidth: 0,
      }}
    >
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
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

interface IdentityPreviewCardProps {
  document: VerificationDocument;
}

const IdentityPreviewCard: React.FC<IdentityPreviewCardProps> = ({
  document,
}) => {
  const preview = document.identityPreview!;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: {
          xs: 2,
          sm: 2.5,
        },
        borderRadius: 2,
        bgcolor: "grey.50",
      }}
    >
      <Stack
        sx={{
          direction: {
            xs: "column",
            sm: "row",
          },
          alignItems: {
            xs: "stretch",
            sm: "flex-start",
          }
        }}
        spacing={3}
      >
        <Avatar
          src={preview.photoUrl}
          alt={`${preview.givenNames} ${preview.surname}`}
          variant="rounded"
          sx={{
            width: 112,
            height: 128,
            alignSelf: {
              xs: "center",
              sm: "flex-start",
            },
            flexShrink: 0,
          }}
        />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <IdentityField
            label="Type"
            value={preview.documentType}
          />

          <IdentityField
            label="Issuing Country"
            value={preview.issuingCountry}
          />

          <IdentityField
            label="Document No."
            value={preview.documentNo}
          />

          <IdentityField
            label="Surname"
            value={preview.surname}
          />

          <IdentityField
            label="Given Names"
            value={preview.givenNames}
          />

          <IdentityField
            label="Sex"
            value={preview.sex}
          />

          <IdentityField
            label="Nationality"
            value={preview.nationality}
          />

          <IdentityField
            label="Date of Birth"
            value={preview.dateOfBirth}
          />

          <IdentityField
            label="Date of Issue"
            value={preview.dateOfIssue}
          />

          <IdentityField
            label="Date of Expiry"
            value={preview.dateOfExpiry}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

interface GenericFilePreviewProps {
  document: VerificationDocument;
}

const GenericFilePreview: React.FC<GenericFilePreviewProps> = ({
  document,
}) => {
  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        py: 8,
        borderRadius: 2,
        border: "1px dashed",
        borderColor: "divider",
        bgcolor: "grey.50",
        textAlign: "center",
      }}
    >
      <InsertDriveFileOutlinedIcon
        sx={{
          fontSize: 32,
          color: "text.disabled",
        }}
      />

      <Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
          }}
        >
          {document.documentName}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
          }}
        >
          Preview not available for this file type
        </Typography>
      </Box>
    </Stack>
  );
};

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
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

  const isDecided = document.status !== "Pending";

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
      <Stack
        sx={{
          flexWrap:"wrap",
          direction: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          rowGap: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
          }}
        >
          Viewing:{" "}
          <Typography
            component="span"
            variant="subtitle2"
            color="primary.main"
            sx={{
              fontWeight: 700,
            }}
          >
            {document.documentName}
          </Typography>
        </Typography>

        <StatusBadge status={document.status} />
      </Stack>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {document.identityPreview ? (
          <IdentityPreviewCard document={document} />
        ) : (
          <GenericFilePreview document={document} />
        )}
      </Box>

      {actionError && (
        <Alert
          severity="error"
          sx={{
            mt: 2,
            borderRadius: 2,
          }}
        >
          {actionError}
        </Alert>
      )}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        sx={{
          gap: 1.5,
          mt: 3,
          pt: 2.5,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          color="error"
          disabled={actionLoading || isDecided}
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
            textTransform: "none",
            fontWeight: 600,
            py: 1.1,
          }}
        >
          Reject
        </Button>

        <Button
          fullWidth
          variant="contained"
          disabled={actionLoading || isDecided}
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
            textTransform: "none",
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
