import { Avatar, Box, Chip, Menu, MenuItem, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Loading, TableComponent, type ColumnDef, type ColumnState, type RowAction } from "@/components";
import { useEffect, useState } from "react";
import { useJobManagementStore } from "@/store/useJobManagementStore";
import { formatTime } from "@/utils/helper";
import { useExportStore } from "@/store/useExportStore";
import { usePermission } from "@/hooks/usePermission";
import { useRowSelection } from "@/hooks/useRowSelection";

interface JobProps {
  jobId: string;
  avatar?: string;
  name: string;
  workerName: string;
  serviceType?: string;
  serviceDate?: string;
  jobStatus: string;
  shiftTimeAndDate: any;
  location: string;
  paymentStatus: string;
  bookingId?: number | null;
  [key: string]: unknown;
}

const STATUS_STYLES: Record<string, { backgroundColor: string; color: string; borderColor?: string }> = {
  Completed: { backgroundColor: "#ECEFF1", color: "#34485F" },
  Assigned: { backgroundColor: "#EDE9FE", color: "#6D28D9" },
  Pending: { backgroundColor: "#EDE9FE", color: "#6D28D9" },
  High: { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
  Paid: { backgroundColor: '#D9F7E5', color: '#07AB48' },
  Open: { backgroundColor: '#D9F7E5', color: '#07AB48' },
  Failed: { backgroundColor: '#ECEFF1', color: '#34485F' },
};


// Helper: build initial ColumnState[] from a ColumnDef[]
function buildColumnStates<T>(cols: ColumnDef<T>[]): ColumnState[] {
  return cols.map((col) => ({ key: col.headerName, visible: true }));
}

export default function JobTable() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const {
    jobs,
    loading,
    totalCount,
    fetchJobs,
  } = useJobManagementStore();

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
  const { canExport } = usePermission('Verification');

  // format
  const formatShift = (item: any) =>
    `${item.serviceDate} (${formatTime(item.startTime)} - ${formatTime(item.endTime)})`;


  const JOBS_COLUMNS: ColumnDef<JobProps>[] = [
    { headerName: "Job ID", field: "jobId" },
    {
      headerName: "Client Name",
      field: "name",
      // width: 150,
      render: (_value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#E5E7EB", color: "#374151", fontSize: 14 }} src={row?.avatar} >
            {row.name[0]}
          </Avatar>
          <Box>
            <Typography>
              {row.name}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      headerName: "Worker Name",
      field: "workerName",
      // width: 150,
      render: (_value, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#E5E7EB", color: "#374151", fontSize: 14 }} src={row?.avatar}>
            {row.workerName[0]}
          </Avatar>
          <Box>
            <Typography>
              {row.workerName}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { headerName: "Business Name", field: "businessName" },
    { headerName: "Service Type", field: "serviceType" },
    {
      headerName: "Job Status", field: "jobStatus",
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
              borderRadius: "8px",
              border: style.borderColor ? `1px solid ${style.borderColor}` : "none",
            }}
          />
        );
      },
    },
    {
      headerName: "Service Date and Shift Time", field: "shiftTimeAndDate",
      render: (_value, row) => {
        const dateTime = row?.shiftTimeAndDate ?? [];

        const displayTypes = dateTime.slice(0, 1);
        const extraCount = dateTime.length - 1;

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: "#222214",
              }}
            >
              {displayTypes.map((v: any, index: number) => (
                <span key={index}>
                  {formatShift(v)}
                </span>
              ))}
            </Typography>

            {extraCount > 0 && (
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "primary.main",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSupportTypeClick(e, dateTime);
                }}
              >
                +{extraCount}
              </Typography>
            )}
          </Box>
        );
      },
    },
    { headerName: "Location", field: "location" },
    {
      headerName: "Payment Status",
      field: "paymentStatus",
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
              borderRadius: "8px",
              border: style.borderColor ? `1px solid ${style.borderColor}` : "none",
            }}
          />
        );
      },
    },
  ];

  // columnStates is the committed state — the table renders from this
  const [columnStates, setColumnStates] = useState<ColumnState[]>(
    buildColumnStates(JOBS_COLUMNS)
  );
  const [supportAnchor, setSupportAnchor] = useState<HTMLElement | null>(null);
  const [selectedSupportTypes, setSelectedSupportTypes] = useState<string[]>([]);

  const ROWS_PER_PAGE = 10;


  const totalPages = Math.ceil(totalCount / ROWS_PER_PAGE);

  const rowActions: RowAction<JobProps>[] = [
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

  // popover data
  const handleSupportTypeClick = (
    event: React.MouseEvent<HTMLElement>,
    types: string[]
  ) => {
    setSupportAnchor(event.currentTarget);
    setSelectedSupportTypes(types);
  };

  const handleCloseSupport = () => {
    setSupportAnchor(null);
    setSelectedSupportTypes([]);
  };


  useEffect(() => {
    fetchJobs({
      offset: 0,
      limit: ROWS_PER_PAGE,
      search: "",
    });
  }, []);


  //table search function with api call
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(0);
    fetchJobs({
      offset: currentPage,
      limit: ROWS_PER_PAGE,
      search: value,
    });
  }

  // page changing function
  const handlePageChange = (page: number) => {
    const offset = (page - 1) * ROWS_PER_PAGE;

    setCurrentPage(page - 1);
    fetchJobs({
      offset: offset,
      limit: ROWS_PER_PAGE,
      search: searchValue,
    });
  }

  const handleExport = () => {
    const visibleColumns = columnStates.filter((column) => column.visible).map((column) => column.key);
    exportExcel("/admin/jobManagementList/export", {
      customizeTable: visibleColumns ?? [],
      ...(selectedRows?.length > 0 && {
        ids: selectedRows?.map((v) => v.id ? v?.id : v?.jobId),
      }),
    }
    );
  }

  return (
    <Box>
      {(isExcelloading || loading) && <Loading />}
      <TableComponent
        rows={jobs}
        columns={JOBS_COLUMNS}
        rowActions={rowActions}
        totalPages={totalPages}
        currentPage={currentPage + 1}
        searchValue={searchValue}
        noData="No jobs records found"
        noDataSubTitle="There is no data available to display at the moment."
        searchPlaceholder="Search jobs..."
        columnStates={columnStates}
        onColumnStatesChange={setColumnStates}   // only called on "Apply"
        onSearch={(v) => handleSearch(v)}
        onPageChange={handlePageChange}
        showExport={canExport}
        onExportData={() => handleExport()}
        onFilter={() => console.log("Filter")}
        //checkbox
        selectedRows={selectedRows}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
      />
      <Menu
        anchorEl={supportAnchor}
        open={Boolean(supportAnchor)}
        onClose={handleCloseSupport}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "10px",
              p: 0.3,
            },
          },
        }}
      >
        {selectedSupportTypes?.map((item: any, index: number) => (
          <MenuItem key={index}>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#222214",
                fontWeight: 400,
              }}
            >
              {item.serviceDate} ({item.startTime} - {item.endTime})
            </Typography>
          </MenuItem>
        ))}

      </Menu>
    </Box>
  );
}