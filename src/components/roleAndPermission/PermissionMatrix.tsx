import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    type SxProps,
    type Theme,
} from "@mui/material";
import { RoleCheckedboxIcon, RolesCheckboxIcon } from "@/assets";
import FieldError from "@/components/fieldError/fieldError";
import { DragIndicatorTwoTone } from "@mui/icons-material";

export interface PermissionRow {
    module: string;
    moduleId?: number; // maps this row back to the actual module for the API payload
    permissions: Record<string, boolean>;
}

interface PermissionMatrixProps {
    title?: string;
    actions: string[];
    permissions: PermissionRow[];
    onChange: (rows: PermissionRow[]) => void;
    disabled?: boolean;
    mainSx?: SxProps<Theme>;
    errors?: string;
    /** localStorage key used to persist the drag-reordered column order.
     *  Pass a unique key if you render more than one PermissionMatrix with
     *  different action sets on the same page. */
    storageKey?: string;
}

const BORDER = "#EEEEEE";
const PRIMARY = "#047481";
const DEFAULT_STORAGE_KEY = "permission_matrix_action_order";

/**
 * Call this from your logout handler so the saved column order doesn't
 * persist into the next session / a different user.
 *
 *   import { clearPermissionMatrixColumnOrder } from "@/components/PermissionMatrix";
 *   const handleLogout = () => {
 *       clearPermissionMatrixColumnOrder();
 *       // ...rest of logout logic (clear tokens, redirect, etc.)
 *   };
 */
export const clearPermissionMatrixColumnOrder = (
    storageKey: string = DEFAULT_STORAGE_KEY
) => {
    try {
        localStorage.removeItem(storageKey);
    } catch {
        // ignore (e.g. localStorage unavailable)
    }
};

const getStoredOrder = (storageKey: string): string[] | null => {
    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

const saveOrder = (storageKey: string, order: string[]) => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(order));
    } catch {
        // ignore
    }
};

// Keep stored order for actions that still exist, append any new actions
// at the end, drop any stale/unknown ones.
const reconcileOrder = (actions: string[], stored: string[] | null): string[] => {
    if (!stored || !stored.length) return [...actions];
    const known = stored.filter((a) => actions.includes(a));
    const missing = actions.filter((a) => !known.includes(a));
    return [...known, ...missing];
};

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
    title = "Core Feature Permissions",
    actions,
    permissions,
    onChange,
    disabled = false,
    mainSx,
    errors = '',
    storageKey = DEFAULT_STORAGE_KEY,
}) => {
    const [orderedActions, setOrderedActions] = useState<string[]>(() =>
        reconcileOrder(actions, getStoredOrder(storageKey))
    );
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Re-reconcile if the parent's action list changes (new module, etc.)
    useEffect(() => {
        setOrderedActions((prev) => {
            const stillValid =
                prev.length === actions.length && prev.every((a) => actions.includes(a));
            return stillValid ? prev : reconcileOrder(actions, getStoredOrder(storageKey));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, storageKey]);

    const isAllSelected = useMemo(() => {
        if (!permissions.length) return false;

        return permissions.every((row) =>
            orderedActions.every((action) => row.permissions[action])
        );
    }, [permissions, orderedActions]);

    const handleSelectAll = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = event.target.checked;

        const updated = permissions.map((row) => ({
            ...row,
            permissions: orderedActions.reduce(
                (acc, action) => ({
                    ...acc,
                    [action]: checked,
                }),
                {} as Record<string, boolean>
            ),
        }));

        onChange(updated);
    };

    const handlePermissionChange = (
        rowIndex: number,
        action: string,
        checked: boolean
    ) => {
        const updated = [...permissions];

        updated[rowIndex] = {
            ...updated[rowIndex],
            permissions: {
                ...updated[rowIndex].permissions,
                [action]: checked,
            },
        };

        onChange(updated);
    };

    // ---- Drag & drop column reordering ----
    const handleDragStart =
        (index: number) => (e: React.DragEvent<HTMLTableCellElement>) => {
            if (disabled) return;
            setDragIndex(index);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", String(index)); // needed for Firefox
        };

    const handleDragEnter =
        (index: number) => (e: React.DragEvent<HTMLTableCellElement>) => {
            if (disabled || dragIndex === null) return;
            e.preventDefault();
            if (index !== dragOverIndex) setDragOverIndex(index);
        };

    const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
        if (disabled) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop =
        (index: number) => (e: React.DragEvent<HTMLTableCellElement>) => {
            if (disabled) return;
            e.preventDefault();

            if (dragIndex === null || dragIndex === index) {
                setDragIndex(null);
                setDragOverIndex(null);
                return;
            }

            setOrderedActions((prev) => {
                const next = [...prev];
                const [moved] = next.splice(dragIndex, 1);
                next.splice(index, 0, moved);
                saveOrder(storageKey, next); // persist new order
                return next;
            });

            setDragIndex(null);
            setDragOverIndex(null);
        };

    const handleDragEnd = () => {
        setDragIndex(null);
        setDragOverIndex(null);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                border: `1px solid ${BORDER}`,
                borderRadius: "10px",
                borderTop: 'none',
                overflow: "hidden",
                ...mainSx,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    height: 48,
                    background: '#EBEBEB',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderLeft: 'none',
                    borderRight: 'none',
                    px: 2,
                }}
            >
                <Typography
                    sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#222124",
                    }}
                >
                    {title}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#222124",
                        }}
                    >
                        Select All
                    </Typography>

                    <Checkbox
                        checked={isAllSelected}
                        disabled={disabled || !permissions.length}
                        onChange={handleSelectAll}
                        size="small"
                        checkedIcon={<RoleCheckedboxIcon />}
                        icon={<RolesCheckboxIcon />}
                        sx={{
                            p: 0,
                            color: "#CBD5E1",
                            "&.Mui-checked": {
                                color: PRIMARY,
                            },
                        }}
                    />
                </Box>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    width: "42%",
                                    borderBottom: `1px solid ${BORDER}`,
                                    fontWeight: 500,
                                    color: "#6B7280",
                                }}
                            >
                                <FieldError message={errors} />
                            </TableCell>
                            {permissions?.length > 0 && orderedActions.map((action, index) => (
                                <TableCell
                                    key={action}
                                    align="center"
                                    draggable={!disabled}
                                    onDragStart={handleDragStart(index)}
                                    onDragEnter={handleDragEnter(index)}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop(index)}
                                    onDragEnd={handleDragEnd}
                                    sx={{
                                        borderBottom: `1px solid ${BORDER}`,
                                        fontSize: 14,
                                        color: "#222124",
                                        fontWeight: 400,
                                        width: 90,
                                        cursor: disabled ? "default" : "grab",
                                        userSelect: "none",
                                        transition: "background-color 0.15s ease",
                                        bgcolor:
                                            dragOverIndex === index && dragIndex !== index
                                                ? "#DCEFEF"
                                                : "transparent",
                                        opacity: dragIndex === index ? 0.5 : 1,
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <DragIndicatorTwoTone fontSize="small" sx={{ fontSize: 16, color: '#64748B' }} /> {action}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {permissions.map((row, rowIndex) => (
                            <TableRow key={row.moduleId ?? row.module} hover sx={{
                                "& MuiTableRow-root.MuiTableRow-hover:hover": {
                                    bgcolor: '#EEEEEE',
                                    py: 2
                                }
                            }}>
                                <TableCell
                                    sx={{
                                        borderBottom: `1px solid ${BORDER}`,
                                        fontSize: 14,
                                        color: "#222124",
                                        py: 1.8,
                                    }}
                                >
                                    {row.module}
                                </TableCell>

                                {orderedActions.map((action) => (
                                    <TableCell
                                        key={action}
                                        align="center"
                                        sx={{
                                            borderBottom: `1px solid ${BORDER}`,
                                        }}
                                    >
                                        <Checkbox
                                            disabled={disabled}
                                            checked={!!row.permissions[action]}
                                            checkedIcon={<RoleCheckedboxIcon />}
                                            icon={<RolesCheckboxIcon />}
                                            onChange={(e) =>
                                                handlePermissionChange(
                                                    rowIndex,
                                                    action,
                                                    e.target.checked
                                                )
                                            }
                                            size="small"
                                            sx={{
                                                p: 0,
                                                color: "#D1D5DB",

                                                "&.Mui-checked": {
                                                    color: PRIMARY,
                                                },

                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 20,
                                                },
                                            }}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                        {!permissions.length && (
                            <TableRow>
                                <TableCell
                                    colSpan={orderedActions.length + 1}
                                    align="center"
                                    sx={{
                                        py: 5,
                                        color: "#9CA3AF",
                                    }}
                                >
                                    Select an access module to configure permissions
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

        </Paper>
    );
};

export default PermissionMatrix;