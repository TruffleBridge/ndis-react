// src/pages/admin/auditLogs/AuditLogsPage.tsx
import { Box, Avatar, Chip, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { FilterPopover, FormLabel, Loading, TableComponent, type ColumnDef, type ColumnState, type RowAction } from "@/components";
import { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import { useAuditStore } from "@/store/auditStore";
import type { AuditLogItem } from "@/types/audit";
import { AuditDetailsDrawer, EntityHistoryDrawer, UserHistoryDrawer } from "@/components/audit";
import { useRowSelection } from "@/hooks/useRowSelection";
import dayjs from "dayjs";

interface AuditProps {
    [key: string]: unknown;
    actorName?: string;
    changedAt: string;
    actorEmail?: string;
    actorRole?: string;
    action?: string;
    entityType: string;
    entityLabel: string;
    source?: string;
    changes?: any;
}

function buildColumnStates<T>(cols: ColumnDef<T>[]): ColumnState[] {
    return cols.map((col) => ({ key: col.headerName, visible: true }));
}

const ACTION_STYLES: Record<string, { backgroundColor: string; color: string }> = {
    CREATE: { backgroundColor: "#D9F7E5", color: "#07AB48" },
    UPDATE: { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
    DELETE: { backgroundColor: "#FEE2E2", color: "#DC2626" },
};

const formatDateTime = (iso?: string) => {
    if (!iso) return "-";
    try {
        const d = new Date(iso);
        return d.toLocaleString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
};

export default function AuditLogsPage() {
    const { auditLogs, pagination, error, loading, fetchAuditLogs, setFilters, entityOption } = useAuditStore();
    const [searchValue, setSearchValue] = useState("");
    const [filter, setFilter] = useState<{ action: any[]; entityType: any[]; startDate: Dayjs | null; endDate: Dayjs | null; search: string }>({
        action: [],
        entityType: [],
        startDate: null,
        endDate: null,
        search: "",
    });
    const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [entityHistoryOpen, setEntityHistoryOpen] = useState(false);
    const [userHistoryOpen, setUserHistoryOpen] = useState(false);
    const [activeEntity, setActiveEntity] = useState<{ type: string; id: number } | null>(null);
    const [activeUserId, setActiveUserId] = useState<number | null>(null);

    const { selectedRows, handleSelectAll, handleSelectRow } = useRowSelection<any>();

    const AUDIT_COLUMNS: ColumnDef<AuditProps>[] = [
        {
            headerName: "Actor Name",
            field: "actorName",
            render: (_value, row) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#E5E7EB", color: "#374151", fontSize: 14 }}>
                        {row.actorName?.[0] ?? "-"}
                    </Avatar>
                    <Typography>{row.actorName ?? "-"}</Typography>
                </Box>
            ),
        },
        { headerName: "Actor Email", field: "actorEmail" },
        { headerName: "Role", field: "actorRole" },
        {
            headerName: "Date & Time",
            field: "changedAt",
            render: (value) => <Typography>{formatDateTime(value as string)}</Typography>,
        },
        {
            headerName: "Action",
            field: "action",
            render: (value) => {
                const label = value as string;
                const style = ACTION_STYLES[label] ?? { backgroundColor: "#ECEFF1", color: "#34485F" };
                return (
                    <Chip
                        label={label}
                        size="small"
                        sx={{ ...style, height: 24, fontSize: "12px", fontWeight: 500, borderRadius: "8px" }}
                    />
                );
            },
        },
        // { headerName: "Entity", field: "entityType" },
        // { headerName: "Entity Label", field: "entityLabel" },
        // { headerName: "Source", field: "source" },
        // {
        //     headerName: "Changes",
        //     field: "changes",
        //     render: (value) => (
        //         <Typography sx={{ maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        //             {typeof value === "string" ? value : JSON.stringify(value)}
        //         </Typography>
        //     ),
        // },
    ];

    const [columnStates, setColumnStates] = useState<ColumnState[]>(buildColumnStates(AUDIT_COLUMNS));
    const ROWS_PER_PAGE = 10;

    const rowActions: RowAction<AuditProps>[] = [
        {
            label: "View",
            icon: <VisibilityOutlinedIcon sx={{ fontSize: 16, color: "#7F7F7F" }} />,
            onClick: (row: any) => {
                setSelectedLog(row);
                setDetailsOpen(true);
            },
        },
    ];

    useEffect(() => {
        fetchAuditLogs({ page: 1, limit: ROWS_PER_PAGE });
    }, []);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        fetchAuditLogs({ search: value, page: 1, limit: ROWS_PER_PAGE });
    };

    const handlePageChange = (page: number) => {
        const offset = page;
        fetchAuditLogs({ page: offset, limit: ROWS_PER_PAGE, search: searchValue });
    };

    const handleApplyFilter = () => {
        const payload = {
            action: filter.action.map((x: any) => x.value).join(",") || undefined,
            entityType: filter.entityType.map((x: any) => x.label).join(",") || undefined,
            fromDate: filter.startDate ? filter.startDate.toISOString() : undefined,
            toDate: filter.endDate ? filter.endDate.toISOString() : undefined,
            page: 1,
            limit: ROWS_PER_PAGE,
        };

        setFilters(payload);
        fetchAuditLogs(payload, true);
    };

    const handleClear = () => {
        setFilter({
            action: [],
            entityType: [],
            startDate: null,
            endDate: null,
            search: "",
        });
        const payload = {
            action: undefined,
            entityType: undefined,
            fromDate: undefined,
            toDate: undefined,
            page: 1,
            limit: ROWS_PER_PAGE,
        };


        setFilters({});
        fetchAuditLogs(payload);
    };
    const rows = auditLogs?.map((item) => ({
        ...item,
        changedAt: item.changedAt,
    })) ?? [];


    const filterJson = [
        {
            id: "action",
            label: "Action",
            multiple: true,
            options: [
                { label: "Create", value: "CREATE" },
                { label: "Update", value: "UPDATE" },
                { label: "Replace", value: "REPLACE" },
                { label: "Delete", value: "DELETE" },
            ],
            value: filter.action,
            onChange: (val: any) =>
                setFilter((prev) => ({
                    ...prev,
                    action: val,
                })),
        },
        {
            id: "entityType",
            label: "Entity Type",
            multiple: true,
            options: entityOption,
            value: filter.entityType,
            onChange: (val: any) =>
                setFilter((prev) => ({
                    ...prev,
                    entityType: val,
                })),
        },
    ]

    return (
        <Box>
            <FormLabel label={'Audit Logs (History)'} sxText={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 600, mb: 2 }} />
            {loading && <Loading />}
            {error && <Typography color="error">{error}</Typography>}
            <TableComponent
                rows={rows}
                columns={AUDIT_COLUMNS}
                rowActions={rowActions}
                totalPages={pagination.totalPages}
                currentPage={pagination.page === 1 ? 1 : pagination.page}
                searchValue={searchValue}
                noData="No audit records found"
                noDataSubTitle="There is no audit data available."
                searchPlaceholder="Search audit logs..."
                columnStates={columnStates}
                onColumnStatesChange={setColumnStates}
                onSearch={handleSearch}
                onPageChange={handlePageChange}
                selectedRows={selectedRows}
                onSelectAll={handleSelectAll}
                onSelectRow={handleSelectRow}
                showExport={false}
                filterChildren={
                    <FilterPopover
                        buttonLabel="Filter"
                        selects={filterJson}
                        dates={[
                            {
                                id: "startDate",
                                label: "From Date",
                                value: filter.startDate,
                                disableFuture: true,
                                onChange: (value) =>
                                    setFilter((prev) => ({
                                        ...prev,
                                        startDate: value,
                                    })),
                            },
                            {
                                id: "endDate",
                                label: "To Date",
                                value: filter.endDate,
                                minDate: dayjs(filter.startDate),
                                disableFuture: true,
                                onChange: (value) =>
                                    setFilter((prev) => ({
                                        ...prev,
                                        endDate: value,
                                    })),
                            },
                        ]}
                        disabled={
                            !filter.action.length &&
                            !filter.entityType.length &&
                            !filter.startDate &&
                            !filter.endDate
                        }
                        onApply={handleApplyFilter}
                        onClear={handleClear}
                    />
                }
            />
            <AuditDetailsDrawer
                open={detailsOpen}
                log={selectedLog}
                onClose={() => setDetailsOpen(false)}
                onViewEntityHistory={(type, id) => {
                    setDetailsOpen(false);
                    setActiveEntity({ type, id });
                    setEntityHistoryOpen(true);
                }}
                onViewUserHistory={(id) => {
                    setDetailsOpen(false);
                    setActiveUserId(id);
                    setUserHistoryOpen(true);
                }}
            />
            <EntityHistoryDrawer
                open={entityHistoryOpen}
                entityType={activeEntity?.type ?? null}
                entityId={activeEntity?.id ?? null}
                onClose={() => setEntityHistoryOpen(false)}
            />
            <UserHistoryDrawer
                open={userHistoryOpen}
                userId={activeUserId}
                onClose={() => setUserHistoryOpen(false)}
            />
        </Box>
    );
}