import React from "react";
import { Box, Typography } from "@mui/material";
import { styles } from "./styles";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon
}) => {
  return (
    <Box sx={styles.root}>

      {icon}

      <Box>
        <Typography sx={styles.title}>
          {title}
        </Typography>

        {subtitle && (
          <Typography sx={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
export default PageHeader;