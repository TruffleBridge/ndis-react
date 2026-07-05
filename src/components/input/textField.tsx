import React from "react";
import {
    Box,
    TextField,
    InputAdornment,
    type SxProps,
    type Theme,
} from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";
import FieldError from "../fieldError/fieldError";
import FormLabel from "../formLabel/formLabel";

interface InputTextFieldProps extends Omit<TextFieldProps, "onChange"> {
    label?: string;
    width?: string | number;
    height?: number;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    fullWidth?: boolean;
    optional?: boolean;
    errors?: string;
    required?: boolean;
    mainSx?: SxProps<Theme>;
    isView?: boolean;
    onChange?: (value: string) => void;
}

const style = {
    backgroundColor: "#FFFFFF",
    // border: "1px solid #D0D5DD !important",
    borderRadius: "8px !important",
}

export const InputTextField: React.FC<InputTextFieldProps> = ({
    label,
    width = "100%",
    height = 42,
    startAdornment,
    endAdornment,
    disabled,
    fullWidth,
    sx,
    optional,
    errors,
    required,
    mainSx,
    isView = false,
    onChange,
    ...rest
}) => {
    return (
        <Box sx={{ width, mb: 1, ...mainSx }}>
            {label && (
                <FormLabel label={label} optional={optional} required={required}
                    sxText={{ fontWeight: 600, fontSize: '14px' }}
                />
            )}

            <TextField
                fullWidth={fullWidth}
                disabled={disabled}
                {...rest}
                error={!!errors}
                onChange={(e) => onChange?.(e.target.value)}
                slotProps={{
                    input: {
                        readOnly: isView,
                        startAdornment: startAdornment && (
                            <InputAdornment position="start">
                                {startAdornment}
                            </InputAdornment>
                        ),
                        endAdornment: endAdornment && (
                            <InputAdornment position="end">
                                {endAdornment}
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                    display: 'flex',
                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                        borderWidth: "1.5px",
                    },
                    "& .MuiOutlinedInput-root": {
                        ...style,
                        height,
                        boxShadow: isView ? 'none' : "0px 1px 2px 0px #1018280D",
                        backgroundColor: disabled
                            ? "#F5F5F5"
                            : "#FFFFFF",
                        "& fieldset": {
                            border: isView ? 'none' : '1px solid',
                            borderWidth: '1.4px',
                            borderColor: "#D0D5DD",
                            "&.MuiOutlinedInput-notchedOutline": {
                                borderColor: isView ? 'none' : "#D0D5DD",
                            }
                        },

                        "&:hover fieldset": {
                            borderColor: "#D0D5DD",
                        },

                        "&.Mui-focused fieldset": {
                            borderColor: "#086D63",
                        },
                    },
                    "& input::placeholder": {
                        color: "#7F7F7F",
                        opacity: 1,
                        fontSize: "14px",
                        fontweight: 400,
                        fontStyle: "regular",
                        fontFamily: "Inter, sans-serif",
                    },
                    "& .MuiOutlinedInput-input": {
                        py: 0,
                        ...isView && { p: 0 }
                    },

                    ...sx,
                }}
            />
            <FieldError message={errors} />
        </Box>
    );
};