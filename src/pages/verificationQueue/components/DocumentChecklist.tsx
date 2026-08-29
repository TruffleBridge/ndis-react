import React from "react";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import type {
  DocumentStatus,
  VerificationDocument,
} from "@/types/verificationDetailQueue";

interface DocumentChecklistProps {
  documents: VerificationDocument[];

  selectedDocumentId?: string;

  onSelect: (
    document: VerificationDocument
  ) => void;
}

const getStatusColor = (
  status: DocumentStatus
) => {
  switch (status) {
    case "VERIFIED":
      return { color: "#07AB48", bg: "#D9F7E5" };

    case "REJECTED":
      return "error";

    default:
      return { bg: "#ECEFF1", color: "#64748B" };
  }
};

const getStatusLabel = (
  status: DocumentStatus
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

const DocumentChecklist: React.FC<
  DocumentChecklistProps
> = ({
  documents,
  selectedDocumentId,
  onSelect,
}) => {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
          borderRadius: 2,
        }}
      >
        <Stack
          sx={{
            mb: 2,
            direction: "row",
            alignItems: "start",
            justifyContent:
              "space-between",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
            }}
          >
            Document Checklist
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {documents?.length} Documents
          </Typography>
        </Stack>

        <List disablePadding>
          {documents?.map((doc) => {
            const isActive =
              doc?.id === selectedDocumentId;

            return (
              <ListItemButton
                key={doc?.id}
                selected={isActive}
                onClick={() =>
                  onSelect(doc)
                }
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  alignItems: "flex-start",
                  "&.Mui-selected": {
                    bgcolor: `#F2FCFA`,
                    borderLeft: '3px solid',
                    borderColor: 'primary.main'
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    mt: 0.3,
                  }}
                >
                  <DescriptionOutlinedIcon
                    fontSize="small"
                    color={
                      isActive
                        ? "primary"
                        : "disabled"
                    }
                  />
                </ListItemIcon>

                <ListItemText
                  sx={{
                    mt: "0 !important",
                  }}
                  primary={
                    doc?.documentName
                  }
                  secondary={
                    <Chip
                      label={getStatusLabel(
                        doc?.status
                      )}
                      size="small"
                      sx={{
                        mt: 0.5,
                        height: 20,
                        fontSize:12,
                        color: getStatusColor(doc?.status)
                      }}
                    />
                  }
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize:13,

                        fontWeight:
                          isActive
                            ? 600
                            : 500,

                        color: isActive
                          ? "#1E293B"
                          : "#64748B",

                        whiteSpace:
                          "normal",
                      },
                    },
                  }}
                />

                <VisibilityOutlinedIcon
                  fontSize="small"
                  color={
                    isActive
                      ? "primary"
                      : "disabled"
                  }
                  sx={{
                    mt: 1,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    );
  };

export default DocumentChecklist;
