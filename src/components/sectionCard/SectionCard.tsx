import React from "react";
import { Box, Typography } from "@mui/material";
import { styles } from "./styles";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: any
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  children,
  icon
}) => {
  return (
    <Box sx={styles.card}>
      {(title || subtitle) && (
        <Box sx={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1%' }}>
            {icon}
            {title && (
              <Typography sx={styles.title}>
                {title}
              </Typography>
            )}
          </div>

          {subtitle && (
            <Typography sx={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      <Box sx={{ p: 2 }}>
        {children}
      </Box>
    </Box>
  );
};
export default SectionCard;