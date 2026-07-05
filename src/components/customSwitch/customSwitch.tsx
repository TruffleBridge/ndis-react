import React from "react";
import { Switch, FormControlLabel, Box, Typography, type SxProps, type Theme } from "@mui/material";
import FormLabel from "../formLabel/formLabel";

export interface SwitchItem {
    label: string;
    value: boolean;
    key: string;
}

interface CustomSwitchProps {
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;

    // Multiple
    multiple?: boolean;
    items?: SwitchItem[];
    onItemsChange?: (items: SwitchItem[]) => void;
    sxProps?: SxProps<Theme>
    disabled?: boolean;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
    label,
    checked = false,
    onChange,
    sxProps,
    multiple = false,
    items = [],
    onItemsChange,

    disabled = false,
}) => {
    const switchSx = {
        width: 40,
        height: 20,
        padding: 0,

        "& .MuiSwitch-switchBase": {
            padding: "2px",

            "&.Mui-checked": {
                transform: "translateX(20px)",
                color: "#fff",

                "& + .MuiSwitch-track": {
                    bgcolor: "#0B7C77",
                    opacity: 1,
                },
            },
        },

        "& .MuiSwitch-thumb": {
            width: 16,
            height: 16,
            boxShadow: "none",
        },

        "& .MuiSwitch-track": {
            borderRadius: "99px",
            bgcolor: "#BDBDBD",
            opacity: 1,
        },
    };

    if (multiple) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: 'start'
                }}
            >
                {label && <div style={{ marginBottom: "10px" }}>
                    <FormLabel label={label} sxText={{ fontSize: 14, fontWeight: 600 }} />
                </div>}
                <div style={{ display: 'flex', gap: '12px' }}>
                    {items.map((item, index) => (
                        <FormControlLabel
                            key={item.key}
                            sx={{ m: 0 }}
                            labelPlacement="start"
                            label={
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 400,
                                        mr: 1,
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            }
                            control={
                                <Switch
                                    checked={item.value}
                                    disabled={disabled}
                                    sx={switchSx}
                                    onChange={(e) => {
                                        const updated = [...items];
                                        updated[index].value = e.target.checked;
                                        onItemsChange?.(updated);
                                    }}
                                />
                            }
                        />
                    ))}
                </div>
            </Box>
        );
    }

    return (
        <FormControlLabel
            sx={{ m: 0, ...sxProps }}
            labelPlacement="start"
            label={label && <FormLabel label={label} sxText={{ fontSize: 14, fontWeight: 600 }} />}
            control={
                <Switch
                    checked={checked}
                    disabled={disabled}
                    sx={switchSx}
                    onChange={(e) => onChange?.(e.target.checked)}
                />
            }
        />
    );
};