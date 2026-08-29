import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { VerificationQueueItem } from "@/types/verificationDetailQueue";
import { StatusBadge } from "@/components/StatusBadge";

interface VerificationTableProps {
  items: VerificationQueueItem[];
  onView: (jobId: string, documentTypeId?: string) => void;
}

const VerificationTable: React.FC<VerificationTableProps> = ({ items, onView }) => {
  return (
    <Paper variant="outlined" sx={{ width: "100%", p: { xs: 2, sm: 2.5 }, borderRadius: 3 }}>
      {items.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No records waiting for verification.
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ mx: { xs: -2, sm: 0 }, width: { xs: "calc(100% + 32px)", sm: "100%" } }}>
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item: any) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{
                      fontWeight: 600
                    }}>
                      {item?.documentType?.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                      onClick={() => onView(item?.id, item?.documentTypeId)}
                      sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default VerificationTable;
