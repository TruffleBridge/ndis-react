// src/pages/admin/auditLogs/components/EntityHistoryDrawer.tsx
import React, { useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Stack,
    Chip,
    CircularProgress,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
    timelineOppositeContentClasses,
} from "@mui/lab";

import { useAuditStore } from "@/store/auditStore";
import { ArrowDownwardOutlined, ArrowForwardOutlined } from "@mui/icons-material";

const ACTION_COLOR: Record<string, "success" | "info" | "error" | "grey"> = {
    CREATE: "success",
    UPDATE: "info",
    DELETE: "error",
};

interface EntityHistoryChange {
    fieldName: string;
    fieldLabel?: string;
    oldValue: string;
    newValue: string;
}

interface EntityHistoryItem {
    id: string | number;
    action: string;
    changedAt: string;
    actorName: string;
    changes?: EntityHistoryChange[];
}

interface EntityHistoryDrawerProps {
    open: boolean;
    entityType: string | null;
    entityId: number | null;
    onClose: () => void;
}

const formatDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
};

export const EntityHistoryDrawer: React.FC<EntityHistoryDrawerProps> = ({
    open,
    entityType,
    entityId,
    onClose,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { entityHistory, entityHistoryLoading, entityHistoryError, fetchEntityHistory } =
        useAuditStore();

    useEffect(() => {
        if (open && entityType && entityId != null) {
            fetchEntityHistory(entityType, entityId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, entityType, entityId]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: { xs: "100%", sm: 420, md: 480 },
                    maxWidth: "100vw",
                },
            }}
        >
            <Box sx={{ p: { xs: 2, sm: 3 }, height: "100%", overflowY: "auto" }}>
                <Stack direction="row" sx={{
                    justifyContent: "space-between", alignItems: "center"
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {entityType ?? "Entity"} History
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                    Entity ID: {entityId}
                </Typography>

                {entityHistoryLoading && (
                    <Stack sx={{ py: 4, alignItems: "center" }}>
                        <CircularProgress size={28} />
                    </Stack>
                )}

                {!entityHistoryLoading && entityHistoryError && (
                    <Typography variant="body2" sx={{ color: "error.main" }}>
                        {entityHistoryError}
                    </Typography>
                )}

                {!entityHistoryLoading && !entityHistoryError && entityHistory.length === 0 && (
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        No history records found for this entity.
                    </Typography>
                )}

                {!entityHistoryLoading && entityHistory.length > 0 && (
                    <Timeline
                        sx={{
                            p: 0,
                            width: '100%',
                            overflow: "auto",
                            ...(isMobile && {
                                [`& .${timelineOppositeContentClasses.root}`]: {
                                    display: "none",
                                },
                            }),
                        }}
                    >
                        {entityHistory?.map((item: EntityHistoryItem, idx: number) => (
                            <TimelineItem key={item.id}>
                                {!isMobile && (
                                    <TimelineOppositeContent
                                        variant="body2"
                                        sx={{ flex: 0.3, color: "text.secondary" }}
                                    >
                                        {formatDate(item.changedAt)}
                                    </TimelineOppositeContent>
                                )}
                                <TimelineSeparator>
                                    <TimelineDot color={ACTION_COLOR[item.action] ?? "grey"} />
                                    {idx < entityHistory.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent sx={{ pb: 3 }}>
                                    {isMobile && (
                                        <Typography
                                            variant="caption"
                                            sx={{ color: "text.secondary", display: "block" }}
                                        >
                                            {formatDate(item.changedAt)}
                                        </Typography>
                                    )}
                                    <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: "center" }}>
                                        <Chip
                                            label={item.action}
                                            size="small"
                                            sx={{
                                                color: ACTION_COLOR[item.action] ?? "default"
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            By {item.actorName}
                                        </Typography>
                                    </Stack>

                                    {item.changes?.map((change: EntityHistoryChange, cIdx: number) => (
                                        <Box key={cIdx} sx={{ mt: 0.5 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {change.fieldLabel || change.fieldName}
                                            </Typography>
                                            <Stack
                                                direction={{ xs: "column", sm: "row" }}
                                                spacing={{ xs: 0.25, sm: 1 }}
                                                sx={{
                                                    alignItems: { xs: "flex-start", sm: "center" }
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {change.oldValue}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {isMobile ? <ArrowDownwardOutlined /> : <ArrowForwardOutlined />}
                                                </Typography>
                                                <Typography variant="body2">{change.newValue}</Typography>
                                            </Stack>
                                        </Box>
                                    ))}
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                )}
            </Box>
        </Drawer >
    );
};
