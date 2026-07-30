import React from "react";
import { Box, ListItemButton, Typography, Avatar } from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import type { NotificationData } from "@/types/notification";

export interface NotificationItemProps {
    notification: NotificationData;
    onClick?: (notification: NotificationData) => void;
}

/** Pure display component — no data fetching, no scroll logic. */
const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onClick,
}) => {
    return (
        <ListItemButton
            onClick={() => onClick?.(notification)}
            style={{
                alignItems: "flex-start",
                gap: 12,
                backgroundColor: notification.isRead ? "transparent" : "#f5f5f5",
                borderBottom: "1px solid #e0e0e0",
            }}
        >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: "primary.light" }}>
                <CircleNotificationsIcon fontSize="small" />
            </Avatar>
            <Box style={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="subtitle2"
                    style={{ fontWeight: notification.isRead ? 500 : 600 }}
                >
                    {notification.title}
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        color: "#757575",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {notification.message}
                </Typography>
                <Typography variant="caption" style={{ color: "#bdbdbd" }}>
                    {new Date(notification.createdAt).toLocaleString()}
                </Typography>
            </Box>
        </ListItemButton>
    );
};

export default NotificationItem;