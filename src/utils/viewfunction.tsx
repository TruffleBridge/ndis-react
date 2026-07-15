import { Box, Chip, Typography } from "@mui/material";
import { FormLabel } from "@/components";

type ViewValue =
    | string
    | string[]
    | { label: string; value: string }[]
    | null
    | undefined;

export const getViewFunction = (
    label: string,
    value: ViewValue,
    type: "plain" | "chip" = "plain",
    icon?: any,
    optional = false,
    required = false,
) => {
    const values = Array.isArray(value)
        ? value.map((item) => (typeof item === "string" ? item : item.label))
        : value
            ? [value]
            : [];

    return (
        <Box sx={{ mb: 1.3 }}>
            <FormLabel
                label={label}
                optional={optional}
                required={required}
                sxText={{
                    fontWeight: 600,
                    fontSize: "14px",
                }}
            />

            {type === "chip" ? (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1,
                    }}
                >
                    {values?.map((item, index) => (
                        <Chip
                            key={index}
                            label={item}
                            sx={{
                                color: "#222214",
                                '& .MuiChip-label': {
                                    fontSize: 11,
                                    fontWeight: 400
                                },
                                '&.MuiChip-root': {
                                    svg: { fontSize: 14 },
                                    height: "26px"
                                },
                                backgroundColor: "#F2F4F4",
                                border: '1px solid #BEC9C6'
                            }}
                        />
                    ))}
                </Box>
            ) : (
                <Typography
                    sx={{
                        mt: 1,
                        color: "text.primary",
                        fontSize: "14px",
                        textAlign: 'left',
                        alignItems: 'center',
                        display: 'flex',
                        gap: "6px",
                        justifyContent: 'left'
                    }}
                >
                    {icon}  {values.join(", ") || "-"}
                </Typography>
            )}
        </Box>
    );
};