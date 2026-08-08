import type { SxProps, Theme } from "@mui/material";
import { ABOVE_MOBILE_NAV_QUERY } from "../../constants/breakpoints";

const BRAND = "primary.main";
const BORDER = "#ECEFF5";
const TEXT_MUTED = "#7F7F7F";
const TEXT_DARK = "#000000";
const TEXT_LIGTH = "#1C1D21"
const TEXT_LABEL = "#8181A5";

export const dashboardStyles: Record<string, SxProps<Theme>> = {


  root: {
    minHeight: "100vh",
    width: "100%",
  },

  // ── Header row ───────────────────────────────────────────────────────────
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    flexDirection: { xs: "column", sm: "row" },
    flexWrap: "wrap",
    gap: 2,
    mb: 3,
  },

  headerText: {
    textAlign: "start",
  },

  headerTitle: {
    fontWeight: 700,
    fontSize: { xs: "14px", md: "18px" },
  },

  headerSubtitle: {
    color: TEXT_MUTED,
    fontSize: { xs: "12px", md: "14px" },
    fontWeight: 500,
  },

  // ── CTA button row ───────────────────────────────────────────────────────
  buttonRow: {
    display: "flex",
    gap: 1.5,
    flexWrap: "wrap",
    alignItems: "center",
  },

  askCta: {
    borderRadius: "8px",
    fontSize: "14px",
    height: "36px",
    textTransform: "capitalize",
    color: "#914BCA",
    border: "1px solid transparent",
    background: `
      linear-gradient(white, white) padding-box,
      linear-gradient(5.7deg, #A087EC 9.08%, #7E00A1 94.52%) border-box
    `,
    whiteSpace: "nowrap",
    // "&:hover": {
    //   background: `
    //     linear-gradient(#f9f3ff, #f9f3ff) padding-box,
    //     linear-gradient(5.7deg, #A087EC 9.08%, #7E00A1 94.52%) border-box
    //   `,
    // },
  },

  ctaExport: {
    borderRadius: "8px",
    background: "#FFFFFF",
    color: TEXT_MUTED,
    fontSize: "14px",
    height: "36px",
    textTransform: "capitalize",
    fontWeight: 500,
    whiteSpace: "nowrap",
    border: '1px solid #D0D5DD',
    // '&:hover': {
    //   backgroundColor: "#df50201f",
    //   color:"#222124"
    // }
  },

  bookingCta: {
    borderRadius: "8px",
    bgcolor: BRAND,
    color: "#FFFFFF",
    fontSize: "14px",
    height: "36px",
    textTransform: "capitalize",
    fontWeight: 600,
    whiteSpace: "nowrap",
    boxShadow: "0px 1px 2px 0px #1018280D",
  },

  // ── KPI Cards ────────────────────────────────────────────────────────────
  kpiCard: {
    borderRadius: "12px",
    boxShadow: "none",
    border: `1px solid ${BORDER}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,
    minHeight: "98px",
    height: "100%",
  },

  kpiCardContent: {
    p: "0 !important",
    textAlign: "start",
  },

  kpiValue: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: { xs: "1rem", md: "1.3rem" },
  },

  kpiLabel: {
    color: TEXT_LABEL,
    fontSize: { xs: "0.5rem", md: "0.7rem" },
  },

  // ── Chart cards ──────────────────────────────────────────────────────────
  card: {
    borderRadius: "12px",
    boxShadow: "none",
    border: `1px solid ${BORDER}`,
    height: "100%",
  },

  bookingCard: {
    borderRadius: "12px",
    boxShadow: "none",
    border: `1px solid ${BORDER}`,
    height: "100%",
    minHeight: { xs: 300, md: 420 },
  },

  bookingChartTitle: {
    textAlign: "start",
    fontWeight: 600,
    fontSize: "1rem",
  },

  bookingChartBox: {
    height: { xs: 220, md: 330 },
    width: "100%",
  },
  aiInsightsBtn: {
    position: "relative",
    textTransform: "none",
    borderRadius: "14px",
    border: "none",
    fontWeight: 400,
    fontSize: 13,
    height: 42,
    px: 1.75,
    color: (theme: Theme) => theme.palette.text.secondary,
    background: "#fff",
    whiteSpace: "nowrap",
    flexShrink: 0,
    // display: "none",
    [ABOVE_MOBILE_NAV_QUERY]: {
      display: "inline-flex",
    },
    zIndex: 0,
    "& .MuiButton-startIcon": {
      marginRight: 0.75,
      display: "inline-flex",
      alignItems: "center",
      zIndex: 1,
    },
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "14px",
      padding: "1.6px",
      background:
        "linear-gradient(180deg, #AD95FB 0%, #5E40A6 26.5%, #FFC077 55.5%, #EB9481 73.5%, #C057DD 95.5%)",
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
      pointerEvents: "none",
      zIndex: 0,
    },
  },

  // ── Side cards (Live Activity, Revenue, Compliance, Pending) ─────────────
  sideCard: {
    borderRadius: "12px",
    boxShadow: "none",
    border: `1px solid ${BORDER}`,
    height: "100%",
    // No fixed maxHeight — let content breathe; scroll inside list instead
  },

  sideCardContent: {
    p: "16px !important",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  sideCardTitle: {
    fontSize: "16px",
    fontWeight: 600,
    textAlign: "start",
  },

  // ── Live Activity list ───────────────────────────────────────────────────
  activityList: {
    p: 0,
    flex: 1,
    overflowY: { xs: 'hidden', md:'unset'},
    maxHeight: { xs: 260, md: 310 },
  },

  activityItem: {
    alignItems: "flex-start",
    p: 0,
    mb: 2.5,
    position: "relative",
  },

  activityDot: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    border: "4px solid #1650CF",
    bgcolor: "#fff",
    flexShrink: 0,
  },

  activityLine: {
    position: "absolute",
    top: 14,
    left: 6,
    width: '1px',
    bgcolor: "#E6EAF4",
  },

  activityTimelineBox: {
    position: "relative",
    mr: 1.5,
    mt: 0.6,
    flexShrink: 0,
  },

  activityTitle: {
    fontWeight: 600,
    fontSize: "0.75rem",
    color: "#222124",
    textAlign: "start",
  },

  activityDesc: {
    fontSize: "11px",
    fontWeight: 400,
    color: "#99A1AF",
    lineHeight: 1.5,
    mt: 0.5,
    textAlign: "start",
  },

  activityTime: {
    fontSize: "11px",
    fontWeight: 500,
    color: "#98A2B3",
    mt: 0.75,
    textAlign: "start",
  },

  viewHistoryBtn: {
    mt: 1.5,
    borderRadius: 1,
    fontSize: '12px',
    fontWeight: 600,
    textTransform: "none",
    height: 42,
    borderColor: "#1650CF",
    color: "#1650CF",
    flexShrink: 0,
    // bgcolor: "#EEF1FF",
    // "&:hover": {
    // borderColor: "#3B5BFF",
    // },
  },

  // ── Revenue card ─────────────────────────────────────────────────────────
  revenueCard: {
    borderRadius: "12px",
    boxShadow: "none",
    border: `1px solid ${BORDER}`,
    height: "100%",
  },

  revenueTitle: {
    mb: 0.5,
    fontWeight: 600,
    fontSize: "18px",
    textAlign: "start",
  },

  revenueSubtitle: {
    mb: 2,
    fontSize: "14px",
    textAlign: "start",
    fontWeight: 500,
    color: TEXT_MUTED,
  },

  revenueChartBox: {
    height: { xs: 180, md: 220 },
    width: "100%",
  },

  // ── Compliance card ──────────────────────────────────────────────────────
  complianceCard: {
    borderRadius: "12px",
    boxShadow: "none",
    border: `1px solid ${BORDER}`,
    height: "100%",
  },

  complianceHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 2,
  },

  complianceTitle: {
    fontSize: "15px",
    fontWeight: 600,
    textAlign: "start",
  },

  complianceItem: {
    mb: 2,
  },

  complianceItemTitle: {
    fontWeight: 600,
    fontSize: "14px",
    color: TEXT_DARK,
    textAlign: "start",
  },

  complianceItemDesc: {
    color: TEXT_MUTED,
    fontWeight: 400,
    fontSize: "14px",
    mt: 0.25,
    textAlign: "start",
  },

  // ── Pending Actions card ──────────────────────────────────────────────────
  pendingCard: {
    borderRadius: "12px",
    boxShadow: "none",
    border: `1px solid ${BORDER}`,
    height: "100%",
  },

  pendingCardContent: {
    p: "16px !important",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  pendingHeader: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    mb: 2,
  },

  pendingTitle: {
    fontWeight: 600,
    fontSize: "16px",
    textAlign: "start",
    color: '#000000'
  },

  pendingList: {
    flex: 1,
    overflowY: "auto",
    maxHeight: { xs: 260, md: 310 },
  },

  pendingActionItem: {
    mb: 2.5,
    px: 1,
  },

  pendingTimeRow: {
    display: "flex",
    alignItems: "center",
    gap: 0.8,
    mb: 0.8,
  },

  pendingDot: {
    fontSize: 7,
    color: "#5E81F4",
  },

  pendingTime: {
    color: "#5E81F4",
    fontWeight: 600,
    fontSize: "12px",
  },

  pendingItemTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: TEXT_LIGTH,
    textAlign: "start",
  },

  pendingItemSub: {
    mt: 0.5,
    textAlign: "start",
    color: TEXT_LABEL,
    fontSize: "12px",
  },
  bookingText: { color: '#656F78', fontSize: 13, fontWeight: 400 }
};
export const buttonStyle = (view: string, value: string) => ({
  textTransform: "none",
  borderRadius: "8px",
  height: 40,
  width: 40,
  px: 2,
  fontWeight: 800,
  color: view === value ? "#222124" : "#8181A5",
  border: view === value ? "1px solid #ECECF2" : "1px solid transparent",
  backgroundColor: "transparent",
});