// src/pages/admin/auditLogs/components/EntityHistoryDrawer.tsx
import React, { useEffect, useState } from "react";
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
    Pagination,
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

const DEFAULT_LIMIT = 10;

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

    const {
        entityHistory,
        entityHistoryLoading,
        entityHistoryError,
        entityHistoryTotalPages,
        fetchEntityHistory,
    } = useAuditStore();

    const [page, setPage] = useState(1);
    const limit = DEFAULT_LIMIT;

    // Reset to page 1 whenever a new entity is opened
    useEffect(() => {
        if (open) {
            setPage(1);
        }
    }, [open, entityType, entityId]);

    useEffect(() => {
        if (open && entityType && entityId != null) {
            fetchEntityHistory(entityType, entityId, page, limit);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, entityType, entityId, page, limit]);

const totalPages =
    typeof entityHistoryTotalPages === "string"
        ? Number.parseInt(entityHistoryTotalPages, 10) || 1
        : entityHistoryTotalPages;


    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

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
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {entityType ?? "Entity"} History
                    </Typography>

                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>

                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 1 }}
                >
                    Entity ID: {entityId}
                </Typography>
            </Box>

            {/* Scrollable Body */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: { xs: 2, sm: 3 },
                }}
            >
                {entityHistoryLoading && (
                    <Stack sx={{ py: 4, alignItems: "center" }}>
                        <CircularProgress size={28} />
                    </Stack>
                )}

                {!entityHistoryLoading && entityHistoryError && (
                    <Typography
                        variant="body2"
                        sx={{ color: "error.main" }}
                    >
                        {entityHistoryError}
                    </Typography>
                )}

                {!entityHistoryLoading &&
                    !entityHistoryError &&
                    entityHistory.length === 0 && (
                        <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                        >
                            No history records found for this entity.
                        </Typography>
                    )}

                {!entityHistoryLoading && entityHistory.length > 0 && (
                    <Timeline
                        sx={{
                            p: 0,
                            width: "100%",
                            ...(isMobile && {
                                [`& .${timelineOppositeContentClasses.root}`]: {
                                    display: "none",
                                },
                            }),
                        }}
                    >
                        {entityHistory.map(
                            (item: EntityHistoryItem, idx: number) => (
                                <TimelineItem key={item.id}>
                                    {!isMobile && (
                                        <TimelineOppositeContent
                                            variant="body2"
                                            sx={{
                                                flex: 0.3,
                                                color: "text.secondary",
                                            }}
                                        >
                                            {formatDate(item.changedAt)}
                                        </TimelineOppositeContent>
                                    )}

                                    <TimelineSeparator>
                                        <TimelineDot
                                            color={
                                                ACTION_COLOR[item.action] ??
                                                "grey"
                                            }
                                        />

                                        {idx < entityHistory.length - 1 && (
                                            <TimelineConnector />
                                        )}
                                    </TimelineSeparator>

                                    <TimelineContent sx={{ pb: 3 }}>
                                        {isMobile && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color:
                                                        "text.secondary",
                                                    display: "block",
                                                }}
                                            >
                                                {formatDate(item.changedAt)}
                                            </Typography>
                                        )}

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{
                                                mb: 0.5,
                                                alignItems: "center",
                                            }}
                                        >
                                            <Chip
                                                label={item.action}
                                                size="small"
                                                sx={{
                                                    color:
                                                        ACTION_COLOR[item.action] ?? "default"
                                                }}
                                            />

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color:
                                                        "text.secondary",
                                                }}
                                            >
                                                By {item.actorName}
                                            </Typography>
                                        </Stack>

                                        {item.changes?.map(
                                            (
                                                change: EntityHistoryChange,
                                                cIdx: number
                                            ) => (
                                                <Box
                                                    key={cIdx}
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {change.fieldLabel ||
                                                            change.fieldName}
                                                    </Typography>

                                                    <Stack
                                                        direction={{
                                                            xs: "column",
                                                            sm: "row",
                                                        }}
                                                        spacing={{
                                                            xs: 0.25,
                                                            sm: 1,
                                                        }}
                                                        sx={{
                                                            alignItems: {
                                                                xs: "flex-start",
                                                                sm: "center",
                                                            },
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color:
                                                                    "text.secondary",
                                                            }}
                                                        >
                                                            {change.oldValue}
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color:
                                                                    "text.secondary",
                                                            }}
                                                        >
                                                            {isMobile ? (
                                                                <ArrowDownwardOutlined />
                                                            ) : (
                                                                <ArrowForwardOutlined />
                                                            )}
                                                        </Typography>

                                                        <Typography variant="body2">
                                                            {change.newValue}
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            )
                                        )}
                                    </TimelineContent>
                                </TimelineItem>
                            )
                        )}
                    </Timeline>
                )}
            </Box>

            {/* Fixed Pagination Footer */}
            {!entityHistoryLoading && !entityHistoryError && entityHistory.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: { xs: "center", sm: "center" },
                        alignItems: "center",
                        gap: 1,
                        px: { xs: 1.5, sm: 2.5 },
                        py: 1.5,
                        backgroundColor: "#FFFFFF",
                        borderTop: "1px solid",
                        borderColor: "divider",
                        flexShrink: 0,
                    }}
                >
                    <Pagination
                        count={totalPages ?? undefined}
                        page={page}
                        onChange={handlePageChange}
                        siblingCount={isMobile ? 0 : 1}
                        boundaryCount={1}
                        shape="rounded"
                        size={isMobile ? "small" : "medium"}
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
                                fontSize: "14px",
                                borderRadius: "8px",
                                fontWeight: 600,
                                "&:hover": { backgroundColor: "#c9c2c2db" },
                            },
                        }}
                    />
                </Box>
            )}
        </Drawer>
    );
};