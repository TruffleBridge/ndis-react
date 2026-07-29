import { Box, Chip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  CustomModal,
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
import { useExportStore } from "@/store/useExportStore";
import dayjs from "dayjs";
import { usePermission } from "@/hooks/usePermission";

interface RoleProps {
  id: number;
  roleName: string;
  accessModules: string;
  users: number;
  accessLevel: string | "Full" | "Limited";
  status: string | "Active" | "InActive";
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
  InActive: {
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
  const [currentPage, setCurrentPage] = useState(0);
  const [stateModal, setStateModal] = useState(false);
  const [values, setValues] = useState<any>();

  const {
    roles,
    totalCount,
    getRoles,
    listLoading,
    deleteRole,
    resetForm
  } = useRoles();

  // export download data
  const exportExcel = useExportStore((s) => s.exportExcel);
  const isExcelloading = useExportStore((s) => s.loading);

  // roles based on access
  const { canDelete, canExport, canView, canCreate, canUpdate } = usePermission('Roles & Permission');

  const [columnStates, setColumnStates] = useState<ColumnState[]>(
    buildColumnStates(ROLES_COLUMNS)
  );

  const navigate = useNavigate();

  const ROWS_PER_PAGE = 10;

  const handleEdit = (row: any, mode: string) => {
    navigate("/create-roles", {
      state: {
        id: row.id,
        mode: mode,
      },
    });

  }

  const getRowActions = (row: RoleProps): RowAction<RoleProps>[] => [
    ...(canUpdate ? [{
      label: "Edit",
      icon: <EditOutlined sx={{ fontSize: 14, color: "#7F7F7F" }} />,
      onClick: () => handleEdit(row, 'edit'),
    }] : []),

    ...(canView ? [{
      label: "View",
      icon: (
        <VisibilityOutlinedIcon
          sx={{ fontSize: 15, color: "#7F7F7F" }}
        />
      ),
      onClick: () => handleEdit(row, 'view'),
    }] : []),

    ...((row?.status.toLowerCase() === "active" && canDelete)
      ? [{
        label: "Delete",
        icon: <DeleteIcon width={11} height={13} />,
        onClick: () => {
          setValues(row);
          setStateModal(true);
        },
      }] : []),
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
      item.status === "Active"
        ? "Active"
        : "InActive",
    startDate: item.startDate ? dayjs(item.startDate).format('DD/MM/YYYY') : "-",
    endDate: item.endDate ? dayjs(item.endDate).format('DD/MM/YYYY') : "-",
    lastUpdated: item.updatedAt ? dayjs(item.updatedAt).format('DD/MM/YYYY') : "-",
  }));

  useEffect(() => {
    getRoles({
      search: searchValue,
      offset: currentPage ?? 0,
      limit: ROWS_PER_PAGE,
    });
  }, [
    searchValue,
    currentPage,
  ]);

  const totalPages = Math.ceil(totalCount / ROWS_PER_PAGE);
  const handleClose = () => {
    setStateModal(false)
  }

  const handleDelete = async () => {
    const res: any = await deleteRole(values?.id)
    if (res) {
      setStateModal(false)
      getRoles({
        search: searchValue,
        offset: currentPage ?? 0,
        limit: ROWS_PER_PAGE,
      });
    }
  }


  // page changing function
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
    getRoles({
      offset: page - 1,
      limit: ROWS_PER_PAGE,
      search: searchValue,
    });
  }

  const handleExport = () => {
    const columnMapping: Record<string, string> = {
      "ID": "Role ID",
      "# of Users": "User Count",
      "Last Updated by": "Last Updated By"
    };

    const visibleColumns = columnStates
      .filter((column) => column.visible)
      .map((column) => columnMapping[column.key] || column.key);

    exportExcel("/roles/list/export", {
      customizeTable: visibleColumns,
    });
  };

  return (
    <Box>
      {(isExcelloading || listLoading) && <Loading />}

      <TableComponent
        rows={tableRows}
        columns={ROLES_COLUMNS}
        rowActions={getRowActions}
        totalPages={totalPages}
        currentPage={currentPage + 1}
        searchValue={searchValue}
        searchPlaceholder="Search roles here..."
        noData="No roles records found"
        noDataSubTitle="There is no data available to display at the moment."
        columnStates={columnStates}
        onColumnStatesChange={setColumnStates}
        onSearch={(v) => {
          setSearchValue(v);
          setCurrentPage(0);
        }}
        onPageChange={handlePageChange}
        onExportData={() => handleExport()}
        onFilter={() => console.log("Filter")}
        showExport={canExport}
        customLabel={canCreate ? "Add Role" : ''}
        onCustomChange={() => {
          resetForm();
          navigate("/create-roles")
        }}
        isHasAction
      />

      <CustomModal
        open={stateModal}
        onClose={handleClose}
        type="warning"
        backText={"cancel"}
        primaryText="Confirm"
        onBack={handleClose}
        onPrimary={handleDelete}
        title={values?.roleName}
        description={'Are you sure you want to delete this role?'}
      />
    </Box>
  );
}
