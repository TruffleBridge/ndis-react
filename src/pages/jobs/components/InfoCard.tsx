import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";
// import type {
//   InfoRow,
// } from "@/types/jobDetails";

interface InfoCardProps {
  icon: SvgIconComponent | any;
  title: string;
  rows: any[];
}

const InfoCard = ({
  icon: Icon,
  title,
  rows,
}: InfoCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: 2,
        },
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
            mb: {
              xs: 1.75,
              sm: 2,
            },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              flexShrink: 0,
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  0.1,
                ),
              color: "primary.main",
            }}
          >
            <Icon fontSize="small" />
          </Avatar>

          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              minWidth: 0,
            }}
          >
            {title}
          </Typography>
        </Stack>

        <Stack
          spacing={{
            xs: 1.35,
            sm: 1.6,
          }}
        >
          {rows.map((row) => (
            <Box
              key={row.label}
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  fontSize: {
                    xs: "0.68rem",
                    sm: "0.72rem",
                  },
                  lineHeight: 1.3,
                }}
              >
                {row.label}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.3,
                  fontWeight: 600,
                  lineHeight: 1.45,
                  overflowWrap: "anywhere",
                }}
              >
                {row.value || "Not provided"}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InfoCard;