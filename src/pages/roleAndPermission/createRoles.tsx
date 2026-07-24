import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import {
    AutocompleteField,
    CustomModal,
    DateField,
    InputTextField,
    Loading,
    PageHeader,
    PermissionMatrix,
} from "@/components";
import { RoleIcon } from "@/assets";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import { useRoles, PERMISSION_ACTIONS, STATUS_OPTIONS } from "@/store/useRoles";
import dayjs from "dayjs";
import { getViewFunction } from "@/utils/viewfunction";

interface FormActionsProps {
    onCancel?: () => void;
    onSubmit?: () => void;
    submitLabel?: string;
    hideSubmit?: boolean;
    submitting?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
    onCancel, onSubmit, submitLabel = "CTA Label", hideSubmit = false, submitting = false,
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
                    '& .MuiButton-startIcon': { marginRight: 0 }
                }}
            /> <span style={{ fontSize: "14px", fontWeight: 600, color: "#222124", gap: 2 }}>{'Back'}</span>
        </div>
        {!hideSubmit && (
            <Button
                variant="contained"
                onClick={onSubmit}
                disabled={submitting}
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
                {submitting ? submitLabel + '...' : submitLabel}
            </Button>
        )}
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
};

const title = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#111827",
};

const AddNewRolesPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const [isSucess, setSuccussModel] = useState(false);

    const mode = location.state?.mode ?? params.mode ?? "add";
    const roleId = Number(location.state?.id ?? params.id);

    const isEdit = mode === "edit";
    const isView = mode === "view";

    const {
        modules,
        form,
        detailsLoading,
        submitting,
        error,
        getModules,
        getRoleById,
        createRole,
        updateRole,
        resetRoleDetails,
        setRoleName,
        setStatus,
        setStartDate,
        setEndDate,
        setSelectedModules,
        setPermissions,
        clearError,
        resetForm,
        formErrors
    } = useRoles();

    // Flow 1: load modules once
    useEffect(() => {
        getModules();
    }, []);

    // Flow 2: clear any stale form data, then fetch role for edit/view.
    // resetRoleDetails() wipes form + roleDetails + prefillPermissions in the store,
    // so "add" mode always starts clean even if the store had edit-mode leftovers.
    useEffect(() => {
        resetRoleDetails();
        if ((isEdit || isView) && roleId) {
            getRoleById(roleId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, isView, roleId]);

    const moduleOptions = useMemo(
        () => modules.map((m) => ({ label: m.moduleName, value: String(m.id) })),
        [modules]
    );

    // Flow 3: submit — store already knows form + roleDetails, page just triggers it
    const handleSubmit = async () => {
        const success =
            isEdit && roleId ? await updateRole(roleId) : await createRole();

        if (success) {
            setSuccussModel(true)
        }
    };

    const pageTitle = isView ? "View Role" : isEdit ? "Edit Role" : "Add Role";
    const loadingDetails = (isEdit || isView) && detailsLoading;

    const handleModalBackPrimary = () => {
        setSuccussModel(false)
        resetForm();
        navigate("/roles-permission");
    };

    const handleModalPrimary = () => {
        setSuccussModel(false)
        resetForm();
        navigate("/roles-permission");
    };

    console.log(formErrors, 'formErrors');

    return (
        <Box>
            {loadingDetails && <Loading />}
            <PageHeader
                icon={<RoleIcon color="#6B7280" />}
                title={pageTitle}
                subtitle={isEdit ? "Edit Role" : isView ? "Role Details" : "Create Role"}
            />

            {error && (
                <Alert severity="error" sx={{ mt: 2 }} onClose={clearError}>
                    {error}
                </Alert>
            )}

            <Box sx={{ minHeight: "100vh", mt: 2 }}>
                <Box sx={{ ...box, mt: 0, mb: 2 }}>
                    <Box sx={{ height: "100%", mb: 2 }}>
                        <Box sx={{ textAlign: "left", mb: 1 }}>
                            <Typography sx={title}>{"Role Info"}</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />


                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 12 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: isView ? 2 : 4 }}>
                                        {isView ? getViewFunction('Roll Name', form.roleName, 'plain') :
                                            <InputTextField
                                                required
                                                label="Roll Name"
                                                value={form.roleName}
                                                onChange={(val: any) => setRoleName(val)}
                                                placeholder="enter roll name"
                                                disabled={isView}
                                                errors={formErrors.roleName}
                                            />}
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: isView ? 3 : 4 }}>
                                        {isView ? getViewFunction('Access Modules', form.selectedModules, 'chip') :
                                            <AutocompleteField
                                                required
                                                label="Access Modules"
                                                multiple
                                                value={form.selectedModules}
                                                options={moduleOptions}
                                                onChange={(val: any) => setSelectedModules(val ?? [])}
                                                placeholder="Select access modules"
                                                disabled={isView}
                                                error={formErrors.selectedModules}
                                            />}
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: isView ? 2 : 4 }}>
                                        {isView ? getViewFunction('Status', form.status?.label, 'plain') :
                                            <AutocompleteField
                                                required
                                                label="Status"
                                                value={form.status}
                                                options={STATUS_OPTIONS}
                                                onChange={(val: any) => setStatus(val)}
                                                placeholder="Select status"
                                                disabled={isView}
                                                error={formErrors.status}
                                            />}
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: isView ? 2 : 3 }}>
                                        {isView ? getViewFunction('Start Date', form.startDate && dayjs(form.startDate).format('MM/DD/YYYY'), 'plain') :
                                            <DateField
                                                label="Start Date"
                                                value={form.startDate ? dayjs(form.startDate) : null}
                                                onChange={(val: any) => setStartDate(val ? val.toDate() : null)}
                                                optional
                                                disablePast
                                                disabled={isView}
                                            />}
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        {isView ? getViewFunction('End Date', form.endDate && dayjs(form.endDate).format('MM/DD/YYYY'), 'plain') :
                                            <DateField
                                                label="End Date"
                                                value={form.endDate ? dayjs(form.endDate) : null}
                                                optional
                                                minDate={dayjs(form.startDate)}
                                                onChange={(val: any) => setEndDate(val ? val.toDate() : null)}
                                                disabled={isView}
                                            />}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <PermissionMatrix
                    title="Core Feature Permissions"
                    actions={PERMISSION_ACTIONS as unknown as string[]}
                    permissions={form.permissions}
                    onChange={setPermissions}
                    disabled={isView}
                    errors={formErrors.permissions}
                    mainSx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                />

                <FormActions
                    onCancel={() => navigate("/roles-permission")}
                    onSubmit={handleSubmit}
                    submitLabel={isEdit ? "Update" : "Save"}
                    hideSubmit={isView}
                    submitting={submitting}
                />
            </Box>
            <CustomModal
                open={isSucess}
                onClose={() => setSuccussModel(false)}
                type="success"
                title={isEdit ? "Roles Successfully Updated!" : "Roles Created Successfully"}
                description="Welcome to Nimora. Your profile is ready, and you can now start finding the right support workers for your needs."
                backText="Back"
                primaryText="Dashboard"
                onBack={handleModalBackPrimary}
                onPrimary={handleModalPrimary}
            />
        </Box>
    );
};

export default AddNewRolesPage;