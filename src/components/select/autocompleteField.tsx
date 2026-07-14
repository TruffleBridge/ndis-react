import React, { useRef, useEffect, useCallback, useState } from "react";
import Select, { components } from "react-select";
import type { MenuListProps } from "react-select";
import { Box, Chip } from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

import { FormLabel, FieldError } from "../../components";
import { styles, getSelectStyles } from "./styles";

export interface AutocompleteOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
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
    multiple?: boolean;
    disabled?: boolean;

    onSearch?: (search: string) => void;

    /** fired ONLY when the user scrolls DOWN and reaches the bottom */
    onLoadMore?: () => void;

    hasMore?: boolean;

    /** true while fetching next page (blocks duplicate onLoadMore calls) */
    loadingMore?: boolean;

    /** true while the FIRST page is loading (shows spinner in menu) */
    isLoading?: boolean;

    /** debounce delay (ms) for onSearch, default 300 */
    searchDebounceMs?: number;
}

const DropdownIndicator = (props: any) => {
    const { innerProps, innerRef } = props;
    return (
        <div
            ref={innerRef}
            {...innerProps}
            style={{
                display: "flex",
                alignItems: "center",
                paddingRight: 8,
                cursor: "pointer",
            }}
        >
            <ExpandMoreOutlinedIcon sx={{ color: "#9CA3AF" }} fontSize="small" />
        </div>
    );
};

// Fixed-height, scrollable menu list with DIRECTION-AWARE bottom detection.
// Only fires onLoadMore when the user scrolls DOWN and hits the bottom —
// scrolling up never triggers it, and content-reflow after a new page
// loads won't false-trigger either since we track lastScrollTop.
const MENU_LIST_HEIGHT = 130;
const BOTTOM_THRESHOLD = 8;

const makeMenuList = (
    onLoadMore: (() => void) | undefined,
    hasMore: boolean,
    loadingMore: boolean
) => {
    return function CustomMenuList(props: MenuListProps<AutocompleteOption, boolean>) {
        const lastScrollTop = useRef(0);
        const firedRef = useRef(false); // prevents duplicate fires while still at bottom

        const handleScroll = useCallback(
            (e: React.UIEvent<HTMLDivElement>) => {
                const el = e.currentTarget;
                const currentScrollTop = el.scrollTop;
                const scrollingDown = currentScrollTop > lastScrollTop.current;
                lastScrollTop.current = currentScrollTop;

                const atBottom =
                    el.scrollHeight - el.scrollTop - el.clientHeight <=
                    BOTTOM_THRESHOLD;

                if (!atBottom) {
                    // left the bottom zone — allow next bottom-hit to fire again
                    firedRef.current = false;
                    return;
                }

                // only trigger when arriving at bottom via a DOWNWARD scroll,
                // not while sitting there after an upward scroll or reflow
                if (scrollingDown && atBottom && !firedRef.current) {
                    if (hasMore && !loadingMore && onLoadMore) {
                        firedRef.current = true;
                        onLoadMore();
                    }
                }
            },
            [hasMore, loadingMore, onLoadMore]
        );

        return (
            <components.MenuList
                {...props}
                innerProps={{
                    ...props.innerProps,
                    onScroll: handleScroll,
                    style: {
                        maxHeight: MENU_LIST_HEIGHT,
                        overflowY: "auto",
                    },
                }}
            >
                {props.children}
            </components.MenuList>
        );
    };
};

const AutocompleteField: React.FC<SelectFieldProps> = ({
    label,
    value,
    options,
    onChange,
    placeholder = "Select",
    required,
    optional,
    error,
    multiple = false,
    disabled,
    onSearch,
    onLoadMore,
    hasMore = false,
    loadingMore = false,
    isLoading = false,
    searchDebounceMs = 300,
}) => {
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const handleInputChange = (
        newInput: string,
        meta: { action: string }
    ) => {
        if (meta.action !== "input-change") return;
        if (!onSearch) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch(newInput);
        }, searchDebounceMs);
    };

    const selectedValue = multiple
        ? Array.isArray(value)
            ? value
            : []
        : Array.isArray(value)
            ? null
            : value;

    // memoized per hasMore/loadingMore/onLoadMore so the closure stays fresh
    const MenuListComponent = React.useMemo(
        () => makeMenuList(onLoadMore, hasMore, loadingMore),
        [onLoadMore, hasMore, loadingMore]
    );

    return (
        <Box sx={styles.root}>
            <FormLabel
                label={label}
                required={required}
                optional={optional}
                sxText={{
                    fontWeight: 600,
                    fontSize: 14,
                }}
            />

            <Select<AutocompleteOption, boolean>
                isMulti={multiple}
                options={options}
                value={selectedValue}
                onChange={(newValue) =>
                    onChange(
                        newValue as
                        | AutocompleteOption
                        | AutocompleteOption[]
                        | null
                    )
                }
                onInputChange={handleInputChange}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                filterOption={onSearch ? () => true : undefined}
                isLoading={isLoading}
                isDisabled={disabled}
                isClearable={!multiple}
                closeMenuOnSelect={!multiple}
                hideSelectedOptions={false}
                controlShouldRenderValue={!multiple}
                placeholder={placeholder}
                noOptionsMessage={() => "No options"}
                loadingMessage={() => "Loading..."}
                components={{
                    DropdownIndicator,
                    MenuList: MenuListComponent,
                }}
                styles={getSelectStyles(error, disabled)}
                menuPortalTarget={document.body}
            />

            {multiple &&
                Array.isArray(value) &&
                value.length > 0 && (
                    <Box
                        sx={{
                            mt: 1,
                            gap: 1,
                            display: "flex",
                            flexWrap: "wrap",
                        }}
                    >
                        {(showAll ? value : value.slice(0, 2)).map((item) => (
                            <Chip
                                key={item.value}
                                label={item.label}
                                sx={styles.chipSx}
                                onDelete={() =>
                                    onChange(
                                        value.filter(
                                            (v) => v.value !== item.value
                                        )
                                    )
                                }
                            />
                        ))}

                        {value.length > 2 && (
                            <Chip
                                label={
                                    showAll
                                        ? "Less"
                                        : `+${value.length - 2} More`
                                }
                                sx={styles.chipSx}
                                onClick={() =>
                                    setShowAll((prev) => !prev)
                                }
                            />
                        )}
                    </Box>
                )}

            <FieldError message={error} />
        </Box>
    );
};

export default AutocompleteField;