// src/screens/job-details/JobDetailsScreen.tsx

import React, { useEffect, useMemo } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useJobDetailsStore } from "@/store/jobDetailsStore";
import {
  ErrorState,
} from "@/components/RequestState";

import type {
  JobUser,
  JobDetails,
} from "@/types/jobDetails";

import JobSummaryBar from "./components/JobSummaryBar";
import DetailCard from "./components/DetailCard";
import SessionsCard from "./components/SessionsCard";
import { Loading } from "@/components";
import { ArrowBackIos } from "@mui/icons-material";


const valueOrNA = (
  value: unknown
): string => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "N/A";
  }

  return String(value);
};

const getUserAddress = (user?: JobUser | null) => {
  const address = user?.addresses?.[0];

  if (!address) {
    return "No address available";
  }

  return [
    address.street1,
    address.street2,
    address.suburb,
    address.city,
    address.state,
    address.zipCode,
  ]
    .filter(Boolean)
    .join(", ");
};

const normalizeSkill = (skill: unknown): string => {
  if (typeof skill === "string") {
    return skill;
  }

  if (
    typeof skill === "object" &&
    skill !== null
  ) {
    const item = skill as Record<string, unknown>;

    return valueOrNA(
      item.name ??
      item.skillName ??
      item.title ??
      item.label
    );
  }

  return valueOrNA(skill);
};

const SkillsValue: React.FC<{
  skills: unknown[];
}> = ({ skills }) => {
  if (!skills?.length) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: 500,
        }}
      >
        No skills specified
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        gap: 0.75,
      }}
    >
      {skills.map((skill, index) => (
        <Chip
          key={`${normalizeSkill(skill)}-${index}`}
          label={normalizeSkill(skill)}
          size="small"
          variant="outlined"
          sx={{
            maxWidth: "100%",
            fontWeight: 600,
          }}
        />
      ))}
    </Box>
  );
};

const JobDetailsScreen: React.FC = () => {

  const {
    jobDetails,
    loading,
    error,
    fetchJobDetails,
  } = useJobDetailsStore();

  const navigate = useNavigate();
  /**
   * Supports both:
   *
   * navigate("/job-details", {
   *   state: { jobId: 12 }
   * })
   *
   * and:
   *
   * /job-details/12
   */
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const jobId = String(
    id ?? (location.state as { jobId?: string | number } | null)?.jobId ?? ""
  ).replace(/^J/i, "").trim();

  useEffect(() => {
    if (!jobId) {
      return;
    }

    fetchJobDetails(jobId);
  }, [jobId, fetchJobDetails]);

  const locationDetails = useMemo(
    () => jobDetails?.locations?.[0],
    [jobDetails]
  );

  if (!jobId) {
    return (
      <ErrorState
        message="Job ID is missing."
      />
    );
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => fetchJobDetails(jobId)}
      />
    );
  }

  if (!jobDetails) {
    return null;
  }

  const job: JobDetails = jobDetails;

  const client = job.client;
  const worker = job.worker;

  const address =
    locationDetails
      ? [
        locationDetails.street1,
        locationDetails.street2,
        locationDetails.city,
        locationDetails.state,
        locationDetails.zipCode,
      ]
        .filter(Boolean)
        .join(", ")
      : "No service location available";

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >

      <Box
        sx={{
          // position: "sticky",
          // top: 0,
          // zIndex: 1200,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          py: 1,
          cursor: "pointer",
          mb:1
        }}
        onClick={() => navigate('/jobs')}
      >

        <ArrowBackIos fontSize="small" />

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
          }}
        >
          Back
        </Typography>
      </Box>


      <Stack
        spacing={{
          xs: 1.5,
          sm: 2,
          md: 2.5,
        }}
      >
        {/* JOB SUMMARY */}
        <JobSummaryBar job={job} />

        {/* CLIENT + WORKER */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },
          }}
        >
          <DetailCard
            title="Client Details"
            icon={PersonOutlineOutlinedIcon}
            rows={[
              {
                label: "Client Name",
                value: valueOrNA(
                  client?.fullName
                ),
              },
              {
                label: "Email",
                value: valueOrNA(
                  client?.email
                ),
              },
              {
                label: "Phone Number",
                value: valueOrNA(
                  client?.phone
                ),
              },
              {
                label: "Address",
                value: getUserAddress(client),
              },
              {
                label: "Client Status",
                value: client?.activeStatus
                  ? "Active"
                  : "Inactive",
              },
            ]}
          />

          <DetailCard
            title="Worker Details"
            icon={EngineeringOutlinedIcon}
            rows={[
              {
                label: "Worker Name",
                value: valueOrNA(
                  worker?.fullName
                ),
              },
              {
                label: "Email",
                value: valueOrNA(
                  worker?.email
                ),
              },
              {
                label: "Phone Number",
                value: valueOrNA(
                  worker?.phone
                ),
              },
              {
                label: "Experience",
                value:
                  worker?.bio?.yearsOfExperience !==
                    null &&
                    worker?.bio?.yearsOfExperience !==
                    undefined
                    ? `${worker.bio.yearsOfExperience} Years`
                    : "N/A",
              },
              {
                label: "Address",
                value: getUserAddress(worker),
              },
              {
                label: "Speciality",
                value: valueOrNA(
                  worker?.bio?.speciality
                ),
              },
            ]}
          />
        </Box>


        {/* BASIC JOB DETAILS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },
          }}
        >
          <DetailCard
            title="Job Details"
            icon={WorkOutlineOutlinedIcon}
            rows={[
              {
                label: "Job Title",
                value: valueOrNA(job.job?.title),
              },
              {
                label: "Description",
                value: valueOrNA(job.job?.description),
              },
              {
                label: "Service Category",
                value: valueOrNA(job.serviceCategory),
              },
              {
                label: "Service Type",
                value: valueOrNA(job.serviceType),
              },
              {
                label: "Hourly Rate",
                value: job.job?.hourlyRate
                  ? `$${job.job.hourlyRate}/hour`
                  : "N/A",
              },
              {
                label: "Shift",
                value: valueOrNA(job.job?.shift),
              },
              {
                label: "Hours Per Day",
                value: job.job?.hoursPerDay
                  ? `${job.job.hoursPerDay} Hours`
                  : "N/A",
              },
              {
                label: "Experience Level",
                value: valueOrNA(
                  job.job?.experienceLevel
                ),
              },
              {
                label: "Gender Preference",
                value: valueOrNA(
                  job.job?.genderPreference
                ),
              },
              {
                label: "Urgent Shift",
                value: job.job?.isUrgentShift
                  ? "Yes"
                  : "No",
              },
            ]}
          />
          {/* SERVICE + REQUIRED SKILLS */}
          <DetailCard
            title="Service Requirements"
            icon={WorkOutlineOutlinedIcon}
            rows={[
              {
                label: "Service Category",
                value: valueOrNA(
                  job.serviceCategory
                ),
              },
              {
                label: "Service Type",
                value: valueOrNA(
                  job.serviceType
                ),
              },
              {
                label: "Required Skills",
                value: (
                  <SkillsValue
                    skills={
                      job.requiredSkills || []
                    }
                  />
                ),
              },
              {
                label: "Service Requirement",
                value: valueOrNA(
                  job.job?.serviceRequirement
                ),
              },
              {
                label: "Preferred Languages",
                value:
                  job.preferredLanguages?.length
                    ? job.preferredLanguages
                      .map(normalizeSkill)
                      .join(", ")
                    : "None specified",
              },
              {
                label: "Certifications",
                value:
                  job.certifications?.length
                    ? job.certifications
                      .map(normalizeSkill)
                      .join(", ")
                    : "None specified",
              },
            ]}
          />
        </Box>


        {/* LOCATION */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },
          }}
        >
          <DetailCard
            title="Location Details"
            icon={PlaceOutlinedIcon}
            rows={[
              {
                label: "Service Address",
                value: address,
              },
              {
                label: "City",
                value: valueOrNA(
                  locationDetails?.city
                ),
              },
              {
                label: "State",
                value: valueOrNA(
                  locationDetails?.state
                ),
              },
              {
                label: "Postal Code",
                value: valueOrNA(
                  locationDetails?.zipCode
                ),
              },
              {
                label: "Timezone",
                value: valueOrNA(
                  locationDetails?.timezone
                ),
              },
              {
                label: "Coordinates",
                value:
                  locationDetails?.latitude &&
                    locationDetails?.longitude
                    ? `${locationDetails.latitude}, ${locationDetails.longitude}`
                    : "N/A",
              },
            ]}
            latitude={locationDetails?.latitude ?? '-'}
            longitude={locationDetails?.longitude ?? '-'}
          />

          {/* ALL SESSIONS */}
          <SessionsCard
            sessions={job.sessions || []}
          />
        </Box>

        {/* PAYMENT */}
        <DetailCard
          title="Payment Summary"
          icon={PaymentsOutlinedIcon}
          rows={[
            {
              label: "Payment Status",
              value: valueOrNA(
                job.paymentStatus
              ),
            },
            {
              label: "Client Payment",
              value: valueOrNA(
                job.job?.clientPaidToNimora
              ),
            },
            {
              label: "Payments Recorded",
              value: job.payments?.length
                ? `${job.payments.length} Payment${job.payments.length > 1
                  ? "s"
                  : ""
                }`
                : "No payments recorded",
            },
          ]}
        />

        {/* BOOKINGS */}
        {/* <DetailCard
          title="Booking Summary"
          icon={EngineeringOutlinedIcon}
          rows={[
            {
              label: "Total Bookings",
              value: String(
                job.bookings?.length || 0
              ),
            },
            {
              label: "Booking Status",
              value:
                job.bookings?.length
                  ? job.bookings
                    .map(
                      (booking) =>
                        booking.bookingStatus
                          ?.name
                    )
                    .filter(Boolean)
                    .join(", ")
                  : "No bookings",
            },
          ]}
        /> */}
      </Stack>
    </Box>
  );
};

export default JobDetailsScreen;