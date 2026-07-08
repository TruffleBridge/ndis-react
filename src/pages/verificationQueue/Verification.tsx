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
  Loading,
  NoDataFound,
  TableComponent,
  type ColumnDef,
  type ColumnState,
  type RowAction,
} from "../../components";
import { useVerificationQueueStore } from "../../store/useVerification";

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
  Completed: {
    backgroundColor: "#FFF0D8",
    color: "#B6760E",
  },

  Inprogress: {
    backgroundColor: "#EBF1FD",
    color: "#1442A7",
  },

  Pending: {
    backgroundColor: "#F3F4F6",
    color: "#374151",
    borderColor: "#D1D5DB",
  },

  High: {
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

  const [selected, setSelected] = useState<"client" | "worker" | string>("client");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 10;

  useEffect(() => {
    getVerificationQueue({
      offset: 0,
      limit: ROWS_PER_PAGE,
      search: "",
      type: selected,
    });
  }, [selected]);

  /*
      API response mapping-> Table data
  */
  const tableRows = useMemo(() => {
    return workers.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      applicationDate: item.applicationDate,
      documentStatus: item.documentStatus,
      verificationType: item.verificationType,
      status: item.status,
      avatar: item.avatar,
    }));
  }, [workers]);


  // column name
  const columns: ColumnDef<VerificationRow>[] = [
    {
      headerName: "Worker Name",
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
            src={row.avatar}
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#E5E7EB",
              color: "#374151",
              fontSize: 14,
            }}
          />
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
            }}>
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
        const label =
          value as string;
        const style =
          STATUS_STYLES[label] ?? {};
        return (
          <Chip
            label={label}
            size="small"
            sx={{
              ...style,
              height: 24,
              borderRadius:
                "12px",
              fontSize: 12,
              fontWeight: 500,
              border:
                style.borderColor ? `1px solid ${style.borderColor}` : "none",
            }}
          />
        );
      },
    },
  ];

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
  const handleTab = (val: string) => {
    setSelected(val);
    setCurrentPage(1);
    getVerificationQueue({
      offset: 0,
      limit: ROWS_PER_PAGE,
      search: searchValue,
      type: val,
    });
  }

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
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    getVerificationQueue({
      offset: (page - 1) * ROWS_PER_PAGE,
      limit: ROWS_PER_PAGE,
      search: searchValue,
      type: selected,
    });
  }

  return (

    <Box>
      {/* Client / Worker Toggle */}
      <Box
        sx={{
          backgroundColor: "#EFEFEF",
          padding: "6px",
          borderRadius: "50px",
          display: "flex",
          gap: 1,
          width: "fit-content",
          marginBottom: 2,
        }}
      >
        <Button
          disableRipple
          onClick={() => handleTab("client")}
          sx={{
            minWidth: 140,
            height: 36,
            borderRadius: "50px",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            color:
              selected === "client"
                ? "#FFFFFF"
                : "#6F6F6F",
            backgroundColor:
              selected === "client"
                ? "#086D63"
                : "transparent",
            "&:hover": {
              backgroundColor: selected === "client" ? "#086D63" : "transparent",
            },
          }}
        >
          Clients
        </Button>

        <Button
          disableRipple
          onClick={() => handleTab("worker")}
          sx={{
            minWidth: 140,
            height: 36,
            borderRadius: "50px",
            textTransform: "none",
            fontSize: 14,
            fontWeight: 500,
            color: selected === "worker" ? "#FFFFFF" : "#6F6F6F",
            backgroundColor:
              selected === "worker" ? "#086D63" : "transparent",
            "&:hover": {
              backgroundColor: selected === "worker" ? "#086D63" : "transparent",
            },
          }}
        >
          Support Worker
        </Button>
      </Box>

      {/* Table */}
      {
        loading ? (
          <Loading />
        ) : tableRows.length === 0 ? (
          <NoDataFound message="No verification records found" />
        ) : (
          <TableComponent
            rows={tableRows}
            columns={columns}
            rowActions={rowActions}
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
        )
      }
    </Box>
  );
}