
import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

import { alpha } from "@mui/material/styles";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import type { JobSession } from "@/types/jobDetails";

interface SessionsCardProps {
    sessions: JobSession[];
}

const formatDate = (date?: string | null) => {
    if (!date) return "N/A";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(parsed);
};

const formatTime = (time?: string | null) => {
    if (!time) return "N/A";

    const [hourString, minute] = time.split(":");

    const hour = Number(hourString);

    if (Number.isNaN(hour)) {
        return time;
    }

    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${String(hour12).padStart(2, "0")}:${minute} ${suffix}`;
};

const SessionRow: React.FC<{
    session: JobSession;
    index: number;
}> = ({ session, index }) => {
    const sameDay = session.startDate === session.endDate;

    return (
        <Box
            sx={{
                p: {
                    xs: 1.5,
                    sm: 2,
                },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "#f5f6f8 !important",
            }}
        >
            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                spacing={{
                    xs: 1.5,
                    sm: 2,
                }}
                sx={{
                    justifyContent: "space-between"
                }}
            >
                <Stack
                    sx={{
                        direction: "row",
                        alignItems: "center"
                    }}
                    spacing={1}
                >
                    <Chip
                        label={`Session ${index + 1}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                            borderColor: 'custom.300',
                            fontWeight: 500,
                        }}
                    />


                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        {session?.dayName ?? '-'}
                    </Typography>
                </Stack>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={{
                        xs: 1,
                        sm: 2.5,
                    }}
                >
                    <Stack
                        sx={{
                            direction: "row",
                            alignItems: "center"
                        }}
                        spacing={0.75}
                    >
                        <EventAvailableOutlinedIcon
                            sx={{
                                fontSize: 18,
                                color: "primary.main",
                            }}
                        />

                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    color: "text.secondary",
                                }}
                            >
                                {sameDay ? "Date" : "Date Range"}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {sameDay
                                    ? formatDate(session.startDate)
                                    : `${formatDate(
                                        session.startDate
                                    )} - ${formatDate(session.endDate)}`}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack
                        sx={{
                            direction: "row",
                            alignItems: "center"
                        }}
                        spacing={0.75}
                    >
                        <AccessTimeOutlinedIcon
                            sx={{
                                fontSize: 18,
                                color: "primary.main",
                            }}
                        />

                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    color: "text.secondary",
                                }}
                            >
                                Time
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {formatTime(session.startTime)} -{" "}
                                {formatTime(session.endTime)}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

const SessionsCard: React.FC<SessionsCardProps> = ({
    sessions,
}) => {
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
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
                    sx={{
                        direction: "row",
                        alignItems: "center",
                        mb: 2,
                    }}
                    spacing={1.25}
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
                        <EventAvailableOutlinedIcon
                            sx={{
                                fontSize: 19,
                            }}
                        />
                    </Avatar>

                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            Schedule Summary
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {sessions.length}{" "}
                            {sessions.length === 1 ? "session" : "sessions"}
                        </Typography>
                    </Box>
                </Stack>

                {sessions.length === 0 ? (
                    <Box
                        sx={{
                            py: 4,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No sessions available.
                        </Typography>
                    </Box>
                ) : (
                    <Stack
                        spacing={1.25}
                        divider={
                            <Divider
                                flexItem
                                sx={{
                                    display: "none",
                                }}
                            />
                        }
                    >
                        {sessions.map((session, index) => (
                            <SessionRow
                                key={session.id}
                                session={session}
                                index={index}
                            />
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
};

export default SessionsCard;