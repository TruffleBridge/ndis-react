import React, { useState } from "react";
import {
    Button,
    Popover,
    Stack,
    Box,
    type SxProps,
    type Theme,
} from "@mui/material";
import AutocompleteField from "../select/autocompleteField";
import FilterListIcon from "@mui/icons-material/FilterList";

export interface FilterSelectConfig<T = any> {
    id: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    multiple?: boolean;
    disabled?: boolean;
    options: T[];
    value: any;
    error?: string;
    onChange: (value: any) => void;
}

interface Props {
    buttonLabel?: string;
    selects: FilterSelectConfig[];
    onApply: () => void;
    onClear: () => void;
    disabled?: boolean;
}

const toolbarBtnSx: SxProps<Theme> = {
    color: "custom.200",
    borderColor: "#D0D5DD",
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 500,
    fontSize: "14px",
    px: 2,
    py: 0.75,
    borderWidth: '1.4px',
    "&:hover": { borderColor: "#D0D5DD", backgroundColor: "#F9FAFB" },
};

export const FilterPopover = ({
    buttonLabel = "Filter",
    selects,
    onApply,
    onClear,
    disabled
}: Props) => {
    const [anchorEl, setAnchorEl] =
        useState<HTMLButtonElement | null>(null);

    const open = Boolean(anchorEl);

    const handleOpen = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleApply = () => {
        onApply();
        handleClose();
    };

    const handleClear = () => {
        if (disabled) {
            handleClose()
        } else {
            onClear();
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
                onClick={handleOpen}
                sx={toolbarBtnSx}
            >
                {buttonLabel}
            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            p: 2,
                            boxShadow: "0px 1px 3px rgba(0,0,0,0.04),0px 12px 32px rgba(0,0,0,0.08)",
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'custom.800'
                        }
                    }
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <Box sx={{ pt: 1, width: 320, maxHeight: 400, height: '100%', minHeight: 300 }}>
                    <Stack spacing={2}>
                        {selects.map((item) => (
                            <AutocompleteField
                                key={item.id}
                                label={item?.label}
                                multiple={item.multiple}
                                options={item.options}
                                value={item.value}
                                disabled={item.disabled}
                                onChange={(value) =>
                                    item.onChange(value)
                                }
                            />
                        ))}
                    </Stack>
                </Box>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        pt: 1.5,
                        borderTop: '1px solid',
                        borderColor: 'custom.800'
                    }}
                >
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: 'custom.800'
                        }}
                        onClick={handleClear}
                    >
                        {disabled ? "Close" : "Clear All"}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleApply}
                        disabled={disabled}
                    >
                        Apply
                    </Button>
                </Stack>
            </Popover>
        </>
    );
};
