import React from "react";
import { Box, Typography } from "@mui/material";
import { styles } from "./styles";

interface VerificationBannerProps {
  boldPrefix?: string;
  message: string;
}

const VerificationBanner: React.FC<VerificationBannerProps> = ({
  boldPrefix,
  message,
}) => {
  return (
    <Box sx={styles.banner}>
      <Typography sx={styles.text}>
        {boldPrefix && (
          <Typography component="span" sx={styles.bold}>
            {boldPrefix}{" "}
          </Typography>
        )}
        {message}
      </Typography>
    </Box>
  );
};
export default VerificationBanner;