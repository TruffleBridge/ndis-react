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
import type { PaymentHistoryItem } from "@/types/jobDetails";
import { StatusBadge } from "@/components/StatusBadge";

interface PaymentHistoryTableProps {
  items: PaymentHistoryItem[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(value);

const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ items }) => {
  return (
    <Paper variant="outlined" sx={{ width: "100%", p: { xs: 2, sm: 2.5 }, borderRadius: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
        Payment History
      </Typography>

      {items.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No payment records yet.
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ mx: { xs: -2, sm: 0 }, width: { xs: "calc(100% + 32px)", sm: "100%" } }}>
          <Table size="small" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={item.id} hover>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{item.transactionId}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.paymentMode}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(item.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
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

export default PaymentHistoryTable;
