import React from "react";
import { Popover, Box, Typography, Divider, IconButton, Badge } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { NotificationData } from "@/types/notification";
import { InfiniteScrollList } from "@/components";
import NotificationItem from "./notificationitem";
import { NotificationIcon } from "@/assets";

export interface NotificationDropdownProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    notifications: NotificationData[];
    loading: boolean;
    hasMore: boolean;
    unreadCount?: number;
    onLoadMore: () => void;
    onNotificationClick?: (notification: NotificationData) => void;
    /** Optional custom renderer to override default NotificationItem design */
    renderNotificationItem?: (
        notification: NotificationData,
        onClick?: (n: NotificationData) => void
    ) => React.ReactNode;
    width?: number;
    listHeight?: number;
}

/**
 * Notification UI only — displays data, delegates pagination/scroll
 * behaviour entirely to the generic InfiniteScrollList.
 */
const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    anchorEl,
    open,
    onClose,
    notifications,
    loading,
    hasMore,
    unreadCount,
    onLoadMore,
    onNotificationClick,
    renderNotificationItem,
    width = 360,
    listHeight = 420,
}) => {

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{ paper: { style: { width, maxHeight: 420, overflow: "hidden" } } }}
        >
            <Box
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                }}
            >
                <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                    Notifications {unreadCount ? `(${unreadCount})` : ""}
                </Typography>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
            <Divider />

            <InfiniteScrollList<NotificationData>
                items={notifications}
                keyExtractor={(item) => item.id}
                onLoadMore={onLoadMore}
                hasMore={hasMore}
                loading={loading}
                height={listHeight}
                renderItem={(item) =>
                    renderNotificationItem ? (
                        renderNotificationItem(item, onNotificationClick)
                    ) : (
                        <NotificationItem notification={item} onClick={onNotificationClick} />
                    )
                }
            />
        </Popover>
    );
};

export default NotificationDropdown;

/** Small helper bell-icon button, exported for convenience (optional to use). */
export const NotificationBellButton: React.FC<{
    unreadCount?: number;
    onClick: (e: React.MouseEvent<HTMLElement>) => void;
}> = ({ unreadCount = 100, onClick }) => (
    <IconButton onClick={onClick} sx={{
        "&:hover": {
            bgcolor: 'transparent'
        }
    }}>
        <Badge badgeContent={unreadCount}
            invisible={false}
            sx={{
                "& .MuiBadge-badge": {
                    height: 22,
                    width: 32,
                    fontSize: 12,
                    top: "0",
                    left: 0,
                    bgcolor: 'error.main',
                    color: "primary.contrastText"
                },
            }}>
            <NotificationIcon />
        </Badge>
    </IconButton>
);