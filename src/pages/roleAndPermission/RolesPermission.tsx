import { Box, Chip } from "@mui/material";
import {
  CustomModal,
  FilterPopover,
  Loading,
  TableComponent,
  type ColumnDef,
  type ColumnState,
} from "@/components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "@/store/useRoles";
import { useExportStore } from "@/store/useExportStore";
import dayjs from "dayjs";
import { usePermission } from "@/hooks/usePermission";
import { useRowActions } from "@/hooks/useRowActions";
import { useRowSelection } from "@/hooks/useRowSelection";

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
  const [filter, setFilter] = useState<any>({
    modules: null,
    level: null,
    status: null
  });


  const {
    roles,
    totalCount,
    getRoles,
    listLoading,
    deleteRole,
    resetForm,
    modules,
    getModules
  } = useRoles();

  // checkbox functions
  const {
    selectedRows,
    handleSelectAll,
    handleSelectRow,
  } = useRowSelection<any>();

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

  // row actions function
  const getRowActions = (row: RoleProps) =>
    useRowActions({
      row,
      status: row.status,
      canView,
      canUpdate,
      canDelete,

      onEdit: () => handleEdit(row, "edit"),

      onView: () => handleEdit(row, "view"),

      onDelete: () => {
        setValues(row);
        setStateModal(true);
      },
    });

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
    const offset = (page - 1) * ROWS_PER_PAGE;

    setCurrentPage(page - 1);
    getRoles({
      offset: offset,
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
      customizeTable: visibleColumns ?? [],
      ...(selectedRows?.length > 0 && {
        ids: selectedRows?.map((v) => v.id),
      }),
    });
  };


  useEffect(() => {
    getModules();
  }, []);

  // apply filter
  const handleApplyFilter = () => {
    const payload = {
      moduleIds: filter?.modules?.map((v: any) => v?.value) ?? [],
      accessLevel: filter?.level?.value ?? undefined,
      status: filter?.status?.value ?? undefined,
    };

    getRoles({
      offset: currentPage,
      limit: ROWS_PER_PAGE,
      search: searchValue,
    }, {
      filter: payload ?? []
    });
  }
  
  // clear filter
  const handleClear = () => {
    setFilter({
      modules: null,
      level: null,
      status: null
    });
    getRoles({
      offset: currentPage,
      limit: ROWS_PER_PAGE,
      search: searchValue,
    });
  }

  const moduleOptions = modules?.map((m) => ({ label: m?.moduleName, value: m?.id }));

  // filter fields showing
  const filterFields = [
    {
      id: "access-modules",
      label: "Access Modules",
      multiple: true,
      options: moduleOptions,
      value: filter?.modules,
      onChange: (val: any) =>
        setFilter((prev: any) => ({
          ...prev,
          modules: val,
        })),
    },
    {
      id: "access-level",
      label: "Access Level",
      multiple: false,
      options: [
        { label: 'Full', value: "FULL" },
        { label: 'Limited', value: "LIMITED" },
      ],
      value: filter?.level,
      onChange: (val: any) =>
        setFilter((prev: any) => ({
          ...prev,
          level: val,
        }))
    },
    {
      id: "status",
      label: "Status",
      multiple: false,
      options: [
        { label: 'Active', value: true },
        { label: 'InActive', value: false },
      ],
      value: filter?.status,
      onChange: (val: any) =>
        setFilter((prev: any) => ({
          ...prev,
          status: val,
        }))
    },
  ];

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
        showExport={canExport}
        customLabel={canCreate ? "Add Role" : ''}
        onCustomChange={() => {
          resetForm();
          navigate("/create-roles")
        }}
        //filter
        filterChildren={
          <FilterPopover
            buttonLabel="Filter"
            selects={filterFields}
            disabled={!Object.values(filter).some((value) => value)}
            onApply={() => handleApplyFilter()}
            onClear={() => handleClear()}
          />}
        isHasAction
        //checkbox
        selectedRows={selectedRows}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
      />

      <CustomModal
        open={stateModal}
        onClose={handleClose}
        type="warning"
        backText={"Cancel"}
        primaryText="Confirm"
        onBack={handleClose}
        onPrimary={handleDelete}
        title={values?.roleName}
        description={'Are you sure you want to delete this role?'}
      />
    </Box>
  );
}
