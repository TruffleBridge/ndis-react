import React, { useState } from "react";
import {
    Box,
    Button,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import {
    AutocompleteField, DateField,
    InputTextField, PageHeader,
    PermissionMatrix,
} from "../../components";
import { RoleIcon } from "../../assets";
import { useNavigate } from "react-router-dom";

// roles
import {
    PERMISSION_ACTIONS,
    PERMISSION_DATA,
} from "../../utils/permissionData";
import type { PermissionRow } from "../../types/permission";
import { ArrowBackIosNewOutlined } from "@mui/icons-material";

interface FormActionsProps {
    onCancel?: () => void;
    onSubmit?: () => void;
    submitLabel?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
    onCancel, onSubmit, submitLabel = "CTA Label"
}) => (
    <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center',
        height: 62,
        px: 3,
        py: "14px",
        bgcolor: "#FFFFFF",
        borderRadius: '8px',
        border: "1px solid #E5E7EB",
        borderTop: 'none',
        textAlign: 'left',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
    }}>
        <div style={{ gap: '14px', display: 'flex', alignItems: 'center' }}>
            <Button
                variant="outlined"
                onClick={onCancel}
                startIcon={<ArrowBackIosNewOutlined />}
                sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#222124",
                    borderColor: "#D1D5DB",
                    borderRadius: "4px",
                    px: 2.5,
                    py: "6px",
                    height: 33,
                    minWidth: '33px',
                    width: '33px',
                    textTransform: "none",
                    "&:hover": { bgcolor: "none" },
                    '& .MuiButton-startIcon': {
                        marginRight: 0
                    }
                }}
            /> <span style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#222124",
                gap: 2
            }}>{'Back'}</span></div>
        <Button
            variant="contained"
            onClick={onSubmit}
            sx={{
                fontSize: "14px",
                fontWeight: 600,
                bgcolor: 'primary.main',
                color: "#FFFFFF",
                borderRadius: "8px",
                px: 2.5,
                py: "6px",
                textTransform: "none",
                height: 40,
                boxShadow: "none",
                minWidth: '130px',
                "&:hover": { boxShadow: "none" },
            }}
        >
            {submitLabel}
        </Button>
    </Box>
);


const box = {
    mx: "auto",
    mt: 2,
    bgcolor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    p: "20px",
    pb: 0
}

const title = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#111827",
}



// main page
const AddNewRolesPage: React.FC = () => {

    const [permissions, setPermissions] =
        useState<PermissionRow[]>(PERMISSION_DATA);

    const navigate = useNavigate();


    const handleSubmit = () => {
        console.log('submitted')

    };

    return (
        <Box>
            {/* Page Header */}
            <PageHeader icon={<RoleIcon color="#6B7280" />} title="Add Role" subtitle="Create Role" />

            <Box sx={{ minHeight: "100vh", mt: 2 }}>

                {/* ── Form body  */}
                <Box sx={{ ...box, mt: 0, mb: 2 }}>
                    {/* ── Personal Information */}
                    <Box sx={{ height: '100%', mb: 2 }}>
                        <Box sx={{ textAlign: 'left', mb: 1 }}>
                            <Typography sx={title}>
                                {"Role Info"}
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>

                            {/* Right Side - Form Fields (6 cols) */}
                            <Grid size={{ xs: 12, md: 12 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <InputTextField
                                            label="Roll ID"
                                            value={'R-123'}
                                            fullWidth
                                            onChange={() => { }}
                                            required
                                            disabled
                                            placeholder="Enter roll ID"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <AutocompleteField
                                            label="Roll Name"
                                            value={{ label: '', value: '' }}
                                            options={[]}
                                            onChange={() => { }}
                                            placeholder="Select roll name"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <AutocompleteField
                                            label="Access Modules"
                                            value={{ label: '', value: '' }}
                                            options={[]}
                                            onChange={() => { }}
                                            placeholder="Select access modules"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <AutocompleteField
                                            label="Status"
                                            value={{ label: '', value: '' }}
                                            options={[]}
                                            onChange={() => { }}
                                            placeholder="Select status"
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <DateField
                                            label="Start Date"
                                            value={null}
                                            onChange={() => { }}
                                            optional
                                        // required
                                        // error={errors.startDate}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <DateField
                                            label="End Date"
                                            value={null}
                                            optional
                                            onChange={() => { }}
                                        // required
                                        // error={errors.startDate}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {/* roles permission section  */}
                <PermissionMatrix
                    title="Core Feature Permissions"
                    actions={PERMISSION_ACTIONS}
                    permissions={permissions}
                    onChange={setPermissions}
                    mainSx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                />

                {/* ── Footer actions  */}
                <FormActions
                    onCancel={() => navigate('/roles-permission')}
                    onSubmit={handleSubmit}
                    submitLabel="Save"
                />
            </Box>
        </Box>

    );
};

export default AddNewRolesPage;