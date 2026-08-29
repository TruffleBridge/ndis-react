import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";

export const LoadingState: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <Stack sx={{
    alignItems: "center",
    justifyContent: "center",
    py: 10
  }} spacing={2}>
    <CircularProgress size={28} sx={{ color: "primary.main" }} />
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Stack>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <Box sx={{ p: { xs: 2, sm: 3 } }}>
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Try again
          </Button>
        ) : undefined
      }
      sx={{ borderRadius: 2 }}
    >
      <AlertTitle>Something went wrong</AlertTitle>
      {message}
    </Alert>
  </Box>
);
