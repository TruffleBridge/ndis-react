import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CircleIcon from "@mui/icons-material/Circle";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";
import { CalendarIcon, CardGraph, SparkleIcon } from "@/assets";
import { buttonStyle, dashboardStyles as S } from "./styles";
import { type ChatMessage } from "@/components";
import { useMemo, useState } from "react";
import { VirtualAssistantPopover } from "@/components/askAI";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { FileDownloadOutlined } from "@mui/icons-material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

// ─── Static data 
const chartDatas = {
  day: {
    labels: ["Day-1", "Day-2", "Day-3", "Day-4", "Day-5", "Day-6", "Day-7"],
    core: [30, 45, 35, 55, 48, 52, 42],
    capacity: [25, 30, 20, 60, 50, 35, 28],
  },

  week: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    core: [40, 55, 35, 48],
    capacity: [30, 62, 20, 45],
  },

  month: {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],

    core: [42, 28, 20, 55, 48, 22, 25, 38, 35, 30, 40, 48],

    capacity: [35, 33, 22, 20, 62, 55, 25, 18, 20, 40, 50, 28],
  },
};



const bookingOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  showLine: true,


  interaction: {
    mode: "index",
    intersect: false,
  },

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      backgroundColor: "#fff",
      titleColor: "#8181A5",
      bodyColor: "#1C1D21",
      borderColor: "#ECECEC",
      borderWidth: 1,
      padding: 14,

      displayColors: false,

      titleFont: {
        size: 14,
        weight: 400,
        family: 'Inter, sans-serif',
      },

      bodyFont: {
        size: 14,
        weight: 600,
        family: 'Inter, sans-serif',
      },

      callbacks: {
        title(items) {
          return items[0].label;
        },

        label(item) {
          return `$${item.formattedValue}.200`;
        },
      },
    },
  },

  scales: {
    y: {
      display: false,
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },

    x: {
      border: {
        display: false,
        dash: [6, 8],
      },

      ticks: {
        color: "#8181A5",
        align: 'inner',
        font: {
          size: 14,
          weight: 400,
          family: 'Inter, sans-serif',
        },
        padding: 4,
      },

      grid: {
        color: "#EEEEEE",
        drawTicks: false,
      },
    },
  },
};

const revenueData = {
  labels: ["NSW", "VIC", "QLD", "SA", "WA"],
  datasets: [
    {
      label: "Actual",
      stack: "same",
      data: [
        [18, 32],
        [18, 22],
        [18, 30],
        [18, 40],
        [18, 32],
      ],
      backgroundColor: "#6A6EF6",
      borderRadius: 999,
      borderSkipped: false,
      barThickness: 28,
    },
    {
      label: "Projected",
      stack: "same",
      data: [
        [6, 16],
        [2, 16],
        [9, 16],
        [5, 16],
        [13, 16],
      ],
      backgroundColor: "#15B8E6",
      borderRadius: 999,
      borderSkipped: false,
      barThickness: 28,
    },
  ],
};

const revenueOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
    y: {
      stacked: false,
      display: true,
      ticks: {
        display: false,
        stepSize: 10, // <-- 0,10,20,30,40,50,60 = 6 rows
      },
      grid: {
        display: true,
        color: "#b5b5d5",
        borderDash: [6, 8],
        lineWidth: 0.5,
      },
      border: {
        display: false,
      },
    },
  },
};

const statCards = [
  { title: "Active Clients", value: "2,345" },
  { title: "Active Workers", value: "1,254" },
  { title: "Active Bookings", value: "312" },
  { title: "Monthly Revenue", value: "$1,345K" },
];

const activities = [
  {
    title: "Booking Completed",
    desc: "Care Specialist #102 logged 4.0 hours for Client: Mary S.",
    time: "2 mins ago",
  },
  {
    title: "New Client Signed",
    desc: "Onboarding package sent to David L. in Melbourne.",
    time: "14 mins ago",
  },
  {
    title: "Worker Login",
    desc: "Admin login detected from 192.168.1.45 (Sydney).",
    time: "18 mins ago",
  },
  {
    title: "Worker Verified",
    desc: "ID verification approved for Jane K. (Brisbane).",
    time: "32 mins ago",
  },
];

const actions = [
  {
    title: "Invoice #4401 Approval",
    sub: "Value: $1,240.00 • Provider: CarePlus",
    time: "05:48 AM",
  },
  {
    title: "Onboarding: Mark Thompson",
    sub: "Final clinical review required.",
    time: "05:48 AM",
  },
  {
    title: "Invoice #4402 Approval",
    sub: "Value: $980.00 • Provider: CareNow",
    time: "06:10 AM",
  },
  {
    title: "Invoice #4402 Approval",
    sub: "Value: $980.00 • Provider: CareNow",
    time: "06:10 AM",
  },
  {
    title: "Invoice #4402 Approval",
    sub: "Value: $980.00 • Provider: CareNow",
    time: "06:10 AM",
  },
  {
    title: "Invoice #4402 Approval",
    sub: "Value: $980.00 • Provider: CareNow",
    time: "06:10 AM",
  },
];

// ─── Component ───
const Dashboard = () => {
  const [view, setView] = useState<"day" | "week" | "month">("month");

  // ask ai state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      fromAssistant: true,
      text: "Hi! 👋 How can I help you manage the platform today?",
    },
    {
      id: "2",
      fromAssistant: true,
      text: "First, can you tell me the Level at which you'd like to perform the transfer?",
    },
  ]);

  const quickOptions = [
    { label: "Workers" },
    { label: "Bookings" },
    { label: "Incidents" },
    { label: "Payments" },
  ];

  const handleSelectOption = (label: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto?.randomUUID(), fromAssistant: false, text: label },
    ]);
    // TODO: call your API / next-step logic here
  };

  const handleSend = (value: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto?.randomUUID(), fromAssistant: false, text: value },
    ]);
  };

  const sharedProps = {
    messages,
    quickOptions,
    onSelectOption: handleSelectOption,
    onSend: handleSend,
  };

  const data = useMemo(() => ({
    labels: chartDatas[view].labels,

    datasets: [
      {
        label: "Core Support",
        data: chartDatas[view].core,
        borderColor: "#5E81F4",
        backgroundColor: "#F4F6FE",
        fill: false,
        tension: 0.45,
      },
      {
        label: "Capacity Building",
        data: chartDatas[view].capacity,
        borderColor: "#8AF1B9",
        backgroundColor: "#F1FDF7",
        fill: true,
        tension: 0.45,
      },
    ],
  }), [view]);

  return (
    <Box sx={S.root}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Stack direction="row" sx={S.header}>
        <Box sx={S.headerText}>
          <Typography variant="h5" sx={S.headerTitle}>
            Welcome back, Manoj!
          </Typography>
          <Typography variant="body2" sx={S.headerSubtitle}>
            Track your reports, activities and performance here.
          </Typography>
        </Box>

        <Stack direction="row" sx={S.buttonRow}>
          <VirtualAssistantPopover placement="bottom-end" {...sharedProps}>
            <Button endIcon={<AutoAwesomeIcon />} variant="outlined" sx={S.askCta}
            >
              Ask AI
            </Button>
          </VirtualAssistantPopover>
          <Button startIcon={<FileDownloadOutlined sx={{ fontSize: 16 }} />} variant="outlined" sx={S.ctaExport}>
            Export Report
          </Button>
          <Button startIcon={<AddIcon />} variant="contained" sx={S.bookingCta}>
            New Booking
          </Button>
        </Stack>
      </Stack>

      {/* ── KPI Cards ───────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={S.kpiCard}>
              <CardContent sx={S.kpiCardContent}>
                <Typography variant="h5" sx={S.kpiValue}>
                  {item.value}
                </Typography>
                <Typography variant="body2" sx={S.kpiLabel}>
                  {item.title}
                </Typography>
              </CardContent>
              <CardGraph />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Middle row: Booking chart + Live Activity ────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Booking Analytics chart */}
        <Grid size={{ xs: 12, lg: 9 }}>
          <Card sx={S.bookingCard}>

            <CardContent sx={{ p: 0 }}>
              <Grid container spacing={2} sx={{ mb: 1, px: 4, py: 2, alignItems: 'center' }}>
                {/* Title */}
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="h6" sx={S.bookingChartTitle}>
                    Booking Analytics
                  </Typography>
                </Grid>

                {/* AI Forecast */}
                <Grid
                  size={{ xs: 12, md: 3 }}
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "center" },
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<SparkleIcon />}
                    sx={S.aiInsightsBtn}
                  >
                    AI Forecast: +12% demand in Q4
                  </Button>
                </Grid>

                {/* Toggle + Calendar */}
                <Grid
                  size={{ xs: 12, md: 6 }}
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "flex-end" },
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button sx={buttonStyle(view, "day")} onClick={() => setView("day")}>
                      Day
                    </Button>

                    <Button sx={buttonStyle(view, "week")} onClick={() => setView("week")}>
                      Week
                    </Button>

                    <Button sx={buttonStyle(view, "month")} onClick={() => setView("month")}>
                      Month
                    </Button>
                  </Box>

                  <IconButton
                    sx={{
                      color: "#8181A5",
                      backgroundColor: "#F3F3F6",
                      borderRadius: "8px",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <CalendarMonthOutlinedIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>

              <Box
                sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2, px: 4 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: "#5E81F4"
                    }}
                  />
                  <Typography sx={S.bookingText}>
                    Core Support
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: "#8AF1B9"
                    }}
                  />
                  <Typography sx={S.bookingText}>
                    Capacity Building
                  </Typography>
                </Box>
              </Box>
              <Box sx={S.bookingChartBox}>
                <Line
                  data={data} options={bookingOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Activity */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Card sx={S.sideCard}>
            <CardContent sx={S.sideCardContent}>
              <Box sx={S.pendingHeader}>
                {/* <DragIndicatorIcon sx={{ color: "#000000", fontSize: 20 }} /> */}
                <Typography variant="h6" sx={S.sideCardTitle}>
                  Live Activity
                </Typography>
              </Box>
              <List sx={S.activityList}>
                {activities.map((item, index) => (
                  <ListItem key={index} sx={S.activityItem}>
                    {/* Timeline dot + connector */}
                    <Box sx={S.activityTimelineBox}>
                      <Box sx={S.activityDot} />
                      {/* Only draw connector when NOT the last item */}
                      {index !== activities.length - 1 && (
                        <Box
                          sx={{
                            ...S.activityLine,
                            height: 60,
                          }}
                        />
                      )}
                    </Box>

                    <Box>
                      <Typography sx={S.activityTitle}>{item.title}</Typography>
                      <Typography sx={S.activityDesc}>{item.desc}</Typography>
                      <Typography sx={S.activityTime}>{item.time}</Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>

              <Button fullWidth variant="outlined" sx={S.viewHistoryBtn}>
                View all History
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Bottom row: Revenue | Compliance | Pending Actions ──────────── */}
      <Grid container spacing={2}>
        {/* Revenue Trends */}
        <Grid size={{ xs: 12, md: 12,lg:6 }}>
          <Card sx={S.revenueCard}>
            <CardContent>
              <Typography variant="h6" sx={S.revenueTitle}>
                Revenue Trends
              </Typography>
              <Typography variant="body2" sx={S.revenueSubtitle}>
                Actual vs Projected revenue by region
              </Typography>
              <Box sx={S.revenueChartBox}>
                <Bar data={revenueData} options={revenueOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Compliance Alerts */}
        <Grid size={{ xs: 12, md: 6, lg: 3  }}>
          <Card sx={S.complianceCard}>
            <CardContent sx={S.pendingCardContent}>
              <Box sx={S.complianceHeader}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {/* <DragIndicatorIcon sx={{ color: "#000000", fontSize: 20 }} /> */}
                  <Typography variant="h6" sx={S.complianceTitle}>
                    Compliance Alerts
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 75, height: 32 }}>
                  <FormControl fullWidth>
                    <Select
                      labelId="select-label"
                      id="select"
                      value={10}
                      // label="Read"
                      sx={{
                        height: 32,
                        borderRadius: '8px',
                        "& .MuiOutlinedInput-input": {
                          fontSize: '12px',
                          textAlign: 'left',
                          color: '#7F7F7F',
                        }

                      }}
                    // onChange={handleChange}
                    >
                      <MenuItem value={10}>Read</MenuItem>
                      <MenuItem value={20}>Write</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {[1, 2, 3, 4].map((item) => (
                <Box key={item} sx={{
                  ...S.complianceItem,
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <CalendarIcon width={75} />
                  <Box>
                    <Typography variant="body2" sx={S.complianceItemTitle}>
                      NDIS Screening Pending
                    </Typography>
                    <Typography variant="body2" sx={S.complianceItemDesc}>
                      Support Worker document expires in 3 days.
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Actions */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={S.pendingCard}>
            <CardContent sx={S.pendingCardContent}>
              <Box sx={S.pendingHeader}>
                {/* <DragIndicatorIcon sx={{ color: "#000000", fontSize: 20 }} /> */}
                <Typography variant="h6" sx={S.pendingTitle}>
                  Pending Actions
                </Typography>
              </Box>

              <Box sx={S.pendingList}>
                {actions.map((item, index) => (
                  <Box key={index} sx={S.pendingActionItem}>
                    <Box sx={S.pendingTimeRow}>
                      <CircleIcon sx={S.pendingDot} />
                      <Typography sx={S.pendingTime}>{item.time}</Typography>
                    </Box>
                    <Typography sx={S.pendingItemTitle}>{item.title}</Typography>
                    <Typography variant="body2" sx={S.pendingItemSub}>
                      {item.sub}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box >
  );
};

export default Dashboard;