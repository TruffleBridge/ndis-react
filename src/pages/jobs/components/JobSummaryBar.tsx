import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { JobDetails } from "@/types/jobDetails";
import { StatusBadge } from "@/components/StatusBadge";

interface JobSummaryBarProps {
  job: JobDetails;
}

interface SummaryFieldProps {
  label: string;
  children: React.ReactNode;
}

const SummaryField: React.FC<SummaryFieldProps> = ({ label, children }) => (
  <Grid size={{ xs: 6, sm: 4, md: 3, lg: 12 / 7 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>

    <Typography
      variant="body2"
      sx={{
        mt: 0.5,
        fontWeight: 600,
      }}
    >
      {children}
    </Typography>
  </Grid>
);

const JobSummaryBar: React.FC<JobSummaryBarProps> = ({ job }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
      }}
    >
      <Grid container spacing={2}>
        <SummaryField label="Job ID">
          <Typography
            component="span"
            variant="body2"
            color="primary.main"
            sx={{
              fontWeight: 700
            }}
          >
            {job.jobId}
          </Typography>
        </SummaryField>

        <SummaryField label="Service Type">
          {job.serviceType}
        </SummaryField>

        <SummaryField label="Job Status">
          <StatusBadge status={job.jobStatus} />
        </SummaryField>

        <SummaryField label="Service Date">
          {job.serviceDate}
        </SummaryField>

        <SummaryField label="Shift Time">
          {job.shiftTime}
        </SummaryField>

        <SummaryField label="Location">
          {job.location}
        </SummaryField>

        <SummaryField label="Payment Status">
          <StatusBadge status={job.paymentStatus} />
        </SummaryField>
      </Grid>
    </Paper>
  );
};

export default JobSummaryBar;
