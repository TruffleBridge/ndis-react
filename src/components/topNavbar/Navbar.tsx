import { useState, type MouseEvent } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SparkleIcon,
  SearchIcon,
  CollapseIcon,
} from "@/assets/index";
import { InputTextField } from "@/components/input/textField";
import { AIInsightsPopover } from "../popover";
import { navbarStyles, navbarStyles as S } from "./styles";
import { getNavTitle } from "@/constants/navigation";
import { HistoryOutlined, LogoutOutlined, PersonOutlineOutlined } from "@mui/icons-material";
import { useProfileStore } from "@/store/useProfilestore";
import FormLabel from "../formLabel/formLabel";

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
  notificationChildren
}: TopNavbarProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const location = useLocation();
  const pageTitle = getNavTitle(location.pathname);
  const navigate = useNavigate();

  const profile = useProfileStore((state) => state.profile);
  const logout = useProfileStore((state) => state.logout);

  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl1);

  const handleAvatarClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl1(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile-details')
  };

  const handleAuditLogsClick = () => {
    handleClose();
    navigate('/audit-logs')
  };


  const handleLogoutClick = () => {
    handleClose();
    logout();
  };

  const initials = profile.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

        <IconButton sx={S.notifBtn}
          component="div">
          {notificationChildren}
        </IconButton>

        {/* <IconButton >
          <Typography sx={S.userInitials}>{userInitials}</Typography>
        </IconButton> */}
        <IconButton
          onClick={handleAvatarClick}
          size="small"
          aria-controls={open ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            p: 0,
            m: 0,
            cursor: 'pointer',
            "&:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          <Avatar
            src={""}
            sx={navbarStyles.userBtn}

          >
            {!profile.avatarUrl && initials}
          </Avatar>
        </IconButton>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl1}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 170,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'custom.800',
                boxShadow: "0px 1px 3px rgba(0,0,0,0.04),0px 12px 32px rgba(0,0,0,0.08)",
              },
            },
          }}
        >
          <MenuItem onClick={handleProfileClick} sx={navbarStyles?.menu}>
            <PersonOutlineOutlined fontSize="small" sx={{ color: 'custom.500' }} />
            <FormLabel label="My Profile" sxText={{ m: 0 }} />
          </MenuItem>

          <MenuItem onClick={handleAuditLogsClick} sx={navbarStyles?.menu}>
            <HistoryOutlined fontSize="small" sx={{ color: 'custom.500' }} />
            <FormLabel label="Audit Log(History)" sxText={{ m: 0 }} />
          </MenuItem>

          <MenuItem onClick={handleLogoutClick} sx={navbarStyles?.menu}>
            <LogoutOutlined fontSize="small" sx={{ color: 'error.main' }} />
            <FormLabel label="Logout" sxText={{ m: 0, color: 'error.main' }} />
          </MenuItem>
        </Menu>
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
