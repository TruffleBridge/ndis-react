import type { SxProps, Theme } from "@mui/material";

export const VerifyStyles: Record<string, SxProps<Theme>> = {
    mainSx: {
        backgroundColor: "#EFEFEF",
        padding: "6px",
        borderRadius: "50px",
        display: "flex",
        gap: 1,
        width: "fit-content",
        marginBottom: 2,
    },
    avatarSx: {
        width: 32,
        height: 32,
        bgcolor: "#E5E7EB",
        color: "#374151",
        fontSize: 14,
    }
}
type ButtonType = "client" | "worker";

export const cta = (
    selected: ButtonType,
    type: ButtonType
) => ({
    minWidth: 140,
    height: 36,
    borderRadius: "50px",
    textTransform: "none",
    fontSize: 14,
    fontWeight: 500,

    color:
        selected === type
            ? "#FFFFFF"
            : "#6F6F6F",

    backgroundColor:
        selected === type
            ? "primary.main"
            : "transparent",

    "&:hover": {
        backgroundColor:
            selected === type
                ? "primary.main"
                : "transparent",
    },
});