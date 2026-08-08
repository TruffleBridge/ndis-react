// hooks/useRowActions.tsx

import { DeleteIcon } from "@/assets";
import type { RowAction } from "@/components";
import {
    AutorenewOutlined,
    EditOutlined,
} from "@mui/icons-material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

interface UseRowActionsProps<T> {
    row: T;
    status: string;

    canView?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;

    onStatus?: (row: T) => void;
    onEdit?: (row: T) => void;
    onView?: (row: T) => void;
    onDelete?: (row: T) => void;
}

export const useRowActions = <T,>({
    status,
    canView,
    canUpdate,
    canDelete,
    onStatus,
    onEdit = () => null,
    onView = () => null,
    onDelete = () => null,
}: UseRowActionsProps<T>): RowAction<T>[] => {
    return [
        ...(onStatus
            ? [
                {
                    label: "Status",
                    icon: (
                        <AutorenewOutlined
                            sx={{
                                fontSize: 14,
                                color: "#7F7F7F",
                            }}
                        />
                    ),
                    onClick: (row: T) => onStatus(row),
                },
            ]
            : []),

        ...((status.toLowerCase() === "active" || canUpdate)
            ? [
                {
                    label: "Edit",
                    icon: (
                        <EditOutlined
                            sx={{
                                fontSize: 14,
                                color: "#7F7F7F",
                            }}
                        />
                    ),
                    onClick: (row: T) => onEdit(row),
                },
            ]
            : []),

        ...(canView
            ? [
                {
                    label: "View",
                    icon: (
                        <VisibilityOutlinedIcon
                            sx={{
                                fontSize: 14,
                                color: "#7F7F7F",
                            }}
                        />
                    ),
                    onClick: (row: T) => onView(row),
                },
            ]
            : []),

        ...(status.toLowerCase() === "active" && canDelete
            ? [
                {
                    label: "Delete",
                    icon: <DeleteIcon width={11} height={13} />,
                    sx: {
                        color: "#7F7F7F",
                    },
                    onClick: (row: T) => onDelete(row),
                },
            ]
            : []),
    ];
};