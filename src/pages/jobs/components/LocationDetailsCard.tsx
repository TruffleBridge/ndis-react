import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

interface LocationDetailsCardProps {
    latitude: number | string | null;
    longitude: number | string | null;
}

const LocationDetailsCard = ({
    latitude,
    longitude,
}: LocationDetailsCardProps) => {
    // Convert API string values to numbers
    const lat = Number(latitude);
    const lng = Number(longitude);

    const hasCoordinates =
        latitude !== null &&
        longitude !== null &&
        latitude !== "" &&
        longitude !== "" &&
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180;

    // OpenStreetMap embed URL
    const mapUrl = hasCoordinates
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.001},${lat - 0.001
        },${lng + 0.001},${lat + 0.001}&layer=mapnik&marker=${lat},${lng}`
        : "";


    // Google Maps URL
    const externalMapUrl = hasCoordinates
        ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        : "";

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            <CardContent
                sx={{
                    p: 2,
                    "&:last-child": {
                        pb: 2,
                    },
                }}
            >
                {hasCoordinates ? (
                    <>
                        <Box
                            sx={{
                                width: "100%",
                                height: {
                                    xs: 200,
                                    sm: 250,
                                },
                                borderRadius: 2,
                                overflow: "hidden",
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "grey.100",
                            }}
                        >
                            <iframe
                                title="Service location map"
                                src={mapUrl}
                                loading="lazy"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: 0,
                                    display: "block",
                                }}
                                referrerPolicy="no-referrer"
                            />
                        </Box>

                        <Link
                            href={externalMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{
                                display: "inline-block",
                                mt: 1,
                                fontSize: "0.78rem",
                                fontWeight: 600,
                            }}
                        >
                            Open location in Google Maps
                        </Link>
                    </>
                ) : (
                    <Box
                        sx={{
                            py: 3,
                            px: 2,
                            textAlign: "center",
                            borderRadius: 2,
                            bgcolor: "action.hover",
                        }}
                    >
                        No location available
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default LocationDetailsCard;
