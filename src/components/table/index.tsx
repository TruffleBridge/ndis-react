import React, { useState, useRef } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    Button,
    IconButton,
    Paper,
    Menu,
    MenuItem,
    Pagination,
    Typography,
    Checkbox,
    Divider,
    ClickAwayListener,
} from "@mui/material";
import type {
    SxProps,
    Theme,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { NoDataFound } from "../noData/NoDataFound";
import { Loading } from "../loading/loading";

//  Types 

export interface ColumnDef<T = Record<string, unknown>> {
    field?: keyof T;
    headerName: string;
    width?: number | string;
    headerSx?: SxProps<Theme>;
    cellSx?: SxProps<Theme>;
    render?: (value: unknown, row: T) => React.ReactNode;
}

export interface RowAction<T = Record<string, unknown>> {
    label: string;
    icon?: React.ReactNode;
    sx?: SxProps<Theme>;
    onClick: (row: T) => void;
}

export interface ColumnState {
    key: string;      // unique key (headerName)
    visible: boolean;
}

export interface TableComponentProps<T = Record<string, unknown>> {
    rows: T[];
    columns: ColumnDef<T>[];
    rowActions?: RowAction<T>[];

    totalPages?: number;
    currentPage?: number;

    searchValue?: string;
    searchPlaceholder?: string;
    showSearch?: boolean;
    showFilter?: boolean;
    showCustomizeTable?: boolean;
    showExport?: boolean;

    // Controlled column state from parent
    columnStates: ColumnState[];
    onColumnStatesChange: (next: ColumnState[]) => void;

    onSearch?: (value: string) => void;
    onFilter?: () => void;
    onExportData?: () => void;
    onPageChange?: (page: number) => void;
    onCustomChange?: () => void;
    customLabel?: string;
    isHasAction?: boolean;
    noData?: string
    isLoading?: boolean;
}

//  TableComponent 

export function TableComponent<T extends Record<string, unknown>>({
    rows,
    columns,
    rowActions,
    totalPages = 1,
    currentPage = 1,
    searchValue = "",
    searchPlaceholder = "Search here...",
    showSearch = true,
    showFilter = true,
    showCustomizeTable = true,
    showExport = true,
    customLabel = '',
    columnStates,
    onColumnStatesChange,
    onSearch,
    onFilter,
    onExportData,
    onPageChange,
    onCustomChange,
    isHasAction = false,
    noData = '',
    isLoading = false,
}: TableComponentProps<T>) {

    // ── Row context menu ──────────────────────────────────────────────────────
    const [menuState, setMenuState] = useState<{ anchor: HTMLElement; row: T } | null>(null);
    const openMenu = (e: React.MouseEvent<HTMLElement>, row: T) => setMenuState({ anchor: e.currentTarget, row });
    const closeMenu = () => setMenuState(null);
    const hasActions = rowActions && rowActions.length > 0;

    // ── Customize Table panel
    const [customizeOpen, setCustomizeOpen] = useState(false);

    const [draftStates, setDraftStates] = useState<ColumnState[]>([]);

    // Drag-to-reorder (operates on draftStates while panel is open)
    const dragIndexRef = useRef<number | null>(null);

    // Open panel → copy current columnStates into draft
    const handleOpenCustomize = () => {
        setDraftStates(columnStates.map((cs) => ({ ...cs })));
        setCustomizeOpen(true);
    };

    // Close without saving
    const handleCloseCustomize = () => {
        setCustomizeOpen(false);
    };

    // Apply draft → push to parent, close panel
    const handleApply = () => {
        onColumnStatesChange(draftStates);
        setCustomizeOpen(false);
    };

    // Show all columns (inside draft only)
    const handleShowAll = () => {
        setDraftStates((prev) => prev.map((cs) => ({ ...cs, visible: true })));
    };

    // Toggle a single column's visibility inside the draft
    const handleToggleVisible = (key: string) => {
        setDraftStates((prev) =>
            prev.map((cs) => (cs.key === key ? { ...cs, visible: !cs.visible } : cs))
        );
    };

    // Drag handlers (reorder within draft)
    const handleDragStart = (index: number) => {
        dragIndexRef.current = index;
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        const from = dragIndexRef.current;
        if (from === null || from === index) return;
        const next = [...draftStates];
        const [moved] = next.splice(from, 1);
        next.splice(index, 0, moved);
        dragIndexRef.current = index;
        setDraftStates(next);
    };

    const handleDragEnd = () => {
        dragIndexRef.current = null;
    };

    // Derive columns to render from the committed columnStates (not draft)
    const visibleColumns = columnStates
        .filter((cs) => cs.visible)
        .map((cs) => columns.find((col) => col.headerName === cs.key)!)
        .filter(Boolean);

    // ── Shared styles 
    const baseHeaderCellSx: SxProps<Theme> = {
        color: "#222124",
        fontWeight: 500,
        fontSize: "14px",
        py: 1.5,
        px: 2,
        whiteSpace: "nowrap",
        backgroundColor: "#F6F6F6",
    };

    const baseBodyCellSx: SxProps<Theme> = {
        px: 2,
        py: 1.5,
        fontSize: "14px",
        fontWeight: 400,
        color: "#222124",
        borderBottom: "1px solid #E5E7EB",

    };

    const toolbarBtnSx: SxProps<Theme> = {
        color: "#7F7F7F",
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

    const isStatusLast =
        visibleColumns?.find((v) => v?.field === "status")?.field;

    //  Render
    return (
        <Box sx={{
            boxShadow:
                "0px 1px 3px rgba(0,0,0,0.04), 0px 12px 32px rgba(0,0,0,0.08)",
            borderRadius: "12px",
        }}>
            <Paper
                elevation={0}
                sx={{
                    // border: "1px solid #E5E7EB",
                    borderTopLeftRadius: "12px !important",
                    borderTopRightRadius: "12px !important",
                    // overflow: "visible",
                    fontFamily: "'Inter', sans-serif",
                    py: 1,
                    borderRadius: 0
                    // mb: 2
                }}
            >
                {/* ── Toolbar ── */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "stretch", md: "center" },
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", md: "row" },
                        px: 2.5,
                        py: 1.75,
                        gap: 1.5,
                    }}
                >
                    {/* Left side */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", width: { xs: "100%", md: "auto" } }}>
                        {showSearch && (
                            <TextField
                                placeholder={searchPlaceholder}
                                size="small"
                                value={searchValue}
                                onChange={(e) => onSearch?.(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: "#9CA3AF", fontSize: 18 }} />
                                            </InputAdornment>
                                        ),
                                        // endAdornment: (
                                        //     <InputAdornment position="end">
                                        //         <Box sx={{ borderRadius: "4px", px: 0.75, py: 0.25, bgcolor: '#e5e7eb8c' }}>
                                        //             <Typography sx={{ fontSize: "0.7rem", color: "#7F7F7F" }}>⌘ K</Typography>
                                        //         </Box>
                                        //     </InputAdornment>
                                        // ),
                                    },
                                }}
                                sx={{
                                    width: { xs: "100%", sm: 220, md: 260 },
                                    minWidth: 0,
                                    flex: { xs: 1, md: "unset" },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        fontSize: "0.875rem",
                                        color: "#374151",
                                        borderColor: '#D0D5DD',
                                        "& fieldset": {
                                            borderColor: "#D0D5DD",
                                            borderWidth: '1.4px',
                                        },
                                        "& input::placeholder": {
                                            fontSize: "12px",
                                        },
                                        "&:hover fieldset": { borderColor: "#D1D5DB" },
                                        "&.Mui-focused fieldset": { borderColor: "#6B7280" },
                                    },
                                }}
                            />
                        )}

                        {showFilter && (
                            <Button
                                variant="outlined"
                                startIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
                                onClick={onFilter}
                                sx={toolbarBtnSx}
                            >
                                Filter
                            </Button>
                        )}
                    </Box>

                    {/* Right side */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, position: "relative", flexWrap: "wrap", width: { xs: "100%", md: "auto" } }}>

                        {/* ── Customize Table Button + Dropdown ── */}
                        {showCustomizeTable && (
                            <>
                                <Button
                                    variant="outlined"
                                    startIcon={<TableChartOutlinedIcon sx={{ fontSize: 16 }} />}
                                    endIcon={
                                        <KeyboardArrowDownIcon
                                            sx={{
                                                fontSize: 16,
                                                transition: "transform 0.2s",
                                                transform: customizeOpen ? "rotate(180deg)" : "rotate(0deg)",
                                            }}
                                        />
                                    }
                                    onClick={handleOpenCustomize}
                                    sx={{
                                        ...toolbarBtnSx,
                                        ...(customizeOpen ? { borderColor: "#6B7280", backgroundColor: "#F9FAFB" } : {}),
                                    }}
                                >
                                    Customize Table
                                </Button>

                                {/* ── Customize Dropdown Panel ── */}
                                {customizeOpen && (
                                    <ClickAwayListener onClickAway={handleCloseCustomize}>
                                        <Paper
                                            elevation={4}
                                            sx={{
                                                position: "absolute",
                                                top: "calc(100% + 8px)",
                                                // right: 0,
                                                zIndex: 1300,
                                                width: 260,
                                                borderRadius: "12px",
                                                border: "1px solid #E5E7EB",
                                                overflow: "hidden",
                                                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                                            }}
                                        >
                                            {/* Panel header */}
                                            <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #ECEFF5" }}>
                                                <Typography sx={{ fontWeight: 600, textAlign: 'start', fontSize: "14px", color: "#374151" }}>
                                                    Customize Columns
                                                </Typography>
                                            </Box>

                                            {/* Column list */}
                                            <Box sx={{ maxHeight: 320, overflowY: "auto", py: 0.5 }}>
                                                {draftStates.map((cs, index) => (
                                                    <Box
                                                        key={cs.key}
                                                        draggable
                                                        onDragStart={() => handleDragStart(index)}
                                                        onDragOver={(e) => handleDragOver(e, index)}
                                                        onDragEnd={handleDragEnd}
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 0.5,
                                                            px: 1.5,
                                                            py: 0.5,
                                                            cursor: "grab",
                                                            userSelect: "none",
                                                            "&:hover": { backgroundColor: "#F9FAFB" },
                                                            "&:active": { cursor: "grabbing" },
                                                        }}
                                                    >
                                                        {/* Drag handle */}
                                                        <DragIndicatorIcon sx={{ fontSize: 18, color: "#D1D5DB", flexShrink: 0 }} />

                                                        {/* Column label */}
                                                        <Typography
                                                            sx={{
                                                                flex: 1,
                                                                textAlign: 'start',
                                                                fontSize: "14px",
                                                                color: cs.visible ? "#374151" : "#9CA3AF",
                                                                fontWeight: cs.visible ? 500 : 400,
                                                            }}
                                                        >
                                                            {cs.key}
                                                        </Typography>

                                                        {/* Checkbox — changes draft only, not live table */}
                                                        <Checkbox
                                                            size="small"
                                                            checked={cs.visible}
                                                            onChange={() => handleToggleVisible(cs.key)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            sx={{
                                                                padding: "4px",
                                                                color: "#D1D5DB",
                                                                "&.Mui-checked": { color: "#111827" },
                                                            }}
                                                        />
                                                    </Box>
                                                ))}
                                            </Box>

                                            <Divider style={{ borderColor: '#ECEFF5' }} />

                                            {/* Panel footer */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    px: 2,
                                                    py: 1.25,
                                                    gap: 1,
                                                }}
                                            >
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    onClick={handleShowAll}
                                                    sx={{ textTransform: "capitalize", fontSize: "14px", color: "#6B7280" }}
                                                >
                                                    Show all
                                                </Button>

                                                {/* Apply commits draft → parent */}
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={handleApply}
                                                    sx={{ bgcolor: 'primary.main', color: '#fff', textTransform: "capitalize", fontSize: "14px", height: 34 }}
                                                >
                                                    Apply
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </ClickAwayListener>
                                )}
                            </>
                        )}

                        {showExport && (
                            <Button
                                variant="outlined"
                                startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
                                onClick={onExportData}
                                sx={toolbarBtnSx}
                            >
                                Export Data
                            </Button>
                        )}

                        {/* custom cta */}
                        {customLabel && (
                            <Button
                                variant="outlined"
                                startIcon={<AddOutlinedIcon sx={{ fontSize: 16 }} />}
                                onClick={onCustomChange}
                                sx={{
                                    ...toolbarBtnSx, color: '#FFFFFF', bgcolor: 'primary.main',
                                    borderColor: "none",
                                    "&:hover": { borderColor: "none", backgroundColor: "primary.main" },
                                }}
                            >
                                {customLabel}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>

            {isLoading ? (
                <Loading />
            ) : rows.length === 0 ? (
                <NoDataFound message="No verification records found" />
            ) : rows.length === 0 ? (
                <NoDataFound message={noData} />)
                : (<Box>
                    {/* ── Table ── */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: "2px",
                            // border: "1px solid #E5E7EB",
                            fontFamily: "'Inter', sans-serif",
                            height: '100%',
                            maxHeight: '335px',
                            overflow: 'auto'
                        }}
                    >

                        <Box sx={{
                            overflowX: "auto",
                            minHeight: 270,
                            "&::-webkit-scrollbar": {
                                height: 2, // horizontal scrollbar
                                width: 2,  // vertical scrollbar
                            },

                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#bdbdbd",
                                borderRadius: 10,
                            },

                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "#f5f5f5",
                            },
                        }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {visibleColumns.map((col, i) => (
                                            <TableCell
                                                key={i}
                                                sx={{
                                                    ...baseHeaderCellSx,
                                                    ...(col.width !== undefined ? { width: col.width, minWidth: col.width } : {}),
                                                    ...col.headerSx,
                                                    ...((isHasAction && isStatusLast) &&
                                                        col.field === "status" && {
                                                        borderLeft: "1px solid #FFFFFF",
                                                    }),
                                                }}
                                            >
                                                {col.headerName}
                                            </TableCell>
                                        ))}
                                        {hasActions && (
                                            <TableCell sx={{
                                                ...baseHeaderCellSx,
                                                ...(isHasAction && {
                                                    borderLeft: "1px solid #FFFFFF",
                                                }),
                                                width: 48, minWidth: 48
                                            }} />
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, rowIdx) => (
                                        <TableRow key={rowIdx} sx={{
                                            height: '100%', minHeight: '360px'
                                        }}>
                                            {visibleColumns.map((col, colIdx) => {
                                                const rawValue = col.field !== undefined ? row[col.field] : undefined;
                                                return (
                                                    <TableCell
                                                        key={colIdx}
                                                        sx={{
                                                            ...baseBodyCellSx,
                                                            ...(rowIdx === rows.length - 3 ? { borderBottom: 0 } : {}),
                                                            ...col.cellSx,
                                                            ...((isHasAction && isStatusLast) &&
                                                                col.field === "status" && {
                                                                borderLeft: "1px solid #E5E7EB",
                                                            }),
                                                        }}
                                                    >
                                                        {col.render
                                                            ? col.render(rawValue, row)
                                                            : (rawValue as React.ReactNode) ?? "—"}
                                                    </TableCell>
                                                );
                                            })}

                                            {hasActions && (
                                                <TableCell
                                                    sx={{
                                                        px: 1,
                                                        py: 1.5,
                                                        width: 48,
                                                        borderBottom: rowIdx === rows.length - 3 ? 0 : "1px solid #E5E7EB",
                                                        borderLeft: rowIdx === rows.length - 0 ? 0 : "1px solid #F3F4F6",
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => openMenu(e, row)}
                                                        sx={{ color: "#9CA3AF", "&:hover": { color: "#374151" } }}
                                                    >
                                                        <MoreVertIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Paper >

                    {/* ── Row Context Menu ── */}
                    {hasActions && (
                        <Menu
                            anchorEl={menuState?.anchor}
                            open={Boolean(menuState)}
                            onClose={closeMenu}
                            slotProps={{
                                paper: {
                                    elevation: 2,
                                    sx: {
                                        borderRadius: "10px",
                                        border: "1px solid #E5E7EB",
                                        minWidth: 140,
                                        "& .MuiMenuItem-root": {
                                            fontSize: "0.875rem",
                                            color: "#7F7F7F",
                                            gap: 1.25,
                                            py: 1,
                                            px: 2,
                                        },
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        >
                            {rowActions!.map((action, i) => (
                                <MenuItem
                                    key={i}
                                    sx={{
                                        ...action.sx,
                                        "&.MuiMenuItem-root": {
                                            fontSize: "12px",
                                            fontWeight: 500,
                                            color: "#7F7F7F"
                                        }
                                    }}
                                    onClick={() => {
                                        if (menuState) action.onClick(menuState.row);
                                        closeMenu();
                                    }}
                                >
                                    {action.icon}
                                    {action.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    )}

                    {/* ── Pagination ── */}
                    {
                        // totalPages > 1 && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                px: 2.5,
                                py: 1.5,
                                backgroundColor: "#FFFFFF",
                                borderTop: "1px solid #E5E7EB",
                                borderBottomLeftRadius: "12px",
                                borderBottomRightRadius: "12px",
                            }}
                        >
                            <Pagination
                                count={totalPages ? totalPages : 1}
                                page={currentPage}
                                onChange={(_, p) => onPageChange?.(p)}
                                siblingCount={1}
                                boundaryCount={1}
                                shape="rounded"
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        fontSize: "14px",
                                        color: "#b3abab",
                                        fontWeight: 400,
                                        minWidth: 34,
                                        height: 34,
                                        borderRadius: "8px",
                                        border: "none",
                                    },
                                    "& .MuiPaginationItem-root.Mui-selected": {
                                        backgroundColor: "#c9c2c2db",
                                        color: "#222124",
                                        fontSize: '14px',
                                        borderRadius: "8px",
                                        fontWeight: 600,
                                        "&:hover": { backgroundColor: "#c9c2c2db" },
                                    },
                                }}
                            />
                        </Box>
                        // )
                    }
                </Box>)}
        </Box>
    );
}