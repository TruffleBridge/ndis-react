import React, { useEffect } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { useNavigate, useParams } from "react-router-dom";

import { useVerificationQueueStore } from "@/store/verificationQueueStore";

import { ErrorState } from "@/components/RequestState";

import DocumentChecklist from "./components/DocumentChecklist";
import DocumentPreview from "./components/DocumentPreview";
import { Loading } from "@/components";
import { ArrowBackIos } from "@mui/icons-material";

const VerificationQueueScreen: React.FC = () => {
  const {
    loading,
    error,
    selectedJob,
    selectedDocument,
    actionLoading,
    actionError,
    fetchVerificationQueue,
    selectDocument,
    approveDocument,
    rejectDocument,
  } = useVerificationQueueStore();
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>();

  /* --------------------------------------------------
   * FETCH
   * -------------------------------------------------- */

  useEffect(() => {
    if (id) {
      fetchVerificationQueue(id);
    }
  }, [id, fetchVerificationQueue]);

  /* --------------------------------------------------
   * LOADING
   * -------------------------------------------------- */

  if (loading) {
    return <Loading />;
  }

  /* --------------------------------------------------
   * ERROR
   * -------------------------------------------------- */

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          if (id) {
            fetchVerificationQueue(id);
          }
        }}
      />
    );
  }

  /* --------------------------------------------------
   * NO DATA
   * -------------------------------------------------- */

  if (!selectedJob) {
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
        <Typography color="text.secondary">
          No verification data found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%"
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
          mb: 1
        }}
        onClick={() => navigate('/verification-queue')}
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
          xs: 2,
          sm: 2.5,
        }}
      >
        {/* --------------------------------------------------
         * USER HEADER
         * -------------------------------------------------- */}

        <Paper
          variant="outlined"
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            borderRadius: 2,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                textAlign: "start",
              }}
            >
              {selectedJob.name}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {selectedJob.refId}
              {" - "}
              {selectedJob.user.email}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {selectedJob.completedDocuments}/
              {selectedJob.totalDocuments} verified
            </Typography>

            {selectedJob.rejectedDocuments > 0 && (
              <Typography variant="caption" color="error.main">
                {selectedJob.rejectedDocuments} rejected
              </Typography>
            )}
          </Box>
        </Paper>

        {/* --------------------------------------------------
         * CHECKLIST + PREVIEW
         * -------------------------------------------------- */}

        <Grid
          container
          spacing={{
            xs: 2,
            sm: 2.5,
          }}
        >
          {/* --------------------------------------------------
           * CHECKLIST
           * -------------------------------------------------- */}

          <Grid
            size={{
              xs: 12,
              lg: 4,
            }}
          >
            <DocumentChecklist
              documents={selectedJob.documents}
              selectedDocumentId={selectedDocument?.id}
              onSelect={selectDocument}
            />
          </Grid>

          {/* --------------------------------------------------
           * PREVIEW
           * -------------------------------------------------- */}

          <Grid
            size={{
              xs: 12,
              lg: 8,
            }}
          >
            <DocumentPreview
              document={selectedDocument}
              actionLoading={actionLoading}
              actionError={actionError}
              onApprove={() => {
                if (selectedDocument && selectedJob) {
                  approveDocument(
                    selectedJob.id,
                    selectedDocument.id
                  );
                }
              }}
              onReject={() => {
                if (selectedDocument && selectedJob) {
                  rejectDocument(
                    selectedJob.id,
                    selectedDocument.id
                  );
                }
              }}
            />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default VerificationQueueScreen;
