import React from "react";
import { Box, OutlinedInput } from "@mui/material";
import { FieldError, FormLabel } from "../../components";
import { styles } from "./styles";

interface TextareaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    optional?: boolean;
    error?: string;
    isView?: boolean;
}

const Textarea: React.FC<TextareaFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
    required,
    optional,
    error,
    isView=false
}) => {
    return (
        <Box sx={styles.root}>
            <FormLabel label={label} required={required} optional={optional} />

            <OutlinedInput
                multiline
                rows={rows}
                value={value}
                readOnly={isView}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                error={!!error}
                sx={styles.input(error)}
            />

            <FieldError message={error} />
        </Box>
    );
};
export default Textarea;