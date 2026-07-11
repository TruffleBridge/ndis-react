import React from "react";
import {
    Box,
    TextField,
    Autocomplete,
} from "@mui/material";
import type { AutocompleteProps } from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

import { FormLabel, FieldError } from "../../components";
import { styles } from "./styles";

export interface AutocompleteOption {
    value: string;
    label: string;
}

interface SelectFieldProps
    extends Omit<
        AutocompleteProps<
            AutocompleteOption,
            boolean,
            false,
            false
        >,
        | "renderInput"
        | "options"
        | "value"
        | "onChange"
        | "getOptionLabel"
        | "isOptionEqualToValue"
    > {
    label: string;
    value: AutocompleteOption | AutocompleteOption[] | null;
    options: AutocompleteOption[];
    onChange: (
        value: AutocompleteOption | AutocompleteOption[] | null
    ) => void;
    placeholder?: string;
    required?: boolean;
    optional?: boolean;
    error?: string;
    isView?: boolean;
    multiple?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
    label,
    value,
    options,
    onChange,
    placeholder = "Select",
    required,
    optional,
    error,
    isView = false,
    multiple = false,
    ...rest
}) => {
    return (
        <Box sx={styles.root}>
            <FormLabel
                label={label}
                required={required}
                optional={optional}
                sxText={{ fontWeight: 600, fontSize: "14px" }}
            />

            <Autocomplete
                multiple={multiple}
                value={value}
                options={options}
                onChange={(_, newValue) => onChange(newValue)}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, selected) =>
                    option.value === selected.value
                }
                popupIcon={
                    <ExpandMoreOutlinedIcon
                        sx={{ color: "#7F7F7F" }}
                        fontSize="small"
                    />
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={placeholder}
                        error={!!error}
                        sx={styles.input(error, rest.disabled, isView)}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props} style={styles.option}>
                        {option.label}
                    </li>
                )}
                sx={styles.popup}
                {...rest}
            />

            <FieldError message={error} />
        </Box>
    );
};

export default SelectField;