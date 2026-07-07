import * as React from "react";
import { ToggleButton, ToggleButtonGroup, Typography, Box } from "@mui/material";

interface Option {
    label: string;
    value: string;
}

interface GenderToggleProps {
    label?: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    disabled?: boolean
}

export const ToggleGroup = ({
    label,
    value,
    options,
    onChange,
    disabled
}: GenderToggleProps) => {
    const handleChange = (
        _: React.MouseEvent<HTMLElement>,
        newValue: string | null
    ) => {
        if (newValue !== null) {
            onChange(newValue);
        }
    };

    return (
        <Box sx={{ textAlign: 'left' }}>
            {label && (
                <Typography
                    sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1D2524",
                        mb: 1.5,
                    }}
                >
                    {label}
                </Typography>
            )}

            <ToggleButtonGroup
                exclusive
                value={value}
                onChange={handleChange}
                sx={{
                    gap: "12px",
                    flexWrap: "wrap",
                }}
                disabled={disabled}
            >
                {options.map((item) => (
                    <ToggleButton
                        key={item.value}
                        value={item.value}
                        disableRipple
                        sx={{
                            textTransform: "none",
                            minWidth: "80px",
                            height: "34px",
                            borderRadius: "99px !important",
                            border: "1px solid #BEC9C6",
                            px: 3,
                            fontSize: "12px",
                            fontWeight: 500,
                            backgroundColor: "#F2F4F4",
                            color: "#3E4947",

                            "&.Mui-selected": {
                                backgroundColor: "#D4E6E5",
                                color: "#086D63",
                                fontWeight: 600,
                                borderColor: "#086D63 !important",
                            },

                            "&.Mui-selected:hover": {
                                backgroundColor: "#D4E6E5",
                            },

                            "&:hover": {
                                backgroundColor: "#E8F1F0",
                            },
                            "&.MuiToggleButtonGroup-middleButton": {
                                border: "1px solid #BEC9C6",
                            },
                            "&.MuiToggleButtonGroup-lastButton": {
                                border: "1px solid #BEC9C6",
                            }
                        }}
                    >
                        {item.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
};
