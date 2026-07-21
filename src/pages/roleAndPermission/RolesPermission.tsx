import { Box, Chip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Loading,
  TableComponent,
  type ColumnDef,
  type ColumnState,
  type RowAction,
} from "@/components";
import { useEffect, useState } from "react";
import { DeleteIcon } from "../../assets";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@mui/icons-material";
import { useRoles } from "@/store/useRoles";
import { formatDate } from "@/utils/helper";

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
    backgroundColor: "#ECEFF1",
    color: "#34485F",
  },
};

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

function buildColumnStates<T>(cols: ColumnDef<T>[]): ColumnState[] {
  return cols.map((col) => ({
    key: col.headerName,
    visible: true,
  }));
}

export default function RolesAndPermissionTable() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    roles,
    totalCount,
    getRoles,
    listLoading,
  } = useRoles();

  const [columnStates, setColumnStates] = useState<ColumnState[]>(
    buildColumnStates(ROLES_COLUMNS)
  );

  const navigate = useNavigate();

  const ROWS_PER_PAGE = 5;

  const handleEdit = (row: any) => {
    navigate("/create-roles", {
      state: {
        id: row.id,
        mode: "edit",
      },
    });

  }

  const rowActions: RowAction<RoleProps>[] = [
    {
      label: "Edit",
      icon: <EditOutlined sx={{ fontSize: 15, color: "#7F7F7F" }} />,
      onClick: (row) => handleEdit(row),
    },
    {
      label: "View",
      icon: (
        <VisibilityOutlinedIcon
          sx={{ fontSize: 15, color: "#7F7F7F" }}
        />
      ),
      onClick: (row) => console.log("View", row),
    },
    {
      label: "Delete",
      icon: <DeleteIcon width={11} height={13} />,
      onClick: (row) => console.log("Delete", row),
    },
  ];

  const tableRows: RoleProps[] = roles.map((item: any) => ({
    id: item.id,
    roleName: item.name,
    accessModules: item.accessModules?.length
      ? item.accessModules.join(", ")
      : "No Modules",
    users: item.userCount,
    accessLevel:
      item.accessLevel === "LIMITED"
        ? "Limited"
        : "Full",
    status:
      item.status === "ACTIVE"
        ? "Active"
        : "Inactive",
    startDate: formatDate(item.startDate) ?? "-",
    endDate: formatDate(item.endDate) ?? "-",
    lastUpdated: formatDate(item.updatedAt) ?? "-",
  }));

  useEffect(() => {
    getRoles({
      search: searchValue,
      offset: 0,
      limit: ROWS_PER_PAGE * 1,
    });
  }, [
    searchValue,
    currentPage,
  ]);

  const totalPages = Math.ceil(
    totalCount / ROWS_PER_PAGE
  );

  return (
    <Box>
      {listLoading && <Loading />}

      <TableComponent
        rows={tableRows}
        columns={ROLES_COLUMNS}
        rowActions={rowActions}
        totalPages={totalPages}
        currentPage={currentPage}
        searchValue={searchValue}
        searchPlaceholder="Search roles here..."
        noData="No roles records found"
        noDataSubTitle="There is no data available to display at the moment."
        columnStates={columnStates}
        onColumnStatesChange={setColumnStates}
        onSearch={(v) => {
          setSearchValue(v);
          setCurrentPage(1);
        }}
        onPageChange={setCurrentPage}
        onExportData={() => console.log("Export")}
        onFilter={() => console.log("Filter")}
        customLabel="Add Role"
        onCustomChange={() => navigate("/create-roles")}
        isHasAction
      />
    </Box>
  );
}
