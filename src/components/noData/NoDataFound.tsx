import { Box, Typography } from "@mui/material";

interface NoDataFoundProps {
    message?: string;
    subTitle?: string
}

const style = {
    boxShadow:
        "0px 1px 3px rgba(0,0,0,0.04), 0px 12px 32px rgba(0,0,0,0.08)",
    borderRadius: "12px",
    minHeight: {
        xs: "250px",
        sm: "270px",
        md: "320px",
    },
    maxHeight: "600px",
    height: {
        xs: "40vh",
        sm: "45vh",
        md: "56vh",
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    flexDirection: 'column',
    gap: 1
}
export const NoDataFound = ({
    message = "No data found",
    subTitle = ''
}: NoDataFoundProps) => {
    return (
        <Box
            sx={style}
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
            <Typography sx={{
                color: "#6B7280",
                fontSize: {
                    xs: 12,
                    sm: 14,
                },
                fontWeight: 400,
            }}>{subTitle}</Typography>
        </Box>
    );
}