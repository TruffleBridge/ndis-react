import {
  Avatar,
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  Loading,
  TableComponent,
  type ColumnDef,
  type ColumnState,
  type RowAction,
} from "@/components";
import { useVerificationQueueStore } from "@/store/useVerification";
import dayjs from "dayjs";
import { formatStatus } from "@/utils/menuUtils";
import { cta, VerifyStyles } from "./style";
import { useExportStore } from "@/store/useExportStore";
import { usePermission } from "@/hooks/usePermission";
import { useRowSelection } from "@/hooks/useRowSelection";
import { VisibilityOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface VerificationRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  applicationDate: string;
  documentStatus: string;
  verificationType: string;
  status: string;
  avatar?: string;
}


const STATUS_STYLES: Record<
  string,
  {
    backgroundColor: string;
    color: string;
    borderColor?: string;
  }
> = {
  completed: {
    backgroundColor: "#FFF0D8",
    color: "#B6760E",
  },

  inprogress: {
    backgroundColor: "#EBF1FD",
    color: "#1442A7",
  },

  pending: {
    backgroundColor: "#F3F4F6",
    color: "#374151",
    borderColor: "#D1D5DB",
  },

  high: {
    backgroundColor: "#EAECF0",
    color: "#34485F",
  },
};

function buildColumnStates<T>(
  columns: ColumnDef<T>[]
): ColumnState[] {
  return columns.map((column) => ({
    key: column.headerName,
    visible: true,
  }));
}

export default function VerificationTable() {
  const {
    workers,
    total,
    loading,
    getVerificationQueue,
  } = useVerificationQueueStore();
  const navigate = useNavigate()


  // checkbox functions
  const {
    selectedRows,
    handleSelectAll,
    handleSelectRow,
  } = useRowSelection<any>();

  // export download data
  const exportExcel = useExportStore((s) => s.exportExcel);
  const isLoading = useExportStore((s) => s.loading);

  // roles based on access
  const { canExport } = usePermission('Verification');


  const [selected, setSelected] = useState<"client" | "worker">("client");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const ROWS_PER_PAGE = 10;

  /*
      API response mapping-> Table data
  */
  const tableRows = useMemo(() => {
    return workers.map((item) => ({
      id: item.id,
      name: item.fullName,
      email: item.email,
      phone: item.phone,
      applicationDate: dayjs(item.createdAt).format('MM/DD/YYYY'),
      documentStatus: item.uploadedDocumentCount,
      verificationType: item.verificationType,
      status: item.status,
    }));
  }, [workers]);


  // column name
  const columns = useMemo<ColumnDef<VerificationRow>[]>(() => [
    {
      headerName:
        selected === "client"
          ? "Clients"
          : "Support Worker",

      field: "name",

      render: (_, row) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            src={row?.avatar || ""}
            sx={VerifyStyles.avatarSx}
          >{row.name[0]}</Avatar>

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 400,
            }}
          >
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
      headerName: "Application Date",
      field: "applicationDate",
    },

    {
      headerName: "Document Status",
      field: "documentStatus",
    },

    {
      headerName: "Verification Type",
      field: "verificationType",
    },

    {
      headerName: "Status",
      field: "status",

      render: (value) => {

        const key = formatStatus(value as string);

        const style =
          STATUS_STYLES[key?.toLowerCase()] ?? {};

        return (
          <Chip
            label={key}
            size="small"
            sx={{
              ...style,
              height: 24,
              borderRadius: "12px",
              fontSize: 12,
              fontWeight: 500,
              border: style.borderColor
                ? `1px solid ${style.borderColor}`
                : "none",
            }}
          />
        );
      },
    },

  ], [selected]);

  const [columnStates, setColumnStates] = useState<ColumnState[]>(
    buildColumnStates(columns)
  );

  // row actions 
  const rowActions: RowAction<VerificationRow>[] = [
    {
      label: "View",
      icon: <VisibilityOutlined sx={{ fontSize: 16, color: '#7F7F7F' }} />,
      onClick: (row) => navigate(`/verification-details/${row?.id}`),
    },
    // {
    //   label: "Delete",
    //   icon: <DeleteIcon />,
    //   sx: { color: "#7F7F7F" },
    //   onClick: (row) => console.log("Delete", row),
    // },
  ];

  // tab function
  const handleTab = (val: any) => {
    setSelected(val);
    setCurrentPage(0);
  }

  //table search function with api call
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
    getVerificationQueue({
      offset: 0,
      limit: ROWS_PER_PAGE,
      search: value,
      type: selected,
    });
  }

  // page changing function
  const handlePageChange = (page: number) => {
    const offset = (page - 1) * ROWS_PER_PAGE;

    setCurrentPage(page - 1);
    getVerificationQueue({
      offset: offset,
      limit: ROWS_PER_PAGE,
      search: searchValue,
      type: selected,
    });
  }

  // tab to changing table name updating funciton
  useEffect(() => {
    setColumnStates(
      buildColumnStates(columns)
    );
  }, [columns]);

  // initial time calling api
  useEffect(() => {
    getVerificationQueue({
      offset: 0,
      limit: ROWS_PER_PAGE,
      search: "",
      type: selected,
    });
  }, [selected]);


  const handleExport = () => {
    const visibleColumns = columnStates.filter((column) => column.visible).map((column) => column.key);
    exportExcel("/admin/verificationQueue/export", {
      customizeTable: visibleColumns ?? [],
      type: selected,
      ...(selectedRows?.length > 0 && {
        ids: selectedRows?.map((v) => v.id),
      }),
    });
  }



  return (

    <Box>
      {/* Client / Worker Toggle */}
      {(loading || isLoading) && <Loading />}
      <Box
        sx={VerifyStyles.mainSx}
      >
        <Button
          disableRipple
          onClick={() => handleTab("client")}
          sx={cta(selected, "client")}

        >
          Clients
        </Button>

        <Button
          disableRipple
          onClick={() => handleTab("worker")}
          sx={cta(selected, "worker")}
        >
          Support Worker
        </Button>
      </Box>

      {/* Table */}
      <TableComponent
        rows={tableRows}
        columns={columns}
        rowActions={rowActions}
        searchPlaceholder={selected === 'client' ? 'Search Client name' : 'Search Support Worker name'}
        noData="No verification records found"
        noDataSubTitle="There is no data available to display at the moment."
        isLoading={loading}
        totalPages={Math.ceil(total / ROWS_PER_PAGE)}
        currentPage={currentPage + 1}
        searchValue={searchValue}
        columnStates={columnStates}
        onColumnStatesChange={setColumnStates}
        onSearch={handleSearch}
        showExport={canExport}
        onPageChange={handlePageChange}
        onExportData={() => handleExport()}
        //checkbox
        selectedRows={selectedRows}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
      />
    </Box>
  );
}