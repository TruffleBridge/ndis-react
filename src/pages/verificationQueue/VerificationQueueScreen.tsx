import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useVerificationQueueStore } from "@/store/verificationQueueStore";
import { LoadingState, ErrorState } from "@/components/RequestState";

import VerificationTable from "./components/VerificationTable";
import DocumentChecklist from "./components/DocumentChecklist";
import DocumentPreview from "./components/DocumentPreview";
import { useParams } from "react-router-dom";


const VerificationQueueScreen: React.FC = () => {
  const {
    queueList,
    loading,
    error,
    isPanelOpen,
    selectedJob,
    selectedDocument,
    actionLoading,
    actionError,
    fetchVerificationQueue,
    openDocumentPanel,
    closeDocumentPanel,
    selectDocument,
    approveDocument,
    rejectDocument,
  } = useVerificationQueueStore();
  const { id } = useParams<{ id: string }>();


  useEffect(() => {
    if (id) fetchVerificationQueue(id);
  }, [fetchVerificationQueue]);

  if (loading) {
    return <LoadingState label="Loading verification queue..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchVerificationQueue()} />;
  }

  const filteredList = queueList;

  // ------------------------------------------------------------
  // Document verification panel (checklist + preview)
  // ------------------------------------------------------------
  if (isPanelOpen && selectedJob) {
    return (
      <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
          <Button
            onClick={closeDocumentPanel}
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={{ alignSelf: "flex-start", textTransform: "none", color: "text.secondary" }}
          >
            Back to Verification Queue
          </Button>

          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{
                fontWeight: 700
              }}>
                {selectedJob.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedJob.refId} &middot; {selectedJob.category}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {selectedJob.completedDocuments}/{selectedJob.totalDocuments} documents verified
            </Typography>
          </Paper>

          <Grid container spacing={{ xs: 2, sm: 2.5 }}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <DocumentChecklist
                documents={selectedJob.documents}
                selectedDocumentId={selectedDocument?.id}
                onSelect={selectDocument}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 8 }}>
              <DocumentPreview
                document={selectedDocument}
                actionLoading={actionLoading}
                actionError={actionError}
                onApprove={() =>
                  selectedDocument && approveDocument(selectedJob.id, selectedDocument.id)
                }
                onReject={() =>
                  selectedDocument && rejectDocument(selectedJob.id, selectedDocument.id)
                }
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    );
  }

  // ------------------------------------------------------------
  // Table view
  // ------------------------------------------------------------
  return (
    <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
      <Stack spacing={{ xs: 2, sm: 2.5 }}>

        <VerificationTable items={filteredList} onView={openDocumentPanel} />
      </Stack>
    </Box>
  );
};

export default VerificationQueueScreen;
