// src/screens/job-details/components/JobSummaryBar.tsx

import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import type { JobDetails } from "@/types/jobDetails";

interface JobSummaryBarProps {
  job: JobDetails;
}

interface SummaryItemProps {
  label: string;
  value: React.ReactNode;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  label,
  value,
}) => {
  return (
    <Box
      sx={{
        minWidth: 0,
        px: {
          xs: 0,
          sm: 1.5,
        },
        py: {
          xs: 1,
          sm: 0.5,
        },
        borderRight: {
          xs: "none",
          sm: "1px solid",
        },
        borderBottom: {
          xs: "1px solid",
          sm: "none",
        },
        borderColor: '#D0D5DD !important',
        "&:last-child": {
          borderRight: "none",
          borderBottom: "none",
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: "text.secondary",
          fontWeight: 500,
          mb: 0.35,
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          minWidth: 0,
          overflowWrap: "anywhere",
        }}
      >
        {typeof value === "string" || typeof value === "number" ? (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  );
};

const getStatusColor = (
  status: string
): { backgroundColor: string; color: string } => {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("confirm") ||
    normalized.includes("active") ||
    normalized.includes("paid") ||
    normalized.includes("publish")
  ) {
    return { backgroundColor: '#D9F7E5', color: '#07AB48' };
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("open")
  ) {
    return { backgroundColor: "#EDE9FE", color: "#6D28D9" };
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("reject") ||
    normalized.includes("inactive")
  ) {
    return { backgroundColor: '#ECEFF1', color: '#34485F' };
  }

  return { backgroundColor: "#F2F4F7", color: "#344054" };
};

const StatusChip: React.FC<{ status?: string | null }> = ({
  status,
}) => {
  const text = status || "N/A";
  const statusStyle = getStatusColor(text);

  return (
    <Chip
      label={text}
      size="small"
      sx={{
        ...statusStyle,
        height: 24,
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 1.5,
      }}
    />
  );
};

const JobSummaryBar: React.FC<JobSummaryBarProps> = ({ job }) => {
  // const firstSession = job.sessions?.[0];

  // const shiftTime = firstSession
  //   ? `${firstSession.startTime?.slice(0, 5)} - ${firstSession.endTime?.slice(
  //     0,
  //     5
  //   )}`
  //   : "N/A";

  const location = job.locations?.[0];

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 1.5,
            sm: 2,
          },
          "&:last-child": {
            pb: {
              xs: 1.5,
              sm: 2,
            },
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(5, minmax(0, 1fr))",
              lg: "repeat(7, minmax(0, 1fr))",
            },
            gap: {
              xs: 0,
              sm: 1,
            },
          }}
        >
          <SummaryItem
            label="Job ID"
            value={
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                }}
              >
                {job.jobId}
              </Typography>
            }
          />

          <SummaryItem
            label="Service Type"
            value={job.serviceType || "N/A"}
          />

          <SummaryItem
            label="Service Category"
            value={job.serviceCategory || "N/A"}
          />

          <SummaryItem
            label="Job Status"
            value={<StatusChip status={job.jobStatus} />}
          />

          {/* <SummaryItem
            label="Shift Time"
            value={shiftTime}
          /> */}

          <SummaryItem
            label="Location"
            value={location?.city || "N/A"}
          />

          <SummaryItem
            label="Payment Status"
            value={<StatusChip status={job.paymentStatus} />}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobSummaryBar;