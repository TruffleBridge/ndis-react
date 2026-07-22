import { useEffect, useState } from "react";
import { Avatar, Box, Chip, Menu, MenuItem, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { CustomModal, Loading, TableComponent, type ColumnDef, type ColumnState, type RowAction } from "@/components";
import { DeleteIcon } from "@/assets";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@mui/icons-material";
import type { Client, ClientFormNavState } from "@/types/client";
import { useClientStore } from "@/store/useClient";
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import { formatStatus } from "@/utils/menuUtils";

const CLIENT_STATUS_STYLES = {
    active: {
        backgroundColor: "#D9F7E5",
        color: "#07AB48",
    },
    inactive: {
        backgroundColor: "#ECEFF1",
        color: "#34485F",
    },
    pending: {
        backgroundColor: "#FDF0F0",
        color: "#A11A1A",
    },
};


function buildColumnStates<T>(cols: ColumnDef<T>[]): ColumnState[] {
    return cols.map((col) => ({ key: col.headerName, visible: true }));
}

export default function ClientTable() {
    const navigate = useNavigate();
    const [stateModal, setStateModal] = useState(false);
    const [values, setValues] = useState<any>();
    const [supportAnchor, setSupportAnchor] = useState<HTMLElement | null>(null);
    const [selectedSupportTypes, setSelectedSupportTypes] = useState<string[]>([]);
    const ROWS_PER_PAGE = 10;


    // All data + list actions now live in the store (getTableApi under the hood).
    const clients = useClientStore((s) => s.clients);
    const clientsLoading = useClientStore((s) => s.clientsLoading);
    const searchValue = useClientStore((s) => s.searchValue);
    const currentPage = useClientStore((s) => s.currentPage);
    const totalPages = useClientStore((s) => s.totalPages);
    const fetchClients = useClientStore((s) => s.fetchClients);
    const setSearchValue = useClientStore((s) => s.setSearchValue);
    const setCurrentPage = useClientStore((s) => s.setCurrentPage);
    const deleteStatus = useClientStore((s) => s.deleteStatus);
    const status = useClientStore((s) => s.status);
    const updateState = useClientStore((s) => s.updateState);
    const getStatusUpdate = useClientStore((s) => s.getStatusUpdate);
    const resetForm = useClientStore((s) => s.resetForm);


    // Refetch whenever search text or page changes.
    useEffect(() => {
        fetchClients({
            offset: 0,
            limit: ROWS_PER_PAGE,
            search: searchValue,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue, currentPage]);

    // Single helper so Edit/View/Create all navigate the same way - only the

    const goToForm = (state: ClientFormNavState) => navigate("/create-client", { state });

    const CLIENT_COLUMNS: ColumnDef<Client>[] = [
        { headerName: "Client ID", field: "clientId" },
        {
            headerName: "Client Name",
            field: "clientName",
            render: (_value, row) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#E5E7EB", color: "#374151", fontSize: 14 }} src={row.avatar}>
                        {row?.clientName[0]}
                    </Avatar>
                    <Typography>{row?.clientName}</Typography>
                </Box>
            ),
        },
        { headerName: "Email Address", field: "email" },
        {
            headerName: "Support Type",
            field: "supportTypes",
            render: (_value, row) => {
                const supportTypes: any = row.supportType ?? [];

                const displayTypes = supportTypes?.length > 0 ? supportTypes?.slice(0, 1) : supportTypes?.slice(0, 1).join(',');
                const extraCount = supportTypes?.length - 1;

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
                            {displayTypes}
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
                                    handleSupportTypeClick(e, supportTypes);
                                }}
                            >
                                +{extraCount}
                            </Typography>
                        )}
                    </Box>
                );
            },
        },
        { headerName: "Assigned Worker", field: "assignedWorker" },
        { headerName: "Active Jobs", field: "activeJobs" },
        { headerName: "Location", field: "location" },
        { headerName: "Funding Type", field: "fundingType" },
        {
            headerName: "Client Status",
            field: "clientStatus",
            render: (value) => {
                const key = formatStatus(value as string);
                const style = key
                    ? CLIENT_STATUS_STYLES[key.toLowerCase() as keyof typeof CLIENT_STATUS_STYLES]
                    : {};
                // const style = CLIENT_STATUS_STYLES[value as keyof typeof CLIENT_STATUS_STYLES];
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
    const [columnStates, setColumnStates] = useState<ColumnState[]>(buildColumnStates(CLIENT_COLUMNS));


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

    // mapped data
    const tableData = clients.map((item: any) => {
        return {
            id: item.id,
            clientId: "CL-" + item?.clientId,
            avatar: item?.profilePicture,
            clientName: item?.firstName,
            email: item?.email,
            supportType: item?.supportTypes?.length ? item?.supportTypes : '-',
            assignedWorker: item?.assignedWorkers?.length ? item?.assignedWorkers : '-',
            activeJobs: item?.activeJobsCount ?? '-',
            location: item?.jobLocations?.length ? item?.jobLocations : '-',
            fundingType: item?.fundingType,
            clientStatus: item?.status,
        }
    })

    const getRowActions = (row: Client): RowAction<Client>[] => [
        {
            label: "Status",
            icon: (
                <AutorenewOutlinedIcon
                    sx={{
                        fontSize: 14,
                        color: "#7F7F7F",
                    }}
                />
            ),
            onClick: () => {
                updateState?.('delete', false)
                setValues(row);
                setStateModal(true);
            },
        },
        ...(row?.clientStatus === "ACTIVE"
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
                            clientId: row.id,
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
                    clientId: row.id,
                }),
        },

        ...(row?.clientStatus === "ACTIVE"
            ? [
                {
                    label: "Delete",
                    icon: <DeleteIcon height={13} width={11} />,
                    sx: {
                        color: "#7F7F7F",
                    },
                    onClick: () => {
                        updateState?.('delete', true)
                        setValues(row);
                        setStateModal(true)
                    },
                },
            ]
            : []),
    ];

    const handleStatueChange = async () => {
        const res = await getStatusUpdate(values?.id)
        if (res) {
            setStateModal(false);
            updateState?.('delete', false)
            updateState?.('status', false)
            fetchClients();
        }
    }

    const handleClose = () => {
        setStateModal(false)
        updateState?.('status', false)
        updateState?.("delete", false);
    };


    return (
        <Box>
            {clientsLoading && <Loading />}
            <TableComponent
                rows={tableData}
                columns={CLIENT_COLUMNS}
                rowActions={getRowActions}
                totalPages={Math.ceil(totalPages / ROWS_PER_PAGE)}
                currentPage={currentPage === 0 ? 1 : currentPage}
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
                onCustomChange={() => {
                    resetForm();
                    goToForm({ mode: "create" })
                }}
            />
            <CustomModal
                open={stateModal}
                onClose={handleClose}
                type="warning"
                showIcon={true}
                showStatusSwitch={!deleteStatus}
                onStatusChange={(e) => updateState?.('status', e)}
                status={status}
                backText={deleteStatus ? "cancel" : ''}
                primaryText="Confirm"
                onBack={handleClose}
                onPrimary={handleStatueChange}
                title={values?.clientName}
                description={deleteStatus ? 'Are you sure you want to delete this client?' : `Your account status is now ${values?.clientStatus}`}
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
                {selectedSupportTypes?.map((type, index) => (
                    <MenuItem key={index}>
                        <Typography
                            sx={{
                                fontSize: "12px",
                                color: "#222214",
                                cursor: "pointer",
                                fontWeight: 400,
                            }}>
                            {type}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}