// src/pages/admin/auditLogs/components/UserHistoryDrawer.tsx
import React, { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Stack,
    Chip,
    CircularProgress,
    Avatar,
    Divider,
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
    timelineOppositeContentClasses,
} from "@mui/lab";

import { useAuditStore } from "@/store/auditStore";

const ACTION_COLOR: Record<string, "success" | "info" | "error" | "grey"> = {
    CREATE: "success",
    UPDATE: "info",
    DELETE: "error",
};

const DEFAULT_LIMIT = 20;

interface UserHistoryDrawerProps {
    open: boolean;
    userId: number | null;
    onClose: () => void;
}

const formatDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
};

const initials = (name: string) =>
    name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

export const UserHistoryDrawer: React.FC<UserHistoryDrawerProps> = ({
    open,
    userId,
    onClose,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        userHistory,
        userHistoryLoading,
        userHistoryError,
        userHistoryTotalPages,
        fetchUserHistory,
    } = useAuditStore();

    const [page, setPage] = useState(1);
    const limit = DEFAULT_LIMIT;

    // Reset to page 1 whenever a new user is opened
    useEffect(() => {
        if (open) {
            setPage(1);
        }
    }, [open, userId]);

    useEffect(() => {
        if (open && userId != null) {
            fetchUserHistory(userId, page, limit);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, userId, page, limit]);

    const primaryActor = userHistory[0];

    const totalPages = typeof userHistoryTotalPages === "string"
        ? parseInt(userHistoryTotalPages, 10) || 1
        : (userHistoryTotalPages as any)?.totalPages ?? 1;

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
            <Box sx={{ p: { xs: 2, sm: 3 }, flexShrink: 0, bgcolor: "background.paper" }}>
                <Stack direction="row" sx={{
                    justifyContent: "space-between", alignItems: "center"
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        User Activity
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>

                {primaryActor && (
                    <Stack direction="row" spacing={1.5} sx={{ my: 2, alignItems: 'center' }}>
                        <Avatar>{initials(primaryActor.actorName)}</Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {primaryActor.actorName}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {primaryActor.actorEmail}
                            </Typography>
                        </Box>
                    </Stack>
                )}

                <Divider />
            </Box>

            {/* Scrollable Body */}
            <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
                {userHistoryLoading && (
                    <Stack sx={{ py: 4, alignItems: "center" }}>
                        <CircularProgress size={28} />
                    </Stack>
                )}

                {!userHistoryLoading && userHistoryError && (
                    <Typography variant="body2" sx={{ color: "error.main" }}>
                        {userHistoryError}
                    </Typography>
                )}

                {!userHistoryLoading && !userHistoryError && userHistory.length === 0 && (
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        No activity found for this user.
                    </Typography>
                )}

                {!userHistoryLoading && userHistory.length > 0 && (
                    <Timeline
                        sx={{
                            p: 0,
                            [`& .${timelineOppositeContentClasses.root}`]: {
                                display: "none",
                            },
                        }}
                    >
                        {userHistory.map((item, idx) => (
                            <TimelineItem key={item.id}>
                                <TimelineSeparator>
                                    <TimelineDot color={ACTION_COLOR[item.action] ?? "grey"} />
                                    {idx < userHistory.length - 1 && <TimelineConnector />}
                                </TimelineSeparator>
                                <TimelineContent sx={{ pb: 3 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary", display: "block" }}
                                    >
                                        {formatDate(item.changedAt)}
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ mt: 0.25, mb: 0.5, flexWrap: "wrap", rowGap: 0.5, alignItems: "center" }}
                                    >
                                        <Chip
                                            label={item.action}
                                            size="small"
                                            sx={{
                                                color: ACTION_COLOR[item.action] ?? "default"
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {item.entityType}
                                        </Typography>
                                    </Stack>

                                    {item.changes && item.changes.length > 0 ? (
                                        item.changes.map((change, cIdx) => (
                                            <Box key={cIdx} sx={{ mt: 0.5 }}>
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {change.fieldLabel || change.fieldName}
                                                </Typography>
                                                <Stack
                                                    direction={{ xs: "column", sm: "row" }}
                                                    spacing={{ xs: 0.25, sm: 1 }}
                                                    sx={{
                                                        justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }
                                                    }}
                                                >
                                                    <Typography variant="body2">{change.oldValue}</Typography>
                                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                        →
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {change.newValue}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            {item.entityLabel}
                                        </Typography>
                                    )}
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                )}
            </Box>

            {/* Fixed Pagination Footer */}
            {!userHistoryLoading && !userHistoryError && userHistory.length > 0 && (
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
                        count={totalPages}
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