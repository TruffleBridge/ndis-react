import { Avatar, Box, Chip, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { TableComponent, type ColumnDef, type ColumnState, type RowAction } from "../../components";
import { useState } from "react";
import { DeleteIcon, MoreCircleIcon, CircleTickIcon } from "../../assets";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@mui/icons-material";

interface Worker {
  id: number;
  workerId: string;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "Active" | "Inactive" | "Pending";
  police: "verified" | "pending";
  ndis: "verified" | "pending";
  alerts: "None" | "Due" | "Expired";
  [key: string]: unknown;
}

const STATUS_STYLES = {
  Active: {
    backgroundColor: "#D9F7E5",
    color: "#07AB48",
  },
  Inactive: {
    backgroundColor: "#ECEFF1",
    color: "#34485F",
  },
  Pending: {
    backgroundColor: "#FDF0F0",
    color: "#A11A1A",
  },
};

const INITIAL_WORKERS: Worker[] = [
  {
    id: 1,
    workerId: "W-1042",
    name: "Jane Cooper",
    email: "lanasteiner@gmail.com",
    phone: "(406) 555-0120",
    location: "Melbourne",
    status: "Active",
    police: "verified",
    ndis: "verified",
    alerts: "None",
  },
  {
    id: 2,
    workerId: "W-2341",
    name: "Phoenix Baker",
    email: "phoenixbaker@gmail.com",
    phone: "(480) 555-0103",
    location: "Queensland",
    status: "Inactive",
    police: "pending",
    ndis: "verified",
    alerts: "Due",
  },
  {
    id: 3,
    workerId: "W-4522",
    name: "Jane Cooper",
    email: "oliviarhye@gmail.com",
    phone: "(603) 555-0123",
    location: "Victoria",
    status: "Inactive",
    police: "pending",
    ndis: "verified",
    alerts: "Due",
  },
  {
    id: 4,
    workerId: "W-1654",
    name: "Phoenix Baker",
    email: "demiwilkinson@gmail.com",
    phone: "(704) 555-0127",
    location: "Queensland",
    status: "Pending",
    police: "verified",
    ndis: "verified",
    alerts: "Expired",
  },
  {
    id: 5,
    workerId: "W-1542",
    name: "Jane Cooper",
    email: "candicewu@gmail.com",
    phone: "(239) 555-0108",
    location: "Victoria",
    status: "Inactive",
    police: "pending",
    ndis: "pending",
    alerts: "Due",
  },
  {
    id: 6,
    workerId: "W-1754",
    name: "Phoenix Baker",
    email: "natalicraig@gmail.com",
    phone: "(316) 555-0116",
    location: "Melbourne",
    status: "Pending",
    police: "verified",
    ndis: "verified",
    alerts: "None",
  },
  {
    id: 7,
    workerId: "W-1765",
    name: "Jane Cooper",
    email: "drewcano@gmail.com",
    phone: "(208) 555-0112",
    location: "Victoria",
    status: "Active",
    police: "pending",
    ndis: "pending",
    alerts: "Expired",
  },
  {
    id: 8,
    workerId: "W-2675",
    name: "Phoenix Baker",
    email: "orlandodiggs@gmail.com",
    phone: "(808) 555-0111",
    location: "Western Australia",
    status: "Active",
    police: "verified",
    ndis: "verified",
    alerts: "Due",
  },
];

const WORKER_COLUMNS: ColumnDef<Worker>[] = [
  {
    headerName: "Worker ID",
    field: "workerId",
  },

  {
    headerName: "Worker Name",
    field: "name",
    render: (_value, row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "#E5E7EB", color: "#374151", fontSize: 14 }} src="https://i.pravatar.cc/150" />
        <Typography>
          {row.name}
        </Typography>
      </Box>
    ),
  },

  {
    headerName: "Email Address",
    field: "email",
  },

  {
    headerName: "Phone Number",
    field: "phone",
  },

  {
    headerName: "Location",
    field: "location",
  },

  {
    headerName: "Status",
    field: "status",
    render: (value) => {
      const style =
        STATUS_STYLES[value as keyof typeof STATUS_STYLES];

      return (
        <Chip
          label={value as any}
          size="small"
          sx={{
            ...style,
            height: 24,
            borderRadius: "999px",
            fontWeight: 500,
            fontSize: "12px",
          }}
        />
      );
    },
  },

  {
    headerName: "Police",
    field: "police",
    render: (value) =>
      value === "verified" ? (
        <CircleTickIcon />
      ) : (
        <MoreCircleIcon />
      ),
  },

  {
    headerName: "NDIS",
    field: "ndis",
    render: (value) =>
      value === "verified" ? (
        <CircleTickIcon />
      ) : (
        <MoreCircleIcon />
      ),
  },

  {
    headerName: "Alerts",
    field: "alerts",
    render: (value) => {
      const styles = {
        None: {
          bg: "#ECEFF1",
          color: "#34485F",
        },
        Due: {
          bg: "#E6F3FE",
          color: "#093EB1",
        },
        Expired: {
          bg: "#FDF0F0",
          color: "#A11A1A",
        },
      };

      const style = styles[value as keyof typeof styles];

      return (
        <Chip
          label={value as any}
          size="small"
          sx={{
            backgroundColor: style.bg,
            color: style.color,
            height: 24,
            borderRadius: "999px",
            fontSize: "12px",
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

export default function WorkersTable() {
  const [workers] = useState<Worker[]>(INITIAL_WORKERS);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // columnStates is the committed state — the table renders from this
  const [columnStates, setColumnStates] = useState<ColumnState[]>(
    buildColumnStates(WORKER_COLUMNS)
  );
  const navigate = useNavigate();

  const ROWS_PER_PAGE = 5;

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      worker.workerId.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedWorkers = filteredWorkers.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredWorkers.length / ROWS_PER_PAGE);

  const rowActions: RowAction<Worker>[] = [
    {
      label: "Edit",
      icon: <EditOutlined sx={{ fontSize: 14, color: "#7F7F7F" }} />,
      onClick: (row) =>
        navigate("/create-worker", {
          state: {
            mode: "edit",
            workerId: row.id,
          },
        }),
    },
    {
      label: "View",
      icon: (
        <VisibilityOutlinedIcon
          sx={{ fontSize: 14, color: "#7F7F7F" }}
        />
      ),
      onClick: (row) =>
        navigate("/create-worker", {
          state: {
            mode: "view",
            workerId: row.id,
          },
        }),
    },
    {
      label: "Delete",
      icon: <DeleteIcon height={13} width={11} />,
      sx: { color: "#7F7F7F" },
      onClick: (row) => console.log("Delete", row),
    },
  ];

  return (
    <Box>
      <TableComponent
        rows={paginatedWorkers}
        columns={WORKER_COLUMNS}
        rowActions={rowActions}
        totalPages={totalPages}
        currentPage={currentPage}
        searchValue={searchValue}
        searchPlaceholder="Search here..."
        columnStates={columnStates}
        onColumnStatesChange={setColumnStates}
        onSearch={(value) => {
          setSearchValue(value);
          setCurrentPage(1);
        }}
        onPageChange={setCurrentPage}
        onExportData={() => console.log("Export")}
        onFilter={() => console.log("Filter")}
        customLabel="Add Worker"
        onCustomChange={() =>
          navigate("/create-worker", {
            state: {
              mode: "create",
            },
          })
        }
      />
    </Box>
  );
}