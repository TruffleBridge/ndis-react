import React from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import FieldError from "@/components/fieldError/fieldError";
import { styles } from "./styles";
import { CheckBoxIcon, CheckedBoxIcon } from "@/assets";

interface RadioOption {
    value: string;
    label: string;
}

interface RadioGroupFieldProps {
    label: string;
    value: string;
    options: RadioOption[];
    onChange: (value: string) => void;
    error?: string;
}

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
    label,
    value,
    options,
    onChange,
    error,
}) => {
    return (
        <Box sx={{ mt: 1 }}>
            <Typography sx={styles.label}>{label}</Typography>

            <RadioGroup
                row
                value={value}
                onChange={(e) => onChange(e.target.value)}
                sx={styles.group}
            >
                {options.map((opt) => (
                    <FormControlLabel
                        key={opt.value}
                        value={opt.value}
                        control={<Radio size="small" sx={styles.radio}
                            icon={<CheckBoxIcon />}
                            checkedIcon={<CheckedBoxIcon />}
                        />}
                        label={
                            <Typography sx={styles.optionLabel}>
                                {opt.label}
                            </Typography>
                        }
                    />
                ))}
            </RadioGroup>

            <FieldError message={error} />
        </Box>
    );
};
export default RadioGroupField;