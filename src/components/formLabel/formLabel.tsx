import React from "react";
import { Typography, type SxProps, type Theme } from "@mui/material";
import { styles } from "./styles";

interface FormLabelProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  sxText?: SxProps<Theme>;
}

const FormLabel: React.FC<FormLabelProps> = ({
  label,
  required,
  optional,
  sxText
}) => {
  return (
    <Typography sx={{ ...styles.label, ...sxText }}>
      {label}

      {required && (
        <Typography component="span" sx={styles.required}>
          *
        </Typography>
      )}

      {optional && (
        <Typography component="span" sx={styles.optional}>
          (optional)
        </Typography>
      )}
    </Typography>
  );
};
export default FormLabel