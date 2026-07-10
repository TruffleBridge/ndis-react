import { useEffect, useState } from "react";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { CustomModal, TableComponent, type ColumnDef, type ColumnState, type RowAction } from "../../components";
import { DeleteIcon } from "../../assets";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@mui/icons-material";
import type { Client, ClientFormNavState } from "../../types/client";
import { useClientStore } from "../../store/useClient";

const CLIENT_STATUS_STYLES = {
    Active: {
        backgroundColor: "#D9F7E5",
        color: "#07AB48",
    },
    Inactive: {
        backgroundColor: "#ECEFF1",
        color: "#34485F",
    },
    Pending: {
        backgroundColor: "#FDF0F0",
        color: "#A11A1A",
    },
};

const CLIENT_COLUMNS: ColumnDef<Client>[] = [
    { headerName: "Client ID", field: "clientId" },
    {
        headerName: "Client Name",
        field: "clientName",
        render: (_value, row) => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#E5E7EB", color: "#374151", fontSize: 14 }} src="https://i.pravatar.cc/150" />
                <Typography>{row.clientName}</Typography>
            </Box>
        ),
    },
    { headerName: "Email Address", field: "email" },
    { headerName: "Support Type", field: "supportType" },
    { headerName: "Assigned Worker", field: "assignedWorker" },
    { headerName: "Active Jobs", field: "activeJobs" },
    { headerName: "Location", field: "location" },
    { headerName: "Funding Type", field: "fundingType" },
    {
        headerName: "Client Status",
        field: "clientStatus",
        render: (value) => {
            const style = CLIENT_STATUS_STYLES[value as keyof typeof CLIENT_STATUS_STYLES];
            return (
                <Chip
                    label={value as string}
                    size="small"
                    sx={{ ...style, height: 24, borderRadius: "999px", fontWeight: 500, fontSize: "12px" }}
                />
            );
        },
    },
];

function buildColumnStates<T>(cols: ColumnDef<T>[]): ColumnState[] {
    return cols.map((col) => ({ key: col.headerName, visible: true }));
}

export default function ClientTable() {
    const navigate = useNavigate();
    const [columnStates, setColumnStates] = useState<ColumnState[]>(buildColumnStates(CLIENT_COLUMNS));
    const [stateModal, setStateModal] = useState(false);

    // All data + list actions now live in the store (getTableApi under the hood).
    const clients = useClientStore((s) => s.clients);
    const clientsLoading = useClientStore((s) => s.clientsLoading);
    const searchValue = useClientStore((s) => s.searchValue);
    const currentPage = useClientStore((s) => s.currentPage);
    const totalPages = useClientStore((s) => s.totalPages);
    const fetchClients = useClientStore((s) => s.fetchClients);
    const setSearchValue = useClientStore((s) => s.setSearchValue);
    const setCurrentPage = useClientStore((s) => s.setCurrentPage);
    const deleteClient = useClientStore((s) => s.deleteClient);
    const status = useClientStore((s) => s.status);
    const updateState = useClientStore((s) => s.updateState);
    const getStatusUpdate = useClientStore((s) => s.getStatusUpdate);

    // Refetch whenever search text or page changes.
    useEffect(() => {
        fetchClients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue, currentPage]);

    // Single helper so Edit/View/Create all navigate the same way - only the
    // nav state differs. ClientFormPage reads this state to decide what mode
    // to boot into and which record (if any) to load.
    const goToForm = (state: ClientFormNavState) => navigate("/create-client", { state });

    const getRowActions = (row: Client): RowAction<Client>[] => [
        ...(row.clientStatus === "Active"
            ? [
                {
                    label: "Status",
                    icon: <EditOutlined sx={{ fontSize: 14, color: "#7F7F7F" }} />,
                    onClick: (row: Client) => {
                        getStatusUpdate(row.id);
                        setStateModal(true);
                    },
                },
                {
                    label: "Edit",
                    icon: <EditOutlined sx={{ fontSize: 14, color: "#7F7F7F" }} />,
                    onClick: (row: Client) =>
                        goToForm({ mode: "edit", clientId: row.id }),
                },
                {
                    label: "Delete",
                    icon: <DeleteIcon height={13} width={11} />,
                    sx: { color: "#7F7F7F" },
                    onClick: (row: Client) => deleteClient(row.id),
                },
            ]
            : []),

        {
            label: "View",
            icon: (
                <VisibilityOutlinedIcon
                    sx={{ fontSize: 14, color: "#7F7F7F" }}
                />
            ),
            onClick: (row) => goToForm({ mode: "view", clientId: row.id }),
        },
    ];

    return (
        <Box>
            <TableComponent
                rows={clients}
                columns={CLIENT_COLUMNS}
                rowActions={getRowActions}
                totalPages={totalPages}
                currentPage={currentPage}
                noData="No client records found"
                noDataSubTitle="There is no data available to display at the moment."
                isLoading={clientsLoading}
                searchValue={searchValue}
                searchPlaceholder="Search ClientId, Client name"
                columnStates={columnStates}
                onColumnStatesChange={setColumnStates}
                onSearch={setSearchValue}
                onPageChange={setCurrentPage}
                onExportData={() => console.log("Export")}
                onFilter={() => console.log("Filter")}
                customLabel="Add Client"
                onCustomChange={() => goToForm({ mode: "create" })}
            />
            <CustomModal
                open={stateModal}
                onClose={() => setStateModal(false)}
                type="success"
                showStatusSwitch
                onStatusChange={updateState}
                status={status}
                title="Client Successfully Created!"
                description="Welcome to Nimora. Your profile is ready, and you can now start finding the right support workers for your needs."
            />
        </Box>
    );
}