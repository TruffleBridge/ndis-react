import { useEffect, useRef, type ChangeEvent } from "react";
import {
    Box,
    Paper,
    Avatar,
    Typography,
    Button,
    Chip,
    Divider,
    Stack,
    IconButton,
    Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/CheckOutlined";
import CameraAltIcon from "@mui/icons-material/CameraAltOutlined";
import { useProfileStore } from "@/store/useProfilestore";
import type { AdminProfile } from "@/types/profile";
import { InputTextField, Loading } from "@/components";


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

    const fileInputRef = useRef<HTMLInputElement>(null);

    // whichever profile is shown depends on mode
    const data: AdminProfile = isEditMode ? draftProfile : profile;

    const handleChange =
        (field: keyof AdminProfile) =>
            (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setField(field, e.target.value as never);
            };

    const handleAvatarPick = () => {
        if (isEditMode) fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setField("avatarUrl", url);
    };

    const handleSave = async () => {
        const res: any = await updateProfile();
        if (res) {
            initForm();
        }
    };

    const initials = data.fullName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    // Reusable field renderer to avoid repetition
    const fieldProps = (label: string, field: keyof AdminProfile, opts?: { type?: string }) => ({
        fullWidth: true,
        label,
        value: (data[field] as string) ?? "",
        onChange: handleChange(field),
        disabled: !isEditMode,
        // size: "small" as const,
        type: opts?.type ?? "text",
    });

    useEffect(() => {
        initForm();
    }, [])


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
                    textAlign: 'left'
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
                                bgcolor: 'background.paper',
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
                    textAlign: 'left'
                }}
            >
                {/* Avatar + basic identity row */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 2, sm: 3 }}
                    sx={{
                        mb: { xs: 3, sm: 4 },
                        textAlign: { xs: "center", sm: "left" },
                        alignItems: { xs: "center", sm: "center" }
                    }}
                >
                    <Box sx={{ position: "relative" }}>
                        <Avatar
                            src={data.avatarUrl || undefined}
                            sx={{
                                width: { xs: 84, sm: 96, md: 104 },
                                height: { xs: 84, sm: 96, md: 104 },
                                bgcolor: "primary.main",
                                fontSize: { xs: "1.6rem", sm: "1.9rem" },
                                fontWeight: 700,
                                border: "3px solid",
                                borderColor: 'custom.800'
                            }}
                        >
                            {!data.avatarUrl && initials}
                        </Avatar>
                        {isEditMode && (
                            <IconButton
                                onClick={handleAvatarPick}
                                size="small"
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    bgcolor: "primary.main",
                                    color: "#fff",
                                    "&:hover": { bgcolor: "primary.main" },
                                }}
                            >
                                <CameraAltIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Box>

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
                        {/* Convert event-style onChange to value-style for InputTextField */}
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
                                    startAdornment={'+61 '}
                                    onChange={(value: string) => {
                                        const sanitizedValue = value.replace(/\D/g, '').slice(0, 9);

                                        fp.onChange && fp.onChange?.({
                                            target: { value: sanitizedValue },
                                        } as any);
                                    }}
                                />
                            );
                        })()}
                    </Grid>
                </Grid>

                {/* Work information - admin specific */}
                {/* <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a1f36", mb: 2 }}>
                    Work Information
                </Typography>

                <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        {getViewFunction('Role', data?.role, 'plain')}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        {getViewFunction('Department', data?.department, 'plain')}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        {getViewFunction('Designation', data?.designation, 'plain')}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        {getViewFunction('Joining Date', data?.joiningDate, 'plain')}
                    </Grid>
                </Grid> */}

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
            </Paper>
        </Box>
    );
};

export default ProfileDetails;