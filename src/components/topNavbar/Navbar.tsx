import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import {
  SparkleIcon,
  SearchIcon,
  CollapseIcon,
} from "@/assets/index";
import { InputTextField } from "@/components/input/textField";
import { AIInsightsPopover } from "../popover";
import { navbarStyles as S } from "./styles";
import { getNavTitle } from "@/constants/navigation";

export interface TopNavbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  userInitials?: string;
  notificationCount?: number;
  notificationChildren?: any;
}

const insights = [
  { text: "Active support workers increased by", value: "18% this month" },
  { text: "Most requested worker skill:", value: "Personal Care" },
  { text: "High-performing workers completed", value: "96% of bookings on time" },
  { text: "New worker registrations increased by", value: "32% this week" },
  { text: "Average worker response time reduced to", value: "4 minutes" },
];

export const TopNavbar = ({
  onToggleSidebar,
  userInitials = "MD",
  notificationChildren
}: TopNavbarProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const location = useLocation();
  const pageTitle = getNavTitle(location.pathname);

  return (
    <Box sx={S.appBar}>
      <Box sx={S.leftSection}>
        <IconButton onClick={onToggleSidebar} sx={S.toggleBtn}>
          <CollapseIcon />
        </IconButton>
        <Typography
          variant="h5"
          sx={{ ...S.pageTitle }}
          noWrap
        >
          {pageTitle}
        </Typography>
      </Box>

      <Box sx={S.rightSection}>
        <Button
          variant="outlined"
          startIcon={<SparkleIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={S.aiInsightsBtn}
        >
          AI Insights
        </Button>

        <Box sx={{ ...S.searchWrapper, display: { xs: 'none', md: 'flex' } }}>
          <InputTextField
            value=""
            onChange={() => { }}
            fullWidth
            placeholder="AI Search"
            startAdornment={<SearchIcon />}
            mainSx={{ mb: 0 }}
          />
        </Box>

        <IconButton sx={S.notifBtn}>
          {notificationChildren}
        </IconButton>

        <IconButton sx={S.userBtn}>
          <Typography sx={S.userInitials}>{userInitials}</Typography>
        </IconButton>
      </Box>

      <AIInsightsPopover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        insightData={insights}
      />
    </Box>
  );
};
