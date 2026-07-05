import React from "react";
import {
    Popover,
    Box,
    Typography,
    Divider,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface AIInsightsPopoverProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    insightData: { text: string; value: string }[]
}

export const AIInsightsPopover = ({
    anchorEl,
    open,
    onClose,
    insightData,
}: AIInsightsPopoverProps) => {
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            slotProps={{
                paper: {
                    sx: {
                        background: "transparent",
                        overflow: "visible",
                        boxShadow: "none",
                    },
                },
            }}
        >
            {/* Gradient Border */}
            <Box
                sx={{
                    p: "2px",
                    borderRadius: "24px",
                    background: `
            linear-gradient(
              180deg,
              #AD95FB 0%,
              #5E40A6 26.5%,
              #FFC077 55.5%,
              #EB9481 73.5%,
              #C057DD 95.5%
            )
          `,
                    boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
                }}
            >
                {/* Content */}
                <Box
                    sx={{
                        width: '100%',
                        bgcolor: "#fff",
                        borderRadius: "22px",
                        p: 3,
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                    "linear-gradient(180deg,#AD95FB 0%,#FFC077 55%,#C057DD 100%)",
                                p: "2px",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    bgcolor: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <AutoAwesomeIcon
                                    sx={{
                                        color: "#A855F7",
                                        fontSize: 24,
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography
                                variant="h6"
                                component="h2"
                                sx={{ color: '#000 !important' }}
                            >
                                AI Insights
                            </Typography>

                            <Typography
                                variant="body1"
                                component="h2"
                                sx={{ color: '#999999 !important' }}
                            >
                                Generated Insights from your budget
                            </Typography>
                        </Box>
                    </Box>

                    {/* Insights */}
                    {insightData?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Typography
                                sx={{
                                    py: 2,
                                    fontSize: 16,
                                    color: "#666",
                                    lineHeight: 1.5,
                                }}
                            >
                                {item.text}{" "}
                                <Box
                                    component="span"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#1F1F1F",
                                    }}
                                >
                                    {item.value}
                                </Box>
                            </Typography>

                            {index !== insightData.length - 1 && (
                                <Divider sx={{ borderColor: "#ECECEC" }} />
                            )}
                        </React.Fragment>
                    ))}
                </Box>
            </Box>
        </Popover>
    );
}