import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";

export interface InfoRow {
  label: string;
  value: React.ReactNode;
}

interface InfoCardProps {
  icon: SvgIconComponent | any;
  title: string;
  rows: InfoRow[];
  sx?: object;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, rows, sx }) => {
  return (
    <Card variant="outlined" sx={{ height: "100%", borderRadius: 3, ...sx }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={1.5} sx={{
          mb: 2,
          direction: "row", alignItems: "center"
        }}>
          <Avatar
            sx={{
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              width: 32,
              height: 32,
            }}
          >
            <Icon fontSize="small" />
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Stack>

        <Stack spacing={1.75}>
          {rows.map((row) => (
            <Box key={row.label}>
              <Typography variant="caption" color="text.secondary">
                {row.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 0.25, wordBreak: "break-word", fontWeight: 500 }}
              >
                {row.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
