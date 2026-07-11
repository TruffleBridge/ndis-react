import type { SxProps, Theme } from "@mui/material";

export const WorkerStyles: Record<string, SxProps<Theme>> = {
    sideMenu: {
        width: { xs: "100%", md: 260 },
        minWidth: { md: 240 },
        height: {
            xs: "auto",
            sm: "auto",
            md: "calc(100vh - 180px)",
        },
        maxHeight: {
            xs: "none",
            md: "calc(100vh - 180px)",
        },
        overflowY: "auto",
        overflowX: "hidden",
        border: "1px solid #E2E8F0",
        p: 2,
        borderRadius: "14px",
        bgcolor: "#FFFFFF",
        boxShadow: "0px 8px 24px rgba(11,124,119,0.08)",
        flexShrink: 0,
    },

    rightSideMain: {
        bgcolor: "#FFFFFF",
        boxShadow: "0px 8px 24px rgba(11,124,119,0.08)",
        border: "1px solid #E2E8F0",
        px: { xs: 2, sm: 3 },
        py: 2,
        borderRadius: "14px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: {
            xs: "auto",
            md: "calc(100vh - 180px)",
        },
    },

    rightSide: {
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarGutter: "stable",
    },
    formLayout: {
        display: "flex",
        mt: 2,
        gap: 2,
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "flex-start" },
        width: "100%",
        minWidth: 0,
    },
    nextCta: {
        fontSize: "14px",
        fontWeight: 600,
        bgcolor: 'primary.main',
        color: "#FFFFFF",
        borderRadius: "8px",
        px: 2.5,
        py: "6px",
        textTransform: "none",
        height: 42,
        boxShadow: "none",
        minWidth: "130px",
        '&.Mui-disabled': {
            backgroundColor: 'currentColor',
        }
        // "&:hover": {
        //     bgcolor: (theme: Theme) => theme.palette.primary.dark,
        //     boxShadow: "none",
        // },
    },

    dateFieldGrid: {
        overflow: "visible",
        position: "relative",
        zIndex: 1,
    },
    mainHeightRes: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
    },
    subHeightRes: {
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        pr: 1,
        minHeight: 0,
    },
    bottomFixed: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        mt: 2,
        pt: 2,
        borderTop: "1px solid #E2E8F0",
        backgroundColor: "#fff",
        flexShrink: 0,
    }
};
