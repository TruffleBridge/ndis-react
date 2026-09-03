// src/screens/job-details/components/DetailCard.tsx

import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { alpha } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";
import LocationDetailsCard from "./LocationDetailsCard";

export interface DetailRow {
    label: string;
    value: React.ReactNode;
}

interface DetailCardProps {
    title: string;
    icon: SvgIconComponent;
    rows: DetailRow[];
    latitude?: number | any;
    longitude?: number | any;
}

const DetailCard: React.FC<DetailCardProps> = ({
    title,
    icon: Icon,
    rows,
    latitude,
    longitude,
}) => {
    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 2,
                textAlign: 'start',
                overflow: "hidden",
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2,
                        sm: 2.5,
                    },
                    "&:last-child": {
                        pb: {
                            xs: 2,
                            sm: 2.5,
                        },
                    },
                }}
            >
                <Stack
                    spacing={1.25}
                    sx={{
                        direction: "row",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 34,
                            height: 34,
                            bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                        }}
                    >
                        <Icon sx={{ fontSize: 19 }} />
                    </Avatar>

                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 700,
                            color: "text.primary",
                        }}
                    >
                        {title}
                    </Typography>
                </Stack>

                <Stack
                    divider={
                        <Divider
                            flexItem
                            sx={{
                                borderColor: "divider",
                            }}
                        />
                    }
                >
                    {rows.map((row, index) => (
                        <Box
                            key={`${row.label}-${index}`}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "minmax(110px, 42%) minmax(0, 1fr)",
                                    sm: "minmax(130px, 40%) minmax(0, 1fr)",
                                },
                                gap: 1.5,
                                alignItems: "start",
                                py: 1.15,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.secondary",
                                    fontWeight: 500,
                                    lineHeight: 1.5,
                                }}
                            >
                                {row.label}
                            </Typography>

                            <Box
                                sx={{
                                    minWidth: 0,
                                    textAlign: "right",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {typeof row.value === "string" ||
                                    typeof row.value === "number" ? (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "text.primary",
                                            fontWeight: 600,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {row.value}
                                    </Typography>
                                ) : (
                                    row.value
                                )}
                            </Box>
                        </Box>
                    ))}
                </Stack>
                {title === "Location Details" && (
                    <LocationDetailsCard
                        latitude={latitude ?? null}
                        longitude={longitude ?? null}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default DetailCard;