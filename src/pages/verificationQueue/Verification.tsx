import { Avatar, Box, Chip, Button, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { TableComponent, type ColumnDef, type ColumnState, type RowAction } from "../../components";
import { useState } from "react";

interface Worker {
  id: number;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  applicationDate: string;
  documentStatus: string;
  verificationType: string;
  status: string;
  [key: string]: unknown;
}

const STATUS_STYLES: Record<string, { backgroundColor: string; color: string; borderColor?: string }> = {
  Completed: { backgroundColor: "#FFF0D8", color: "#B6760E" },
  Inprogress: { backgroundColor: "#EBF1FD", color: "#1442A7" },
  Pending: { backgroundColor: "#F3F4F6", color: "#374151", borderColor: "#D1D5DB" },
  High: { backgroundColor: "#EAECF0", color: "#34485F" },
};

const INITIAL_WORKERS: Worker[] = [
  { id: 1, name: "Jane Cooper", email: "lanasteiner@gmail.com", phone: "(406) 555-0120", applicationDate: "05/01/2026", documentStatus: "4/4 Uploaded", verificationType: "New Applicant", status: "Completed" },
  { id: 2, name: "Phoenix Baker", email: "phoenixbaker@gmail.com", phone: "(480) 555-0103", applicationDate: "05/01/2026", documentStatus: "3/4 Uploaded", verificationType: "Renewal", status: "Inprogress" },
  { id: 3, name: "Jane Cooper", email: "oliviarhye@gmail.com", phone: "(603) 555-0123", applicationDate: "05/01/2026", documentStatus: "2/4 Uploaded", verificationType: "New Applicant", status: "Completed" },
  { id: 4, name: "Phoenix Baker", email: "demiwilkinson@gmail.com", phone: "(704) 555-0127", applicationDate: "05/01/2026", documentStatus: "3/4 Uploaded", verificationType: "New Applicant", status: "Completed" },
  { id: 5, name: "Jane Cooper", email: "candicewu@gmail.com", phone: "(239) 555-0108", applicationDate: "05/01/2026", documentStatus: "3/4 Uploaded", verificationType: "New Applicant", status: "High" },
  { id: 6, name: "Phoenix Baker", email: "natalicraig@gmail.com", phone: "(316) 555-0116", applicationDate: "05/01/2026", documentStatus: "3/4 Uploaded", verificationType: "New Applicant", status: "Completed" },
  { id: 7, name: "Jane Cooper", email: "drewcano@gmail.com", phone: "(208) 555-0112", applicationDate: "05/01/2026", documentStatus: "3/4 Uploaded", verificationType: "New Applicant", status: "Inprogress" },
  { id: 8, name: "Phoenix Baker", email: "orlandodiggs@gmail.com", phone: "(808) 555-0111", applicationDate: "05/01/2026", documentStatus: "3/4 Uploaded", verificationType: "New Applicant", status: "Completed" },
];

const WORKER_COLUMNS: ColumnDef<Worker>[] = [
  {
    headerName: "Worker Name",
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
  { headerName: "Email Address", field: "email" },
  { headerName: "Phone Number", field: "phone" },
  { headerName: "Application Date", field: "applicationDate" },
  { headerName: "Document Status", field: "documentStatus" },
  { headerName: "Verification Type", field: "verificationType" },
  {
    headerName: "Status",
    field: "status",
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
            borderRadius: "12px",
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

export default function VerificationTable() {
  const [workers] = useState<Worker[]>(INITIAL_WORKERS);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // columnStates is the committed state — the table renders from this
  const [columnStates, setColumnStates] = useState<ColumnState[]>(
    buildColumnStates(WORKER_COLUMNS)
  );

  const ROWS_PER_PAGE = 5;

  const filteredWorkers = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      w.email.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedWorkers = filteredWorkers.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredWorkers.length / ROWS_PER_PAGE);

  const rowActions: RowAction<Worker>[] = [
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
  const [selected, setSelected] = useState("client");

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "#EFEFEF",
          p: "6px",
          borderRadius: "50px",
          gap: 1,
          mb: 2,
          justifyContent: 'left',
          display: 'flex',
          width: 'fit-content'
        }}
      >
        <Button
          disableRipple
          onClick={() => setSelected("client")}
          sx={{
            minWidth: 140,
            height: 36,
            borderRadius: "50px",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            color: selected === "client" ? "#FFF" : "#6F6F6F",
            bgcolor: selected === "client" ? "#086D63" : "transparent",

            "&:hover": {
              bgcolor:
                selected === "client"
                  ? "#086D63"
                  : "transparent",
            },
          }}
        >
          Clients
        </Button>

        <Button
          disableRipple
          onClick={() => setSelected("worker")}
          sx={{
            minWidth: 140,
            height: 36,
            borderRadius: "50px",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            color: selected === "worker" ? "#FFF" : "#6F6F6F",
            bgcolor: selected === "worker" ? "#086D63" : "transparent",

            "&:hover": {
              bgcolor:
                selected === "worker"
                  ? "#086D63"
                  : "transparent",
            },
          }}
        >
          Support Worker
        </Button>
      </Box>
      <TableComponent
        rows={paginatedWorkers}
        columns={WORKER_COLUMNS}
        rowActions={rowActions}
        totalPages={totalPages}
        currentPage={currentPage}
        searchValue={searchValue}
        searchPlaceholder="Search workers..."
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