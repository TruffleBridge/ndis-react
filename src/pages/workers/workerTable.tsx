import { useEffect, useState } from "react";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { CustomModal, Loading, TableComponent, type ColumnDef, type ColumnState, type RowAction } from "@/components";
import {
  DeleteIcon,
  //  MoreCircleIcon, CircleTickIcon
} from "@/assets";
import { useNavigate } from "react-router-dom";
import { AutorenewOutlined, EditOutlined } from "@mui/icons-material";
import type { Worker, WorkerFormNavState } from "@/types/worker";
import { useWorkerStore } from "@/store/useWorker";
import { formatStatus } from "@/utils/menuUtils";

const STATUS_STYLES = {
  active: { backgroundColor: "#D9F7E5", color: "#07AB48" },
  inactive: { backgroundColor: "#ECEFF1", color: "#34485F" },
};

const ALERT_STYLES = {
  None: { bg: "#ECEFF1", color: "#34485F" },
  Due: { bg: "#E6F3FE", color: "#093EB1" },
  Expired: { bg: "#FDF0F0", color: "#A11A1A" },
};

const WORKER_COLUMNS: ColumnDef<Worker>[] = [
  { headerName: "Worker ID", field: "workerId" },
  {
    headerName: "Worker Name",
    field: "name",
    render: (_value, row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "#E5E7EB", color: "#374151", fontSize: 14 }} src={row.avatar} >
          {row?.name[0]}
        </Avatar>
        <Typography>{row.name}</Typography>
      </Box>
    ),
  },
  { headerName: "Email Address", field: "email" },
  { headerName: "Phone Number", field: "phone" },
  { headerName: "Location", field: "location" },
  { headerName: "Upload Document", field: "uploadedDocument" },
  {
    headerName: "Status",
    field: "status",
    render: (value) => {
      const key = formatStatus(value as string);
      const style = key
        ? STATUS_STYLES[key.toLowerCase() as keyof typeof STATUS_STYLES]
        : {};
      // const style = STATUS_STYLES[value as keyof typeof STATUS_STYLES];
      return (
        <Chip
          label={value as string}
          size="small"
          sx={{ ...style, height: 24, borderRadius: "999px", fontWeight: 500, fontSize: "12px" }}
        />
      );
    },
  },
  // {
  //   headerName: "Police",
  //   field: "police",
  //   render: (value) => (value === "verified" ? <CircleTickIcon /> : <MoreCircleIcon />),
  // },
  // {
  //   headerName: "NDIS",
  //   field: "ndis",
  //   render: (value) => (value === "verified" ? <CircleTickIcon /> : <MoreCircleIcon />),
  // },
  {
    headerName: "Alerts",
    field: "alerts",
    render: (value) => {
      const style = ALERT_STYLES[value as keyof typeof ALERT_STYLES];
      return (
        <Chip
          label={value as string}
          size="small"
          sx={{ backgroundColor: style.bg, color: style.color, height: 24, borderRadius: "999px", fontSize: "12px" }}
        />
      );
    },
  },
];

function buildColumnStates<T>(cols: ColumnDef<T>[]): ColumnState[] {
  return cols.map((col) => ({ key: col.headerName, visible: true }));
}

const ROWS_PER_PAGE = 10;


export default function WorkersTable() {
  const navigate = useNavigate();
  const [columnStates, setColumnStates] = useState<ColumnState[]>(buildColumnStates(WORKER_COLUMNS));
  const [stateModal, setStateModal] = useState<'status' | 'delete' | null>(null);
  const [values, setValues] = useState<any>();

  const workers = useWorkerStore((s) => s.workers);
  // const workersLoading = useWorkerStore((s) => s.workersLoading);
  const searchValue = useWorkerStore((s) => s.searchValue);
  const currentPage = useWorkerStore((s) => s.currentPage);
  const totalPages = useWorkerStore((s) => s.totalPages);
  const fetchWorkers = useWorkerStore((s) => s.fetchWorkers);
  const setSearchValue = useWorkerStore((s) => s.setSearchValue);
  const setCurrentPage = useWorkerStore((s) => s.setCurrentPage);
  const deleteWorker = useWorkerStore((s) => s.deleteWorker);
  const workersLoading = useWorkerStore((s) => s.workersLoading);
  const updateWorkerStatus = useWorkerStore((s) => s.updateWorkerStatus);
  const updateState = useWorkerStore((s) => s.updateState);
  const status = useWorkerStore((s) => s.status);

  useEffect(() => {
    fetchWorkers(ROWS_PER_PAGE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, currentPage]);

  const goToForm = (state: WorkerFormNavState) => navigate("/create-worker", { state });

  const getRowActions = (row: Worker): RowAction<Worker>[] => [
    {
      label: "Status",
      icon: (
        <AutorenewOutlined
          sx={{
            fontSize: 14,
            color: "#7F7F7F",
          }}
        />
      ),
      onClick: () => {
        setValues(row);
        setStateModal('status');
      },
    },
    ...(row?.status === "ACTIVE"
      ? [
        {
          label: "Edit",
          icon: (
            <EditOutlined
              sx={{
                fontSize: 14,
                color: "#7F7F7F",
              }}
            />
          ),
          onClick: () =>
            goToForm({
              mode: "edit",
              workerId: row.id,
            }),
        },
      ]
      : []),

    {
      label: "View",
      icon: (
        <VisibilityOutlinedIcon
          sx={{
            fontSize: 14,
            color: "#7F7F7F",
          }}
        />
      ),
      onClick: () =>
        goToForm({
          mode: "view",
          workerId: row.id,
        }),
    },

    ...(row?.status === "ACTIVE"
      ? [
        {
          label: "Delete",
          icon: <DeleteIcon height={13} width={11} />,
          sx: {
            color: "#7F7F7F",
          },
          onClick: () => {
            setValues(row);
            setStateModal('delete')
          },
        },
      ]
      : []),
  ];

  // mapped
  const tableData = workers?.map((item: any) => {
    return {
      id: item.id,
      workerId: "W-" + item?.workerId,
      avatar: item?.profilePicture,
      name: item?.fullName,
      email: item?.email,
      phone: item?.countryCode?.length ? item?.countryCode + ' ' + item?.phone : '' + item?.phone,
      uploadedDocument: item?.uploadedDocumentCount,
      alerts: item?.alerts ?? '-',
      location: item?.addresses?.length ? item?.addresses[0]?.street1 : '-',
      status: item?.status,
      // police: item?.police,
      // ndis: item?.ndis,
    }
  })

  const handleStatueChange = async () => {
    const res = stateModal === 'delete' ? deleteWorker(values?.id) : await updateWorkerStatus(values?.id, status ? "ACTIVE" : "INACTIVE")
    if (res) {
      setStateModal(null);
      // updateState?.('delete', false)
      // updateState?.('status', false)
      fetchWorkers(ROWS_PER_PAGE);
    }
  }

  const handleClose = () => {
    setStateModal(null)
  };


  return (
    <Box>
      {workersLoading && <Loading />}
      <TableComponent
        rows={tableData}
        columns={WORKER_COLUMNS}
        rowActions={getRowActions}
        totalPages={Math.ceil(totalPages / ROWS_PER_PAGE)}
        currentPage={currentPage === 0 ? 1 : currentPage}
        // loading={workersLoading}
        searchValue={searchValue}
        noData="No Worker records found"
        noDataSubTitle="There is no data available to display at the moment."
        searchPlaceholder="Search WorkerId, Worker name..."
        columnStates={columnStates}
        onColumnStatesChange={setColumnStates}
        onSearch={setSearchValue}
        onPageChange={setCurrentPage}
        onExportData={() => console.log("Export")}
        onFilter={() => console.log("Filter")}
        customLabel="Add Worker"
        onCustomChange={() => goToForm({ mode: "create" })}
      />

      <CustomModal
        open={stateModal === 'delete' || stateModal === 'status'}
        onClose={handleClose}
        type="warning"
        showIcon={true}
        showStatusSwitch={stateModal === 'status'}
        onStatusChange={(e) => updateState?.(e)}
        status={status}
        backText={"cancel"}
        primaryText="Confirm"
        onBack={handleClose}
        onPrimary={handleStatueChange}
        title={values?.name}
        description={stateModal === 'delete' ? 'Are you sure you want to delete this worker?' : `Your account status is now ${values?.status}`}
      />
    </Box>
  );
}