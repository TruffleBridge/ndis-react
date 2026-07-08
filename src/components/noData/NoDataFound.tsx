import { Box, Typography } from "@mui/material";

interface NoDataFoundProps {
    message?: string;
}

export const NoDataFound = ({
    message = "No data found",
}: NoDataFoundProps) => {
    return (
        <Box
            sx={{
                boxShadow:
                    "0px 1px 3px rgba(0,0,0,0.04), 0px 12px 32px rgba(0,0,0,0.08)",
                borderRadius: "12px",
                minHeight: {
                    xs: "250px",
                    sm: "300px",
                    md: "350px",
                },
                maxHeight: "600px",
                height: {
                    xs: "40vh",
                    sm: "45vh",
                    md: "50vh",
                },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                width: "100%",
            }}
        >
            <Typography
                sx={{
                    color: "#6B7280",
                    fontSize: {
                        xs: 14,
                        sm: 16,
                    },
                    fontWeight: 500,
                }}
            >
                {message}
            </Typography>
        </Box>
    );
}