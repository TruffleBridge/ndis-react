import { Box, Chip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { TableComponent, type ColumnDef, type ColumnState, type RowAction } from "../../components";
import { useState } from "react";
import { DeleteIcon } from "../../assets";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@mui/icons-material";

interface RoleProps {
  id: number;
  roleName: string;
  accessModules: string;
  users: number;
  accessLevel: string | "Full" | "Limited";
  status: string | "Active" | "Inactive";
  startDate: string;
  endDate: string;
  lastUpdated: string;

  [key: string]: unknown;
}

const STATUS_STYLES = {
  Active: {
    backgroundColor: "#DCFCE7",
    color: "#16A34A",
  },
  Inactive: {
    backgroundColor: '#ECEFF1', color: '#34485F'
  },
};

const INITIAL_ROLES: RoleProps[] = [
  {
    id: 1,
    roleName: "Super Admin",
    accessModules: "All Modules",
    users: 2,
    accessLevel: "Full",
    status: "Active",
    startDate: "01/01/2021",
    endDate: "11/30/2024",
    lastUpdated: "11/30/2024",
  },
  {
    id: 2,
    roleName: "Support Coordinator",
    accessModules: "Jobs and Clients",
    users: 1,
    accessLevel: "Limited",
    status: "Active",
    startDate: "10/02/2021",
    endDate: "11/22/2024",
    lastUpdated: "11/22/2024",
  },
  {
    id: 3,
    roleName: "Operations Admin",
    accessModules: "Jobs and Workers",
    users: 1,
    accessLevel: "Limited",
    status: "Active",
    startDate: "07/06/2024",
    endDate: "12/31/2024",
    lastUpdated: "12/31/2024",
  },
  {
    id: 4,
    roleName: "Finance Admin",
    accessModules: "Payments",
    users: 1,
    accessLevel: "Limited",
    status: "Inactive",
    startDate: "09/04/2021",
    endDate: "11/28/2024",
    lastUpdated: "11/28/2024",
  },
];

const ROLES_COLUMNS: ColumnDef<RoleProps>[] = [
  {
    headerName: "ID",
    field: "id",
  },
  {
    headerName: "Role Name",
    field: "roleName",
    render: (_value, row) => (
      <span
        style={{
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        {row?.roleName}
      </span>
    ),
  },
  {
    headerName: "Access Modules",
    field: "accessModules",
  },
  {
    headerName: "# of Users",
    field: "users",
  },
  {
    headerName: "Access Level",
    field: "accessLevel",
  },
  {
    headerName: "Status",
    field: "status",
    render: (value) => {
      const label = value as string;
      const style =
        STATUS_STYLES[value as keyof typeof STATUS_STYLES];

      return (
        <Chip
          label={label}
          size="small"
          sx={{
            ...style,
            height: 24,
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 500,
          }}
        />
      );
    },
  },
  {
    headerName: "Start Date",
    field: "startDate",
  },
  {
    headerName: "End Date",
    field: "endDate",
  },
  {
    headerName: "Last Updated by",
    field: "lastUpdated",
  },
];

// Helper: build initial ColumnState[] from a ColumnDef[]
function buildColumnStates<T>(cols: ColumnDef<T>[]): ColumnState[] {
  return cols.map((col) => ({ key: col.headerName, visible: true }));
}

export default function RolesAndPermissionTable() {
  const [roles] = useState<RoleProps[]>(INITIAL_ROLES);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // columnStates is the committed state — the table renders from this
  const [columnStates, setColumnStates] = useState<ColumnState[]>(
    buildColumnStates(ROLES_COLUMNS)
  );
  const navigate = useNavigate();

  const ROWS_PER_PAGE = 5;

  const filteredRoles = roles.filter(
    (role) =>
      role.roleName.toLowerCase().includes(searchValue.toLowerCase()) ||
      role.accessModules.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredRoles.length / ROWS_PER_PAGE);

  const rowActions: RowAction<RoleProps>[] = [
    {
      label: "Edit",
      icon: <EditOutlined sx={{ fontSize: 15, color: "#7F7F7F" }} />,
      onClick: (row) => console.log("Edit", row),
    },
    {
      label: "View",
      icon: <VisibilityOutlinedIcon sx={{ fontSize: 15, color: "#7F7F7F" }} />,
      onClick: (row) => console.log("View", row),
    },
    {
      label: "Delete",
      icon: <DeleteIcon width={11} height={13} />,
      onClick: (row) => console.log("Delete", row),
    },
  ];

  return (
    <Box>
      <TableComponent
        rows={paginatedRoles}
        columns={ROLES_COLUMNS}
        rowActions={rowActions}
        totalPages={totalPages}
        currentPage={currentPage}
        searchValue={searchValue}
        searchPlaceholder="Search here..."
        columnStates={columnStates}
        onColumnStatesChange={setColumnStates}   // only called on "Apply"
        onSearch={(v) => { setSearchValue(v); setCurrentPage(1); }}
        onPageChange={setCurrentPage}
        onExportData={() => console.log("Export")}
        onFilter={() => console.log("Filter")}
        customLabel="Add Role"
        onCustomChange={() => navigate('/create-roles')}
        isHasAction
      />
    </Box>
  );
}