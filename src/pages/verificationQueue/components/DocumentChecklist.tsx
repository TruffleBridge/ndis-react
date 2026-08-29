import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import type { VerificationDocument } from "@/types/verificationDetailQueue";
import { FilledTickIcon } from "@/assets";

interface DocumentChecklistProps {
  documents: VerificationDocument[] | undefined;
  selectedDocumentId: string | undefined;
  onSelect: (document: VerificationDocument) => void;
}

const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents = [],
  selectedDocumentId,
  onSelect,
}) => {
  const getStatusIcon = (status: VerificationDocument["status"]) => {
    if (status === "VERIFIED") {
      return <FilledTickIcon />;
    }

    if (status === "REJECTED") {
      return (
        <CancelIcon
          sx={{
            fontSize: 18,
            color: "error.main",
          }}
        />
      );
    }

    return (
      <AccessTimeIcon
        sx={{
          fontSize: 18,
          color: "warning.main",
        }}
      />
    );
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        textAlign: "left",
        overflow: "hidden",
      }}
    >
      {/* --------------------------------------------------
       * HEADER
       * -------------------------------------------------- */}

      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Document Checklist
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {documents.length} document{documents.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      {/* --------------------------------------------------
       * DOCUMENT LIST
       * -------------------------------------------------- */}

      <Stack
        spacing={0.5}
        sx={{
          px: 1.5,
          py: 1,
        }}
      >
        {documents.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No documents available
            </Typography>
          </Box>
        ) : (
          documents.map((document, index) => {
            const selected = document.id === selectedDocumentId;

            const fileCount = document.documentUrls?.length ?? 0;

            return (
              <Box
                key={document.id}
                onClick={() => onSelect(document)}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  cursor: "pointer",
                  bgcolor: selected ? "#F2FCFA" : "transparent",
                  borderLeft: "3px solid",
                  borderColor: selected
                    ? "primary.main"
                    : "transparent",
                  transition: "all 0.2s",

                  "&:hover": {
                    bgcolor: selected ? "primary.50" : "grey.50",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.25,
                  }}
                >
                  {/* Number */}

                  <Box
                    sx={{
                      minWidth: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: selected ? "primary.main" : "grey.100",
                      color: selected ? "white" : "text.secondary",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Box>

                  {/* Content */}

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          wordBreak: "break-word",
                          fontWeight: selected ? 600 : 500,
                          fontSize: 13,
                          color: selected ? "#1E293B" : "#64748B",
                        }}
                      >
                        {document?.documentName}
                      </Typography>

                      {getStatusIcon(document.status)}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        mt: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        size="small"
                        label={document.status}
                        sx={{
                          height: 20,
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
                          fontSize: 10,
                        }}
                      />

                      {fileCount > 1 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {fileCount} files
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Stack>
    </Paper>
  );
};

export default DocumentChecklist;
