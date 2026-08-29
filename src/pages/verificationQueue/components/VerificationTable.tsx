import React from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import type {
  DocumentStatus,
  VerificationQueueItem,
} from "@/types/verificationDetailQueue";

interface VerificationTableProps {
  items: VerificationQueueItem[];

  onView: (
    jobId: string,
    documentId?: string
  ) => void;
}

const getStatusColor = (
  status: DocumentStatus
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

const VerificationTable: React.FC<
  VerificationTableProps
> = ({
  items,
  onView,
}) => {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: 3,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              User
            </TableCell>

            <TableCell>
              Reference
            </TableCell>

            <TableCell>
              Documents
            </TableCell>

            <TableCell>
              Verified
            </TableCell>

            <TableCell>
              Rejected
            </TableCell>

            <TableCell>
              Status
            </TableCell>

            <TableCell align="right">
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              hover
            >
              <TableCell>
                <Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {item.user.email}
                  </Typography>
                </Stack>
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                >
                  {item.refId}
                </Typography>
              </TableCell>

              <TableCell>
                {item.totalDocuments}
              </TableCell>

              <TableCell>
                {item.completedDocuments}
              </TableCell>

              <TableCell>
                {item.rejectedDocuments}
              </TableCell>

              <TableCell>
                <Chip
                  size="small"
                  label={getStatusLabel(
                    item.overallStatus
                  )}
                  color={getStatusColor(
                    item.overallStatus
                  )}
                />
              </TableCell>

              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={
                    <VisibilityOutlinedIcon />
                  }
                  onClick={() =>
                    onView(
                      item.id,
                      item.documents[0]
                        ?.id
                    )
                  }
                  sx={{
                    textTransform:
                      "none",

                    borderRadius: 2,
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VerificationTable;
