import React from "react";
import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

const TONE_MAP: Record<string, { color: ChipProps["color"] }> = {
  Open: { color: "success" },
  Paid: { color: "success" },
  Completed: { color: "success" },
  Present: { color: "success" },

  Pending: { color: "warning" },
  Partial: { color: "warning" },
  Late: { color: "warning" },

  Rejected: { color: "error" },
  Cancelled: { color: "error" },
  Absent: { color: "error" },
  Failed: { color: "error" },

  "In Progress": { color: "info" },
  Closed: { color: "default" },
};

interface StatusBadgeProps {
  status: string;
  size?: ChipProps["size"];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "small" }) => {
  const tone = TONE_MAP[status] ?? { color: "default" as ChipProps["color"] };
  return (
    <Chip
      label={status}
      color={tone.color}
      size={size}
      variant="filled"
      sx={{ fontWeight: 600, borderRadius: "8px" }}
    />
  );
};
