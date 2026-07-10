import React from "react";
import { Box, Typography, type SxProps, type Theme } from "@mui/material";
import { styles } from "./styles";

interface PageHeaderProps {
  title: string | null;
  subtitle?: string | null;
  icon?: React.ReactNode
  mainSx?: SxProps<Theme>
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  mainSx
}) => {
  return (
    <Box sx={{ ...styles.root, ...mainSx } as any}>

      {icon}

      < Box >
        <Typography sx={styles.title}>
          {title}
        </Typography>

        {
          subtitle && (
            <Typography sx={styles.subtitle}>
              {subtitle}
            </Typography>
          )
        }
      </Box >
    </Box >
  );
};
export default PageHeader;