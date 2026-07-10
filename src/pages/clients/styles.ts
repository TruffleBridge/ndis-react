import type { SxProps, Theme } from "@mui/material";

export const ClientStyles: Record<string, SxProps<Theme>> = {
    sideMenu: {
        width: { xs: "100%", md: 240 },
        minWidth: { md: 240 },
        height: { xs: "auto", md: "68vh" },
        maxHeight: { xs: "none", md: "68vh" },
        overflow: "hidden",
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
        width: '100%',

    },
    rightSide: {
        flex: 1,
        minWidth: 0,
        height: { xs: "auto", md: "49.7vh", xl: '58vh', },
        maxHeight: { xs: "none", md: "55.7vh", xl: '58vh' },
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
    scrollArea: {
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        pr: 1,
        scrollbarGutter: "stable",
    },
    dateFieldGrid: {
        overflow: "visible",
        position: "relative",
        zIndex: 1,
    },
    svgSx: {
        color: "#3E4947",
        fontSize: 22,
    },
};
