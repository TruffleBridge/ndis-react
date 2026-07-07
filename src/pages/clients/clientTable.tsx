import { Avatar, Box, Chip, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { TableComponent, type ColumnDef, type ColumnState, type RowAction } from "../../components";
import { useState } from "react";
import { DeleteIcon } from "../../assets";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@mui/icons-material";
import type { ClientFormNavState } from "./utils/types";

interface Client {
    id: number;
    clientId: string;
    avatar?: string;
    clientName: string;
    email: string;
    supportType: string;
    assignedWorker: string;
    activeJobs: number;
    location: string;
    fundingType: string;
    clientStatus: "Active" | "Inactive" | "Pending";

    [key: string]: unknown;
}

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

const INITIAL_CLIENTS: Client[] = [
    {
        id: 1,
        clientId: "CL-1042",
        clientName: "Jane Cooper",
        email: "lanasteiner@gmail.com",
        supportType: "Personal Care",
        assignedWorker: "Lana Steiner",
        activeJobs: 2,
        location: "Sydney",
        fundingType: "NDIS / Private",
        clientStatus: "Active",
    },
    {
        id: 2,
        clientId: "CL-1443",
        clientName: "Phoenix Baker",
        email: "phoenixbaker@gmail.com",
        supportType: "Personal Care",
        assignedWorker: "Phoenix Baker",
        activeJobs: 2,
        location: "Melbourne",
        fundingType: "Plan Managed",
        clientStatus: "Pending",
    },
    {
        id: 3,
        clientId: "CL-1443",
        clientName: "Phoenix Baker",
        email: "phoenixbaker@gmail.com",
        supportType: "Personal Care",
        assignedWorker: "Phoenix Baker",
        activeJobs: 2,
        location: "Melbourne",
        fundingType: "Plan Managed",
        clientStatus: "Pending",
    },
    {
        id: 4,
        clientId: "CL-1443",
        clientName: "Phoenix Baker",
        email: "phoenixbaker@gmail.com",
        supportType: "Personal Care",
        assignedWorker: "Phoenix Baker",
        activeJobs: 2,
        location: "Melbourne",
        fundingType: "Plan Managed",
        clientStatus: "Pending",
    },
    // ...remaining rows unchanged from the original list
];

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
    const [clients] = useState<Client[]>(INITIAL_CLIENTS);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [columnStates, setColumnStates] = useState<ColumnState[]>(buildColumnStates(CLIENT_COLUMNS));
    const navigate = useNavigate();

    const ROWS_PER_PAGE = 5;

    const filteredClients = clients.filter(
        (client) =>
            client.clientName.toLowerCase().includes(searchValue.toLowerCase()) ||
            client.email.toLowerCase().includes(searchValue.toLowerCase()) ||
            client.clientId.toLowerCase().includes(searchValue.toLowerCase())
    );

    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredClients.length / ROWS_PER_PAGE);

    // Single helper so Edit/View/Create all navigate the same way - only the
    // nav state differs. ClientFormPage reads this state to decide what mode
    // to boot into and which mock record (if any) to load.
    const goToForm = (state: ClientFormNavState) => navigate("/create-client", { state });

    const rowActions: RowAction<Client>[] = [
        {
            label: "Edit",
            icon: <EditOutlined sx={{ fontSize: 14, color: "#7F7F7F" }} />,
            onClick: (row) => goToForm({ mode: "edit", clientId: row.id }),
        },
        {
            label: "View",
            icon: <VisibilityOutlinedIcon sx={{ fontSize: 14, color: "#7F7F7F" }} />,
            onClick: (row) => goToForm({ mode: "view", clientId: row.id }),
        },
        {
            label: "Delete",
            icon: <DeleteIcon height={13} width={11} />,
            sx: { color: "#7F7F7F" },
            onClick: (row) => console.log("Delete", row),
        },
    ];

    return (
        <Box>
            <TableComponent
                rows={paginatedClients}
                columns={CLIENT_COLUMNS}
                rowActions={rowActions}
                totalPages={totalPages}
                currentPage={currentPage}
                searchValue={searchValue}
                searchPlaceholder="Search here..."
                columnStates={columnStates}
                onColumnStatesChange={setColumnStates}
                onSearch={(v) => { setSearchValue(v); setCurrentPage(1); }}
                onPageChange={setCurrentPage}
                onExportData={() => console.log("Export")}
                onFilter={() => console.log("Filter")}
                customLabel="Add Client"
                onCustomChange={() => goToForm({ mode: "create" })}
            />
        </Box>
    );
}