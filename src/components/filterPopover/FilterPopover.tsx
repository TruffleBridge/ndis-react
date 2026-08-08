import React, { useState } from "react";
import {
    Button,
    Popover,
    Stack,
    type SxProps,
} from "@mui/material";
import { Dayjs } from "dayjs";
import FilterListIcon from "@mui/icons-material/FilterList";

import AutocompleteField from "../select/autocompleteField";
import DateField from "../dateField/dateField"; // Update the path if needed

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

export interface FilterDateConfig {
    id: string;
    label: string;
    value: Dayjs | null;
    required?: boolean;
    disabled?: boolean;
    disableFuture?: boolean;
    disablePast?: boolean;
    minDate?: Dayjs;
    maxDate?: Dayjs;
    referenceDate?: Dayjs;
    openToYear?: "year" | "month" | "day";
    error?: string;
    onChange: (value: Dayjs | null) => void;
}

interface Props {
    buttonLabel?: string;
    selects?: FilterSelectConfig[];
    dates?: FilterDateConfig[];
    onApply: () => void;
    onClear: () => void;
    disabled?: boolean;
}

const toolbarBtnSx: SxProps = {
    color: "custom.200",
    borderColor: "#D0D5DD",
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 500,
    fontSize: "14px",
    px: 2,
    py: 0.75,
    borderWidth: "1.4px",
    "&:hover": {
        borderColor: "#D0D5DD",
        backgroundColor: "#F9FAFB",
    },
};

export const FilterPopover = ({
    buttonLabel = "Filter",
    selects = [],
    dates = [],
    onApply,
    onClear,
    disabled,
}: Props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
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
            handleClose();
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
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            p: 2,
                            width: 340,
                            boxShadow:
                                "0px 1px 3px rgba(0,0,0,0.04),0px 12px 32px rgba(0,0,0,0.08)",
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "custom.800",
                        },
                    },
                }}
            >
                <Stack spacing={2} sx={{
                    height: '100%',
                    maxHeight: '320px',
                    overflow: 'auto',
                    minHeight: '320px'
                }}>
                    {selects.map((item) => (
                        <AutocompleteField
                            key={item.id}
                            label={item.label}
                            multiple={item.multiple}
                            options={item.options}
                            value={item.value}
                            disabled={item.disabled}
                            error={item.error}
                            onChange={item.onChange}
                        />
                    ))}

                    {dates.map((item) => (
                        <DateField
                            key={item.id}
                            label={item.label}
                            value={item.value}
                            required={item.required}
                            disabled={item.disabled}
                            disableFuture={item.disableFuture}
                            disablePast={item.disablePast}
                            minDate={item.minDate}
                            maxDate={item.maxDate}
                            referenceDate={item.referenceDate}
                            openToYear={item.openToYear}
                            error={item.error}
                            onChange={item.onChange}
                        />
                    ))}
                </Stack>

                <Stack
                    direction="row"
                    sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: "custom.800",
                        justifyContent: "space-between"
                    }}
                >
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: "custom.800",
                        }}
                        onClick={handleClear}
                    >
                        {disabled ? "Close" : "Clear All"}
                    </Button>

                    <Button
                        variant="contained"
                        disabled={disabled}
                        onClick={handleApply}
                    >
                        Apply
                    </Button>
                </Stack>
            </Popover>
        </>
    );
};