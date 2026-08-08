import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function NotFound() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                textAlign: "center",
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    fontWeight: 700,
                    color: "text.primary",
                }}
            >
                404
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    color: "text.secondary",
                }}
            >
                Page not found.
            </Typography>

            <Button
                component={Link}
                to={'/'}
                variant="contained"
                sx={{
                    textTransform: "none",
                }}
            >
                Back to Home Page
            </Button>
        </Box>
    );
}