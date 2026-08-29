import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import type { PaymentSummary } from "@/types/jobDetails";
import { StatusBadge } from "@/components/StatusBadge";

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
  sx?: SxProps<Theme>;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value);
};

interface AmountFieldProps {
  label: string;
  value: number;
  color?: "text.primary" | "info.main" | "warning.main";
}

const AmountField: React.FC<AmountFieldProps> = ({
  label,
  value,
  color = "text.primary",
}) => {
  return (
    <Box
      sx={{
        width: {
          xs: "33.333333%",
        },
        px: 1,
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
        color={color}
        sx={{
          fontWeight: 700,
          mt: 0.25,
        }}
      >
        {formatCurrency(value)}
      </Typography>
    </Box>
  );
};

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({
  summary,
  sx,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 3,
        ...sx,
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
        }}
      >
        <Stack

          spacing={1.5}
          sx={{
            mb: 2,
            direction: "row",
            alignItems: "center"
          }}
        >
          <Avatar
            sx={{
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              width: 32,
              height: 32,
            }}
          >
            <PaidOutlinedIcon fontSize="small" />
          </Avatar>

          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
            }}
          >
            Payment Summary
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            mx: -1,
          }}
        >
          <AmountField
            label="Total Amount"
            value={summary.totalAmount}
          />

          <AmountField
            label="Paid Amount"
            value={summary.paidAmount}
            color="info.main"
          />

          <AmountField
            label="Pending Amount"
            value={summary.pendingAmount}
            color="warning.main"
          />
        </Box>

        <Divider
          sx={{
            my: 2,
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
              }}
            >
              Payment Mode
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.25,
                fontWeight: 600,
              }}
            >
              {summary.paymentMode}
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: "right",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
              }}
            >
              Payment Status
            </Typography>

            <Box
              sx={{
                mt: 0.5,
              }}
            >
              <StatusBadge status={summary.paymentStatus} />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentSummaryCard;
