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
import type { WorkHistoryItem } from "../../../types/jobDetails";
import { StatusBadge } from "@/components/StatusBadge";

interface WorkHistoryTableProps {
  items: WorkHistoryItem[];
}

const WorkHistoryTable: React.FC<WorkHistoryTableProps> = ({ items }) => {
  return (
    <Paper variant="outlined" sx={{ width: "100%", p: { xs: 2, sm: 2.5 }, borderRadius: 3 }}>
      <Typography variant="subtitle2"
        sx={{
          mb: 2,
          fontWeight: 700
        }}>
        Work History
      </Typography>

      {items.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No work records yet.
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ mx: { xs: -2, sm: 0 }, width: { xs: "calc(100% + 32px)", sm: "100%" } }}>
          <Table size="small" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Shift Time</TableCell>
                <TableCell>Hours Worked</TableCell>
                <TableCell>Attendance Status</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={item.id} hover>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.shiftTime}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{item.hoursWorked}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.attendanceStatus} />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>{item.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default WorkHistoryTable;
