import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

interface StatusChipProps {
  status?: string | null;
}

const getStatusConfig = (
  status: string,
): Pick<
  ChipProps,
  "color" | "variant"
> => {
  const value = status.toLowerCase();

  if (
    value.includes("paid") ||
    value.includes("active") ||
    value.includes("confirmed") ||
    value.includes("open") ||
    value.includes("completed")
  ) {
    return {
      color: "success",
      variant: "outlined",
    };
  }

  if (
    value.includes("pending") ||
    value.includes("waiting")
  ) {
    return {
      color: "warning",
      variant: "outlined",
    };
  }

  if (
    value.includes("cancel") ||
    value.includes("reject") ||
    value.includes("failed") ||
    value.includes("inactive")
  ) {
    return {
      color: "error",
      variant: "outlined",
    };
  }

  return {
    color: "default",
    variant: "outlined",
  };
};

export const StatusChip = ({
  status,
}: StatusChipProps) => {
  const label = status || "Not available";

  const config = getStatusConfig(label);

  return (
    <Chip
      label={label}
      size="small"
      color={config.color}
      variant={config.variant}
      sx={{
        height: 24,
        fontSize: "0.72rem",
        fontWeight: 700,
        borderRadius: 999,
        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
};
