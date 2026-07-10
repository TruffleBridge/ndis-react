import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { CustomSwitch } from "../customSwitch/customSwitch";

export interface CustomModalProps {
    open: boolean;
    onClose: () => void;
    type?: "success" | "error" | "warning" | "info";
    title: string;
    description?: string;
    showBackButton?: boolean;
    backText?: string;
    primaryText?: string;
    onBack?: () => void;
    onPrimary?: () => void;
    loading?: boolean;
    showStatusSwitch?: boolean;
    status?: boolean;
    onStatusChange?: (checked: boolean) => void;
}

const iconConfig = {
    success: {
        bg: "#D4F5D7",
        color: "#47D45A",
        icon: <CheckIcon sx={{ fontSize: 48 }} />,
    },
    error: {
        bg: "#FDE2E2",
        color: "#EF4444",
        icon: <ErrorOutlineOutlined sx={{ fontSize: 48 }} />,
    },
    warning: {
        bg: "#FFF4D6",
        color: "#F59E0B",
        icon: <WarningAmberRoundedIcon sx={{ fontSize: 48 }} />,
    },
    info: {
        bg: "#DCEFFF",
        color: "#2196F3",
        icon: <InfoOutlinedIcon sx={{ fontSize: 48 }} />,
    },
};

export const CustomModal = ({
    open,
    onClose,
    type = "success",
    title,
    description,
    backText = "Back",
    primaryText = "Continue",
    onBack,
    onPrimary,
    loading = false,
    showStatusSwitch = false,
    status = false,
    onStatusChange = () => { },
}: CustomModalProps) => {
    const config = iconConfig[type];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "24px",
                        px: 4,
                        py: 5,
                        overflow: "hidden",
                    },
                },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <Box
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: 118,
                            height: 118,
                            borderRadius: "50%",
                            bgcolor: config.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 4,
                        }}
                    >
                        <Box
                            sx={{
                                width: 72,
                                height: 72,
                                borderRadius: "50%",
                                bgcolor: config.color,
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {config.icon}
                        </Box>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#101828",
                            mb: 2,
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#7F7F7F",
                            lineHeight: 1.7,
                            fontWeight: 400,
                            maxWidth: 500,
                            mx: "auto",
                            mb: 5,
                        }}
                    >
                        {description}
                    </Typography>

                    {showStatusSwitch && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                                mb: 4,
                            }}
                        >
                            <Typography>
                                {status ? "Active" : "Inactive"}
                            </Typography>

                            <CustomSwitch
                                label="Profile Preferences"
                                checked={status}
                                onChange={(items) => onStatusChange(items)}
                            />
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: 'center'
                        }}
                    >
                        {backText && (
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={onBack}
                                sx={{
                                    height: 48,
                                    borderRadius: "50px",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    borderColor: "#333333",
                                    color: "#333333",
                                    maxWidth: '200px'

                                }}
                            >
                                {backText}
                            </Button>
                        )}

                        {primaryText && <Button
                            fullWidth
                            disableElevation
                            variant="contained"
                            onClick={onPrimary}
                            disabled={loading}
                            endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 18 }} />}
                            sx={{
                                height: 48,
                                borderRadius: "50px",
                                textTransform: "none",
                                bgcolor: "primary.main",
                                fontWeight: 700,
                                fontSize: 14,
                                color: "#FFFFFF",
                                maxWidth: '200px'
                            }}
                        >
                            {primaryText}
                        </Button>}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};