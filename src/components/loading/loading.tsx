import { Box, CircularProgress } from "@mui/material";

interface LoadingProps {
    height?: string | number;
}

export const Loading = ({
    // height = "300px",
}: LoadingProps) => {
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
            <CircularProgress
                size={40}
                sx={{
                    color: "#086D63",
                }}
            />
        </Box>
    );
}