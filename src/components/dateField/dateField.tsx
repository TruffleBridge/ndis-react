import React from "react";
import { Box, InputAdornment } from "@mui/material";
import { FormLabel, FieldError } from "@/components";
import { styles } from "./styles";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import type { Dayjs } from "dayjs";
import { CalendarInputIcon } from "@/assets";

interface DateFieldProps extends DatePickerProps {
    label: string;
    value: Dayjs | null;
    onChange: (value: Dayjs | null) => void;
    required?: boolean;
    optional?: boolean;
    minDate?: Dayjs;
    maxDate?: Dayjs;
    disablePast?: boolean;
    disableFuture?: boolean;
    error?: string;
    referenceDate?: Dayjs;
    openToYear?: 'day' | 'month' | 'year'
}

const DateField: React.FC<DateFieldProps> = ({
    label,
    value,
    onChange,
    required,
    optional,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    error,
    openToYear,
    referenceDate
}) => {
    const [open, setOpen] = React.useState(false);
    const isValidDate = value?.isValid?.();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={styles.root}>
                <FormLabel label={label} sxText={{ fontWeight: 600 }} required={required} optional={optional} />

                <DatePicker
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={value}
                    onChange={onChange}
                    format="MM/DD/YYYY"
                    minDate={minDate}
                    openTo={openToYear}
                    referenceDate={referenceDate}
                    maxDate={maxDate}
                    disablePast={disablePast}
                    disableFuture={disableFuture}
                    desktopModeMediaQuery="@media (min-width: 0px)"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            error: !!error,
                            onClick: () => setOpen(true),
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarInputIcon />
                                </InputAdornment>
                            ),
                            sx: {
                                ...styles.input(error),
                                "& .MuiPickersSectionList-root span": {
                                    color: isValidDate ? '#111827' : "#7F7F7F",
                                }
                            },
                        },
                        popper: {
                            disablePortal: false,
                            placement: "bottom-start",
                            sx: styles.popper,
                            modifiers: [
                                {
                                    name: "preventOverflow",
                                    options: {
                                        altAxis: true,
                                        tether: false,
                                    },
                                },
                                {
                                    name: "flip",
                                    enabled: true,
                                },
                            ],
                        },
                        desktopPaper: {
                            sx: styles.desktopPaper,
                        },
                    }}
                />

                <FieldError message={error} />
            </Box>
        </LocalizationProvider>
    );
};

export default DateField;
