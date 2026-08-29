import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";

import type { VerificationDocument } from "@/types/verificationDetailQueue";

interface DocumentPreviewProps {
  document: VerificationDocument | null;
  actionLoading: boolean;
  actionError: string | null;
  onApprove: () => void;
  onReject: () => void;
}

/* --------------------------------------------------
 * FILE PREVIEW
 * -------------------------------------------------- */

const FilePreview: React.FC<{
  file: any;
}> = ({ file }) => {
  const fileType = file?.type?.toLowerCase() || "";
  const fileName = file?.name || "Document";
  const url = file?.url || "";

  const isImage = fileType.startsWith("image/");

  const isPdf =
    fileType === "application/pdf" ||
    fileName.toLowerCase().endsWith(".pdf");

  if (!url) {
    return (
      <Box
        sx={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
        }}
      >
        <Typography color="text.secondary">
          Preview not available
        </Typography>
      </Box>
    );
  }

  /* --------------------------------------------------
   * IMAGE
   * -------------------------------------------------- */

  if (isImage) {
    return (
      <Box
        sx={{
          width: "100%",
          bgcolor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box
          component="img"
          src={url}
          alt={fileName}
          sx={{
            display: "block",
            maxWidth: "100%",
            maxHeight: 600,
            width: "auto",
            height: "auto",
            objectFit: "contain",
            borderRadius: 1,
          }}
        />
      </Box>
    );
  }

  /* --------------------------------------------------
   * PDF
   * -------------------------------------------------- */

  if (isPdf) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 650,
          bgcolor: "grey.100",
        }}
      >
        <Box
          component="iframe"
          src={url}
          title={fileName}
          sx={{
            width: "100%",
            height: "100%",
            border: 0,
            display: "block",
          }}
        />
      </Box>
    );
  }

  /* --------------------------------------------------
   * OTHER FILE TYPE
   * -------------------------------------------------- */

  return (
    <Box
      sx={{
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        bgcolor: "grey.100",
        p: 3,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {fileName}
      </Typography>

      <Button
        component="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        size="small"
      >
        Open Document
      </Button>
    </Box>
  );
};

/* --------------------------------------------------
 * MAIN COMPONENT
 * -------------------------------------------------- */

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
          minHeight: 400,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Typography color="text.secondary">
          Select a document to preview
        </Typography>
      </Paper>
    );
  }

  /*
   * IMPORTANT:
   *
   * Use ALL documentUrls.
   *
   * Don't use only:
   *
   * document.documentUrl
   */

  const files = document.documentUrls?.length
    ? document.documentUrls
    : document.documentUrl
      ? [
          {
            url: document.documentUrl,
            name: document.fileName || "Document",
            size: document.fileSize || 0,
            type: document.fileType || "application/pdf",
            uploadedAt: document.uploadedAt,
            documentSide: undefined,
          },
        ]
      : [];

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Stack spacing={0}>
        {/* --------------------------------------------------
         * HEADER
         * -------------------------------------------------- */}

        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "flex-start",
            textAlign: "start",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {document.documentName}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {document.fileName}
            </Typography>
          </Box>

          <Chip
            size="small"
            label={document.status}
            sx={{
              height: 22,
              color:
                document.status === "VERIFIED"
                  ? "#07AB48"
                  : document.status === "REJECTED"
                    ? "#A11A1A"
                    : "#34485F",
              bgcolor:
                document.status === "VERIFIED"
                  ? "#D9F7E5"
                  : document.status === "REJECTED"
                    ? "#FDF0F0"
                    : "#ECEFF1",
              fontSize: 12,
            }}
          />
        </Box>

        <Divider />

        {/* --------------------------------------------------
         * DOCUMENT INFO
         * -------------------------------------------------- */}

        {(document.referenceNumber ||
          document.startDate ||
          document.expiryDate) && (
          <>
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              {document.referenceNumber && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Reference Number
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {document.referenceNumber}
                  </Typography>
                </Box>
              )}

              {document.startDate && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Start Date
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {document.startDate}
                  </Typography>
                </Box>
              )}

              {document.expiryDate && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Expiry Date
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {document.expiryDate}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider />
          </>
        )}

        {/* --------------------------------------------------
         * ALL FILES
         * -------------------------------------------------- */}

        <Box sx={{ p: 2 }}>
          {files.length === 0 ? (
            <Box
              sx={{
                minHeight: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary">
                No document file available
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2} sx={{ textAlign: "left" }}>
              {files.map((file, index) => {
                const side = file.documentSide || `Document ${index + 1}`;

                return (
                  <Box
                    key={`${document.id}-${file.url}-${index}`}
                    sx={{
                      borderTop: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    {/* File header */}

                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        bgcolor: "grey.50",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {side}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {file.name}
                        </Typography>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        {index + 1} / {files.length}
                      </Typography>
                    </Box>

                    {/* Actual preview */}

                    <FilePreview file={file} />
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>

        {/* --------------------------------------------------
         * ERROR
         * -------------------------------------------------- */}

        {actionError && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="body2" color="error">
              {actionError}
            </Typography>
          </Box>
        )}

        {/* --------------------------------------------------
         * ACTION BUTTONS
         * -------------------------------------------------- */}

        <Divider />

        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelOutlinedIcon />}
            fullWidth
            disabled={
              actionLoading ||
              document.status === "REJECTED"
            }
            sx={{
              height: 44,
            }}
            onClick={onReject}
          >
            Reject
          </Button>

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{
              height: 44,
              bgcolor: "primary.main",
            }}
            startIcon={<CheckCircleOutlineOutlined />}
            disabled={
              actionLoading ||
              document.status === "VERIFIED"
            }
            onClick={onApprove}
          >
            Approve
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default DocumentPreview;
