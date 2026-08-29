import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";

import { useJobDetailsStore } from "../../store/jobDetailsStore";
import { LoadingState, ErrorState } from "@/components/RequestState";

import JobSummaryBar from "./components/JobSummaryBar";
import InfoCard from "./components/InfoCard";
import PaymentSummaryCard from "./components/PaymentSummaryCard";
import PaymentHistoryTable from "./components/PaymentHistoryTable";
import WorkHistoryTable from "./components/WorkHistoryTable";
import { PersonOutlineOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

// interface JobDetailsScreenProps {
//   jobId?: string;
// }

const JobDetailsScreen: React.FC = () => {
  const {
    jobDetails,
    loading,
    error,
    fetchJobDetails,
  } = useJobDetailsStore();
  const location = useLocation();
  const job_id = location?.state?.jobId

  useEffect(() => {
    fetchJobDetails(job_id);
  }, [job_id, fetchJobDetails]);

  if (loading) {
    return <LoadingState label="Loading job details..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => fetchJobDetails(job_id)}
      />
    );
  }

  if (!jobDetails) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        p: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      <Stack
        sx={{
          gap: {
            xs: 2,
            sm: 2.5,
          },
        }}
      >
        {/* Job identifiers strip */}
        <JobSummaryBar job={jobDetails} />

        {/* Client & Worker */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: {
              xs: 2,
              sm: 2.5,
            },
          }}
        >
          <InfoCard
            icon={<PersonOutlineOutlined />}
            title="Client Details"
            rows={[
              {
                label: "Client Name",
                value: jobDetails.client.clientName,
              },
              {
                label: "Email",
                value: jobDetails.client.email,
              },
              {
                label: "Phone Number",
                value: jobDetails.client.phoneNumber,
              },
              {
                label: "Address",
                value: jobDetails.client.address,
              },
              {
                label: "Emergency Contact",
                value: jobDetails.client.emergencyContact,
              },
            ]}
          />

          <InfoCard
            icon={<EngineeringOutlinedIcon />}
            title="Worker Details"
            rows={[
              {
                label: "Worker Name",
                value: jobDetails.worker.workerName,
              },
              {
                label: "Email",
                value: jobDetails.worker.email,
              },
              {
                label: "Phone Number",
                value: jobDetails.worker.phoneNumber,
              },
              {
                label: "Experience",
                value: jobDetails.worker.experience,
              },
              {
                label: "Skills",
                value: jobDetails.worker.skills,
              },
            ]}
          />
        </Box>

        {/* Location, Schedule & Payment */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: {
              xs: 2,
              sm: 2.5,
            },
          }}
        >
          <InfoCard
            icon={<PlaceOutlinedIcon />}
            title="Location Details"
            rows={[
              {
                label: "Service Address",
                value: jobDetails.locationDetails.serviceAddress,
              },
              {
                label: "City",
                value: jobDetails.locationDetails.city,
              },
              {
                label: "State",
                value: jobDetails.locationDetails.state,
              },
              {
                label: "Postal Code",
                value: jobDetails.locationDetails.postalCode,
              },
            ]}
          />

          <InfoCard
            icon={<EventAvailableOutlinedIcon />}
            title="Schedule Summary"
            rows={[
              {
                label: "Start Date",
                value: jobDetails.scheduleSummary.startDate,
              },
              {
                label: "End Date",
                value: jobDetails.scheduleSummary.endDate,
              },
              {
                label: "Total Working Days",
                value:
                  jobDetails.scheduleSummary.totalWorkingDays,
              },
              {
                label: "Total Hours",
                value: `${jobDetails.scheduleSummary.totalHours} Hours`,
              },
            ]}
          />

          <PaymentSummaryCard
            summary={jobDetails.paymentSummary}
          />
        </Box>

        {/* Payment History */}
        <PaymentHistoryTable
          items={jobDetails.paymentHistory}
        />

        {/* Work History */}
        <WorkHistoryTable
          items={jobDetails.workHistory}
        />
      </Stack>
    </Box>
  );
};

export default JobDetailsScreen;
