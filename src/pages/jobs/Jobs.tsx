import { Avatar, Box, Chip, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { TableComponent, type ColumnDef, type ColumnState, type RowAction } from "../../components";
import { useState } from "react";

interface JobProps {
  id: number;
  jobId: string;
  avatar?: string;
  name: string;
  workerName: string;
  serviceType?: string;
  serviceDate: string;
  jobStatus: string;
  shiftTime: string;
  location: string;
  paymentStatus: string;
  [key: string]: unknown;
}

const STATUS_STYLES: Record<string, { backgroundColor: string; color: string; borderColor?: string }> = {
  Completed: { backgroundColor: "#ECEFF1", color: "#34485F" },
  Assigned: { backgroundColor: "#EDE9FE", color: "#6D28D9" },
  Pending: { backgroundColor: "#EDE9FE", color: "#6D28D9" },
  High: { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
  Paid: { backgroundColor: '#D9F7E5', color: '#07AB48' },
  Open: { backgroundColor: '#D9F7E5', color: '#07AB48' },
  Failed: { backgroundColor: '#ECEFF1', color: '#34485F' },
};

const INITIAL_JOBS: JobProps[] = [
  {
    id: 1, jobId: "J123",
    name: "Jane Cooper",
    workerName: 'Phonix baker',
    serviceDate: "05/01/2026",
    jobStatus: "Assigned",
    serviceType: "New Applicant",
    paymentStatus: "Paid",
    shiftTime: '09:00 am - 1:00 PM',
    location: 'Sydney'
  },
  {
    id: 2, jobId: "J123",
    name: "Jane Cooper",
    workerName: 'Phonix baker',
    serviceDate: "05/01/2026",
    jobStatus: "Open",
    serviceType: "New Applicant",
    paymentStatus: "Paid",
    shiftTime: '09:00 am - 1:00 PM',
    location: 'Sydney'
  },
  {
    id: 3, jobId: "J123",
    name: "Jane Cooper",
    workerName: 'Phonix baker',
    serviceDate: "05/01/2026",
    jobStatus: "Assigned",
    serviceType: "New Applicant",
    paymentStatus: "Pending",
    shiftTime: '09:00 am - 1:00 PM',
    location: 'Sydney'
  },
  {
    id: 4, jobId: "J123",
    name: "Jane Cooper",
    workerName: 'Phonix baker',
    serviceDate: "05/01/2026",
    jobStatus: "Open",
    serviceType: "New Applicant",
    paymentStatus: "Paid",
    shiftTime: '09:00 am - 1:00 PM',
    location: 'Sydney'
  },
  {
    id: 5, jobId: "J123",
    name: "Jane Cooper",
    workerName: 'Phonix baker',
    serviceDate: "05/01/2026",
    jobStatus: "Completed",
    serviceType: "New Applicant",
    paymentStatus: "Pending",
    shiftTime: '09:00 am - 1:00 PM',
    location: 'Sydney'
  },

];

const JOBS_COLUMNS: ColumnDef<JobProps>[] = [
  { headerName: "Job ID", field: "jobId" },
  {
    headerName: "Client Name",
    field: "name",
    // width: 150,
    render: (_value, row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "#E5E7EB", color: "#374151", fontSize: 14 }} src="https://i.pravatar.cc/150" />
        <Box>
          <Typography>
            {row.name}
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    headerName: "Worker Name",
    field: "workerName",
    // width: 150,
    render: (_value, row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "#E5E7EB", color: "#374151", fontSize: 14 }} src="https://i.pravatar.cc/150" />
        <Box>
          <Typography>
            {row.workerName}
          </Typography>
        </Box>
      </Box>
    ),
  },
  { headerName: "Service Type", field: "serviceType" },
  {
    headerName: "Job Status", field: "jobStatus",
    render: (value) => {
      const label = value as string;
      const style = STATUS_STYLES[label] ?? {};
      return (
        <Chip
          label={label}
          size="small"
          sx={{
            ...style,
            fontWeight: 500,
            fontSize: "0.75rem",
            height: 24,
            borderRadius: "8px",
            border: style.borderColor ? `1px solid ${style.borderColor}` : "none",
          }}
        />
      );
    },
  },
  { headerName: "Service Date", field: "serviceDate" },
  { headerName: "Shift Time", field: "shiftTime" },
  { headerName: "Location", field: "location" },
  {
    headerName: "Payment Status",
    field: "paymentStatus",
    render: (value) => {
      const label = value as string;
      const style = STATUS_STYLES[label] ?? {};
      return (
        <Chip
          label={label}
          size="small"
          sx={{
            ...style,
            fontWeight: 500,
            fontSize: "0.75rem",
            height: 24,
            borderRadius: "8px",
            border: style.borderColor ? `1px solid ${style.borderColor}` : "none",
          }}
        />
      );
    },
  },
];

// Helper: build initial ColumnState[] from a ColumnDef[]
function buildColumnStates<T>(cols: ColumnDef<T>[]): ColumnState[] {
  return cols.map((col) => ({ key: col.headerName, visible: true }));
}

export default function JobTable() {
  const [jobs] = useState<JobProps[]>(INITIAL_JOBS);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // columnStates is the committed state — the table renders from this
  const [columnStates, setColumnStates] = useState<ColumnState[]>(
    buildColumnStates(JOBS_COLUMNS)
  );

  const ROWS_PER_PAGE = 5;

  const filteredJobs = jobs.filter(
    (w) =>
      w.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      w.location.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredJobs.length / ROWS_PER_PAGE);

  const rowActions: RowAction<JobProps>[] = [
    {
      label: "View",
      icon: <VisibilityOutlinedIcon sx={{ fontSize: 16, color: '#7F7F7F' }} />,
      onClick: (row) => console.log("View", row),
    },
    // {
    //   label: "Delete",
    //   icon: <DeleteIcon />,
    //   sx: { color: "#7F7F7F" },
    //   onClick: (row) => console.log("Delete", row),
    // },
  ];

  return (
    <Box>
      <TableComponent
        rows={paginatedJobs}
        columns={JOBS_COLUMNS}
        rowActions={rowActions}
        totalPages={totalPages}
        currentPage={currentPage}
        searchValue={searchValue}
        searchPlaceholder="Search jobs..."
        columnStates={columnStates}
        onColumnStatesChange={setColumnStates}   // only called on "Apply"
        onSearch={(v) => { setSearchValue(v); setCurrentPage(1); }}
        onPageChange={setCurrentPage}
        onExportData={() => console.log("Export")}
        onFilter={() => console.log("Filter")}
      />
    </Box>
  );
}