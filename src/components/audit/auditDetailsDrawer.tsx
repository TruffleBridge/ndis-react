// src/pages/admin/auditLogs/components/AuditDetailsDrawer.tsx
import React from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Stack,
    Chip,
    Divider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


import type { AuditLogItem } from "@/types/audit";

const ACTION_COLOR: Record<string, "success" | "info" | "error" | "default"> = {
    CREATE: "success",
    UPDATE: "info",
    DELETE: "error",
};

interface AuditDetailsDrawerProps {
    open: boolean;
    log: AuditLogItem | null;
    onClose: () => void;
    onViewEntityHistory: (entityType: string, entityId: number) => void;
    onViewUserHistory: (userId: number) => void;
}

const formatDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
    label,
    value,
}) => (
    <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 0.25, sm: 1 }}
        sx={{ py: 0.5 }}
    >
        <Typography
            variant="body2"
            sx={{ color: "text.secondary", width: { sm: 140 }, flexShrink: 0 }}
        >
            {label && label || '-'}
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
            {value && value || '-'}
        </Typography>
    </Stack>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography
        variant="subtitle2"
        sx={{
            mt: 2,
            mb: 1,
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: 12,
            color: "text.secondary",
        }}
    >
        {children}
    </Typography>
);

export const AuditDetailsDrawer: React.FC<AuditDetailsDrawerProps> = ({
    open,
    log,
    onClose,
    onViewEntityHistory,
    onViewUserHistory,
}) => {

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: { xs: "100%", sm: 420, md: 480 },
                    maxWidth: "100vw",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                },
            }}
        >
            {log && (
                <>
                    {/* Fixed Header */}
                    <Box
                        sx={{
                            p: { xs: 2, sm: 2 },
                            borderBottom: 1,
                            borderColor: "divider",
                            flexShrink: 0,
                            bgcolor: "background.paper",
                        }}
                    >
                        <Stack
                            direction="row"
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Audit Details
                            </Typography>

                            <IconButton onClick={onClose} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </Box>

                    {/* Scrollable Body Only */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            p: { xs: 2, sm: 2 },
                        }}
                    >
                        <SectionTitle>Entity Information</SectionTitle>
                        <InfoRow label="Entity Type" value={log.entityType} />
                        <InfoRow label="Entity ID" value={log.entityId} />
                        <InfoRow label="Entity Label" value={log.entityLabel} />

                        <Divider sx={{ my: 1.5 }} />

                        <SectionTitle>Actor Information</SectionTitle>
                        <InfoRow label="Name" value={log.actorName} />
                        <InfoRow label="Email" value={log.actorEmail} />
                        <InfoRow
                            label="Role"
                            value={<Chip label={log.actorRole} key={log?.actorUserId} size="small" />}
                        />

                        <Divider sx={{ my: 1.5 }} />

                        <SectionTitle>Action Details</SectionTitle>

                        <InfoRow
                            label="Action"
                            value={
                                <Chip
                                    label={log.action}
                                    size="small"
                                    color={ACTION_COLOR[log.action] ?? "default"}
                                />
                            }
                        />

                        <InfoRow label="Source" value={log.source} />
                        <InfoRow
                            label="Changed Date"
                            value={formatDate(log.changedAt)}
                        />

                        <Divider sx={{ my: 1.5 }} />

                        <SectionTitle>Changes</SectionTitle>

                        {log.changes && log.changes.length > 0 ? (
                            <Box sx={{ overflowX: "auto" }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Field</TableCell>
                                            <TableCell>Old Value</TableCell>
                                            <TableCell>New Value</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {log.changes.map((change, idx) => (
                                            <TableRow
                                                key={`${change.fieldName}-${idx}`}
                                            >
                                                <TableCell sx={{ whiteSpace: "nowrap" }}>
                                                    {change.fieldLabel ||
                                                        change.fieldName ||
                                                        "-"}
                                                </TableCell>

                                                <TableCell>
                                                    {change.oldValue || "-"}
                                                </TableCell>

                                                <TableCell>
                                                    <Typography sx={{ fontWeight: 600 }}>
                                                        {change.newValue || "-"}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        ) : (
                            <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                            >
                                No field-level changes recorded.
                            </Typography>
                        )}
                    </Box>

                    {/* Fixed Footer */}
                    <Box
                        sx={{
                            p: { xs: 2, sm: 2 },
                            borderTop: 1,
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            flexShrink: 0,
                        }}
                    >
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            sx={{
                                justifyContent: "space-between"
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={() =>
                                    onViewEntityHistory(
                                        log.entityType,
                                        log.entityId)
                                }
                                sx={{
                                    flex: 1,
                                }}
                            >
                                View Entity History
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    onViewUserHistory(log.actorUserId)
                                }
                                sx={{
                                    flex: 1,
                                }}
                            >
                                View User Activity
                            </Button>
                        </Stack>
                    </Box>
                </>
            )}
        </Drawer>
    );
};
