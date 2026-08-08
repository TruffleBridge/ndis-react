import React, { useEffect, useState } from "react";
import { useNotificationStore } from "@/store/useNotificationstore";
import NotificationDropdown, { NotificationBellButton } from "./Notification/notificationdropdown";

const NotificationParent: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const notifications = useNotificationStore((s) => s.notifications);
    const loading = useNotificationStore((s) => s.loading);
    const hasMore = useNotificationStore((s) => s.hasMore);
    const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
    const loadMore = useNotificationStore((s) => s.loadMore);
    const markAsRead = useNotificationStore((s) => s.markAsRead);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
        if (notifications.length === 0) fetchNotifications(true); // offset 0, limit 10
    };

    const handleClose = () => setAnchorEl(null);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        fetchNotifications(true)
    }, [])

    return (
        <>
            <NotificationBellButton unreadCount={unreadCount} onClick={handleOpen} />
            <NotificationDropdown
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                notifications={notifications}
                loading={loading}
                hasMore={hasMore}
                unreadCount={unreadCount}
                onLoadMore={loadMore}
                onNotificationClick={(n) => {
                    setAnchorEl(null);
                    markAsRead(n.id)
                }
                }
            />
        </>
    );
};

export default NotificationParent;