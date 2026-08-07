import { useEffect, useState, type ChangeEvent } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    Divider,
    Stack,
    Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/CheckOutlined";
import { useProfileStore } from "@/store/useProfilestore";
import type { AdminProfile } from "@/types/profile";
import { CustomModal, InputTextField, Loading, ProfileUpload } from "@/components";
import { useUploadStore } from "@/store/useUpload";
import { useNavigate } from "react-router-dom";

const ProfileDetails = () => {
    const profile = useProfileStore((s) => s.profile);
    const draftProfile = useProfileStore((s) => s.draftProfile);
    const isEditMode = useProfileStore((s) => s.isEditMode);
    const isSaving = useProfileStore((s) => s.isSaving);
    const enterEditMode = useProfileStore((s) => s.enterEditMode);
    const cancelEdit = useProfileStore((s) => s.cancelEdit);
    const updateProfile = useProfileStore((s) => s.updateProfile);
    const setField = useProfileStore((s) => s.setField);
    const initForm = useProfileStore((s) => s.initForm);
    const getlistLoading = useProfileStore((s) => s.getlistLoading);
    const uploadDocument = useUploadStore((s) => s.uploadDocument);

    // ---- password change state (from store) ----
    const passwordForm = useProfileStore((s) => s.passwordForm);
    const isPasswordSaving = useProfileStore((s) => s.isPasswordSaving);
    const passwordError = useProfileStore((s) => s.passwordError);
    const passwordSuccess = useProfileStore((s) => s.passwordSuccess);
    const setPasswordField = useProfileStore((s) => s.setPasswordField);
    const updatePassword = useProfileStore((s) => s.updatePassword);

    const [isSucess, setSuccussModel] = useState(false);
    const navigate = useNavigate()

    // whichever profile is shown depends on mode
    const data: AdminProfile = isEditMode ? draftProfile : profile;

    const handleChange =
        (field: keyof AdminProfile) =>
            (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setField(field, e.target.value as never);
            };

    const handleFileChange = async (file: any) => {
        const files = file;
        if (!files) {
            setField("avatarUrl", "");
            return;
        }
        // Actually uploads to /api/uploads/, stamps documentType
        const uploaded: any = await uploadDocument(files, "", "avatarUrl");
        if (uploaded) {
            setField("avatarUrl", uploaded?.signedUrl || uploaded?.url);
            setField("url", uploaded?.url);
        }
    };

    const handleSave = async () => {
        const res: any = await updateProfile();
        if (res) {
            initForm();
        }
    };

    const handleUpdatePassword = async () => {
        const res_ = await updatePassword();
        if (res_) {
            setSuccussModel(true)
        }
    };

    // Reusable field renderer to avoid repetition
    const fieldProps = (label: string, field: keyof AdminProfile, opts?: { type?: string }) => ({
        fullWidth: true,
        label,
        value: (data[field] as string) ?? "",
        onChange: handleChange(field),
        disabled: !isEditMode,
        type: opts?.type ?? "text",
    });

    const handleModalBackPrimary = () => {
        setSuccussModel(false)
    };

    const handleModalPrimary = () => {
        setSuccussModel(false)
        navigate("/");
    };


    useEffect(() => {
        initForm();
    }, []);

    return (
        <Box
            sx={{
                maxWidth: 1000,
                mx: "auto",
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 3, sm: 4 },
            }}
        >
            {getlistLoading && <Loading />}
            <Stack
                component="div"
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                    mb: { xs: 2, sm: 3 },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    textAlign: "left",
                }}
            >
                <Box>
                    <Typography sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" }, fontWeight: 700, color: "#1a1f36" }}>
                        My Profile
                    </Typography>
                    <Typography sx={{ fontSize: "0.85rem", color: "#6b7280" }}>
                        View and manage your admin account details
                    </Typography>
                </Box>

                {!isEditMode ? (
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={enterEditMode}
                        sx={{
                            textTransform: "none",
                            borderRadius: 1,
                            bgcolor: "primary.main",
                            height: 42,
                            px: 3,
                            width: { xs: "100%", sm: "auto" },
                            "&:hover": { bgcolor: "primary.main" },
                        }}
                    >
                        Edit Profile
                    </Button>
                ) : (
                    <Stack direction="row" spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={cancelEdit}
                            disabled={isSaving}
                            sx={{
                                textTransform: "none",
                                borderRadius: 1,
                                height: 42,
                                bgcolor: "background.paper",
                                borderColor: "#d1d5db",
                                color: "text.primary",
                                flex: { xs: 1, sm: "none" },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={isSaving}
                            sx={{
                                textTransform: "none",
                                borderRadius: 1,
                                height: 42,
                                bgcolor: "primary.main",
                                flex: { xs: 1, sm: "none" },
                                "&:hover": { bgcolor: "primary.main" },
                            }}
                        >
                            {isSaving ? "Updating..." : "Update"}
                        </Button>
                    </Stack>
                )}
            </Stack>

            <Paper
                elevation={0}
                sx={{
                    border: "1px solid #e4e7ec",
                    borderRadius: 3,
                    p: { xs: 2, sm: 3, md: 4 },
                    textAlign: "left",
                }}
            >
                {/* Avatar + basic identity row */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 2, sm: 3 }}
                    sx={{
                        mb: { xs: 3, sm: 4 },
                        textAlign: { xs: "center", sm: "left" },
                        alignItems: { xs: "center", sm: "center" },
                    }}
                >
                    <ProfileUpload disabled={!isEditMode} onFileChange={(file) => handleFileChange(file)} url={draftProfile?.avatarUrl || profile.avatarUrl} />

                    <Box>
                        <Typography sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" }, fontWeight: 700, color: "#1a1f36" }}>
                            {profile.fullName}
                        </Typography>
                        <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mb: 1 }}>
                            {data.role}
                        </Typography>
                        <Chip
                            label={data.status}
                            size="small"
                            sx={{
                                bgcolor: data.status === "Active" ? "#dcfce7" : "#fee2e2",
                                color: data.status === "Active" ? "#15803d" : "#b91c1c",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                            }}
                        />
                    </Box>
                </Stack>

                <Divider sx={{ mb: { xs: 3, sm: 4 } }} />

                {/* Personal information */}
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "text.primary", mb: 2 }}>
                    Personal Information
                </Typography>

                <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        {(() => {
                            const fp: any = fieldProps("Full Name", "fullName");
                            return (
                                <InputTextField
                                    {...fp}
                                    placeholder="enter a full name"
                                    onChange={(value: string) => fp.onChange && fp.onChange({ target: { value } } as any)}
                                />
                            );
                        })()}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        {(() => {
                            const fp: any = fieldProps("Email Address", "email", { type: "email" });
                            return (
                                <InputTextField
                                    {...fp}
                                    placeholder="enter a email"
                                    onChange={(value: string) => fp.onChange && fp.onChange({ target: { value } } as any)}
                                />
                            );
                        })()}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        {(() => {
                            const fp: any = fieldProps("Phone Number", "phone");
                            return (
                                <InputTextField
                                    {...fp}
                                    placeholder="enter a phone number"
                                    startAdornment={"+61 "}
                                    onChange={(value: string) => {
                                        const sanitizedValue = value.replace(/\D/g, "").slice(0, 9);
                                        fp.onChange && fp.onChange?.({
                                            target: { value: sanitizedValue },
                                        } as any);
                                    }}
                                />
                            );
                        })()}
                    </Grid>
                </Grid>

                <Divider sx={{ my: { xs: 3, sm: 4 } }} />

                {/* Address information */}
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a1f36", mb: 2 }}>
                    Address
                </Typography>

                <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                    <Grid size={{ xs: 12 }}>
                        {(() => {
                            const fp: any = fieldProps("Address", "address");
                            return (
                                <InputTextField
                                    {...fp}
                                    placeholder="enter a address"
                                    onChange={(value: string) => fp.onChange && fp.onChange({ target: { value } } as any)}
                                />
                            );
                        })()}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        {(() => {
                            const fp: any = fieldProps("City", "city");
                            return (
                                <InputTextField
                                    {...fp}
                                    placeholder="enter a city"
                                    onChange={(value: string) => fp.onChange && fp.onChange({ target: { value } } as any)}
                                />
                            );
                        })()}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        {(() => {
                            const fp: any = fieldProps("State", "state");
                            return (
                                <InputTextField
                                    {...fp}
                                    placeholder="enter a state"
                                    onChange={(value: string) => fp.onChange && fp.onChange({ target: { value } } as any)}
                                />
                            );
                        })()}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        {(() => {
                            const fp: any = fieldProps("Pincode", "pincode");
                            return (
                                <InputTextField
                                    {...fp}
                                    placeholder="enter a pincode"
                                    onChange={(value: string) => fp.onChange && fp.onChange({ target: { value } } as any)}
                                />
                            );
                        })()}
                    </Grid>
                </Grid>

                <Divider sx={{ my: { xs: 3, sm: 4 } }} />

                {/* Update Password */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        mb: 2,
                    }}
                >
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a1f36" }}>
                        Update Password
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleUpdatePassword}
                        disabled={isPasswordSaving}
                        sx={{
                            textTransform: "none",
                            borderRadius: 1,
                            height: 38,
                            px: 3,
                            mt: { xs: 1.5, sm: 0 },
                            bgcolor: "primary.main",
                            "&:hover": { bgcolor: "primary.main" },
                        }}
                    >
                        {isPasswordSaving ? "Updating..." : "Update"}
                    </Button>
                </Stack>

                {passwordError && (
                    <Typography sx={{ fontSize: "0.8rem", color: "#b91c1c", mb: 1.5 }}>
                        {passwordError}
                    </Typography>
                )}
                {passwordSuccess && (
                    <Typography sx={{ fontSize: "0.8rem", color: "#15803d", mb: 1.5 }}>
                        {passwordSuccess}
                    </Typography>
                )}

                <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <InputTextField
                            fullWidth
                            label="Current Password"
                            type="password"
                            value={passwordForm.currentPassword}
                            placeholder="enter current password"
                            onChange={(value: string) => setPasswordField("currentPassword", value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <InputTextField
                            fullWidth
                            label="New Password"
                            type="password"
                            value={passwordForm.newPassword}
                            placeholder="enter new password"
                            onChange={(value: string) => setPasswordField("newPassword", value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <InputTextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            value={passwordForm.confirmPassword}
                            placeholder="confirm new password"
                            onChange={(value: string) => setPasswordField("confirmPassword", value)}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <CustomModal
                open={isSucess}
                onClose={() => setSuccussModel(false)}
                type="success"
                title={"Password updated Successfully"}
                description="Your password has been updated successfully. Your Nimora profile is ready to use, and you can now continue your journey to find the right support workers with confidence."
                backText="Close"
                primaryText="Dashboard"
                onBack={handleModalBackPrimary}
                onPrimary={handleModalPrimary}
            />
        </Box>
    );
};

export default ProfileDetails;