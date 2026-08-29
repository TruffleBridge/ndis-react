import React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { VerificationDocument } from "@/types/verificationDetailQueue";

interface DocumentChecklistProps {
  documents: VerificationDocument[];
  selectedDocumentId?: string;
  onSelect: (document: VerificationDocument) => void;
}

const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  selectedDocumentId,
  onSelect,
}) => {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3 }}>
      <Stack sx={{
        mb: 1, direction: "row",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <Typography variant="subtitle2" sx={{
          fontWeight: 700
        }}>
          Document Checklist
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {documents.length} Documents
        </Typography>
      </Stack>

      <List disablePadding>
        {documents.map((doc) => {
          const isActive = doc.id === selectedDocumentId;
          return (
            <ListItemButton
              key={doc.id}
              selected={isActive}
              onClick={() => onSelect(doc)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: (theme) => `${theme.palette.primary.main}14`,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <DescriptionOutlinedIcon
                  fontSize="small"
                  color={isActive ? "primary" : "disabled"}
                />
              </ListItemIcon>
              <ListItemText
                primary={doc.documentName}
                slotProps={{
                  primary: {
                    sx: {
                      variant: "body2",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "primary.main" : "text.primary",
                      whiteSpace: "nowrap",
                    },
                  },
                }}
              />
              <VisibilityOutlinedIcon
                fontSize="small"
                color={isActive ? "primary" : "disabled"}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};

export default DocumentChecklist;
