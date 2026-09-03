import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";

import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

// import type {
//   PaymentSummary,
// } from "@/types/jobDetails";

import { StatusChip } from "@/components/StatusBadge";

interface PaymentSummaryCardProps {
  summary: any;
}

const formatCurrency = (
  value: number,
): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value);
};

interface AmountProps {
  label: string;
  value: number;
  color:
  | "success.main"
  | "info.main"
  | "warning.main";
}

const Amount = ({
  label,
  value,
  color,
}: AmountProps) => {
  return (
    <Box
      sx={{
        minWidth: 0,
        flex: 1,
        px: {
          xs: 0.5,
          sm: 0.75,
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          whiteSpace: "nowrap",
          fontSize: {
            xs: "0.62rem",
            sm: "0.68rem",
          },
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 0.35,
          fontWeight: 800,
          color,
          fontSize: {
            xs: "0.82rem",
            sm: "0.9rem",
          },
        }}
      >
        {formatCurrency(value)}
      </Typography>
    </Box>
  );
};

const PaymentSummaryCard = ({
  summary,
}: PaymentSummaryCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },
          "&:last-child": {
            pb: {
              xs: 2,
              sm: 2.5,
            },
          },
        }}
      >
        <Stack
          spacing={1.25}
          sx={{
            mb: 2,
            direction: "row",
            alignItems: "center"

          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  0.1,
                ),
              color: "primary.main",
            }}
          >
            <PaidOutlinedIcon fontSize="small" />
          </Avatar>

          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700 }}
          >
            Payment Summary
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            width: "100%",
            mx: -0.5,
          }}
        >
          <Amount
            label="Total Amount"
            value={summary.totalAmount}
            color="success.main"
          />

          <Amount
            label="Paid Amount"
            value={summary.paidAmount}
            color="info.main"
          />

          <Amount
            label="Pending Amount"
            value={summary.pendingAmount}
            color="warning.main"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Payment Mode
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.35,
                fontWeight: 700,
              }}
            >
              {summary.paymentMode}
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: {
                xs: "left",
                sm: "right",
              },
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Payment Status
            </Typography>

            <Box sx={{ mt: 0.5 }}>
              <StatusChip
                status={summary.paymentStatus}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentSummaryCard;