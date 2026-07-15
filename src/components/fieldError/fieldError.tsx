import React from "react";
import { Box, Typography } from "@mui/material";
import { styles } from "./styles";

interface FieldErrorProps {
  message?: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <Box sx={styles.container}>
      {/* <ErrorOutlineOutlined sx={styles.icon} /> */}
      <Typography sx={styles.text}>
        {message}
      </Typography>
    </Box>
  );
};

export default FieldError;