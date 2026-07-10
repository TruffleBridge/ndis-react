import {
  Avatar,
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useEffect, useMemo, useState } from "react";
import {
  TableComponent,
  type ColumnDef,
  type ColumnState,
  type RowAction,
} from "../../components";
import { useVerificationQueueStore } from "../../store/useVerification";
import dayjs from "dayjs";
import { formatStatus } from "../../utils/menuUtils";
import { cta, VerifyStyles } from "./style";

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

  const [selected, setSelected] = useState<"client" | "worker">("client");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  // row action
  const rowActions: RowAction<VerificationRow>[] = [
    {
      label: "View",
      icon: (
        <VisibilityOutlinedIcon
          sx={{
            fontSize: 16,
            color: "#7F7F7F",
          }}
        />
      ),
      onClick: (row) => {
        console.log(
          "View",
          row
        );
      },
    },
  ];

  // tab function
  const handleTab = (val: any) => {
    setSelected(val);
    setCurrentPage(1);
  }

  //table search function with api call
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
    getVerificationQueue({
      offset: 0,
      limit: ROWS_PER_PAGE,
      search: value,
      type: selected,
    });
  }

  // page changing function
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getVerificationQueue({
      offset: (page - 1) * ROWS_PER_PAGE,
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

  return (

    <Box>
      {/* Client / Worker Toggle */}
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
        currentPage={currentPage}
        searchValue={searchValue}
        columnStates={columnStates}
        onColumnStatesChange={setColumnStates}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onExportData={() => { }}
        onFilter={() => { }}
      />
    </Box>
  );
}