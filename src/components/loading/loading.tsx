import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingProps {
    message?: string;
}

export const Loading = ({
    message = "Please wait...",
}: LoadingProps) => {
    return (
        <Box
            sx={{
                position: "absolute",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                // Frosted overlay
                background:
                    "linear-gradient(rgba(248,250,252,0.55), rgba(248,250,252,0.75))",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                borderRadius: "inherit",
            }}
        >
            <Box
                sx={{
                    minWidth: 180,
                    px: 4,
                    py: 3,
                    borderRadius: "20px",

                    // Glass Card
                    bgcolor: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(255,255,255,0.7)",

                    boxShadow:
                        "0 20px 50px rgba(15,23,42,0.12), 0 8px 24px rgba(15,23,42,0.08)",

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <CircularProgress
                    size={42}
                    thickness={4}
                    sx={{
                        color: "primary.main",
                    }}
                />

                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: "#475467",
                        letterSpacing: 0.2,
                    }}
                >
                    {message}
                </Typography>
            </Box>
        </Box>
    );
};