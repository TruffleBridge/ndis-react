import React, { useMemo } from "react";
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
}

const BORDER = "#EEEEEE";
const PRIMARY = "#047481";

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
    title = "Core Feature Permissions",
    actions,
    permissions,
    onChange,
    disabled = false,
    mainSx,
}) => {
    const isAllSelected = useMemo(() => {
        if (!permissions.length) return false;

        return permissions.every((row) =>
            actions.every((action) => row.permissions[action])
        );
    }, [permissions, actions]);

    const handleSelectAll = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = event.target.checked;

        const updated = permissions.map((row) => ({
            ...row,
            permissions: actions.reduce(
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
                            />
                            {actions.map((action) => (
                                <TableCell
                                    key={action}
                                    align="center"
                                    sx={{
                                        borderBottom: `1px solid ${BORDER}`,
                                        fontSize: 14,
                                        color: "#222124",
                                        fontWeight: 400,
                                        width: 90,
                                    }}
                                >
                                    {action}
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

                                {actions.map((action) => (
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
                                    colSpan={actions.length + 1}
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