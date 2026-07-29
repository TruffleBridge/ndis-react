import React, { useCallback, useState } from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    Link,
    Stack,
    Typography,
} from "@mui/material";
import MailOutlineOutlined from "@mui/icons-material/MailOutlineOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useNavigate } from "react-router-dom";

import { InputTextField } from "@/components";
import { LogoSupportIcon } from "@/assets";
import { useAuthStore } from "@/store/auth";

const PRIMARY_DARK = "#055149";

interface FormValues {
    email: string;
    password: string;
    remember: boolean;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (values: FormValues): FormErrors => {
    const errors: FormErrors = {};

    if (!values.email.trim()) {
        errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(values.email)) {
        errors.email = "Enter valid email";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 8) {
        errors.password = "Minimum 8 characters required";
    }

    return errors;
};

const Login = () => {
    const navigate = useNavigate();

    // all auth state/actions now come from the zustand store
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);
    const authError = useAuthStore((state) => state.error);
    const clearError = useAuthStore((state) => state.clearError);

    const [values, setValues] = useState<FormValues>({
        email: "",
        password: "",
        remember: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleChange = (event: any, field: keyof FormValues) => {
        const fieldValue = field === "remember" ? event.target.checked : event;

        setValues((prev) => {
            const next = {
                ...prev,
                [field]: fieldValue,
            };

            return next;
        });

        if (authError) {
            clearError();
        }
    };

    const handleRemember = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({
            ...prev,
            remember: event.target.checked,
        }));
    };

    const handleSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            debugger;
            event.preventDefault();

            const validation = validate(values);

            setErrors(validation);

            if (Object.keys(validation).length) {
                return;
            }

            const result = await login({
                email: values.email,
                password: values.password,
            });

            if (result.success) {
                setLoginSuccess(true);

                navigate("/");
            }
        },
        [login, navigate, values]
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: {
                    xs: "column",
                    sm: "row",
                },
                bgcolor: "background.default",
                overflowY: "auto",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: {
                        xs: "none",
                        sm: "flex",
                    },
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 8,
                    py: 6,
                    color: "primary.contrastText",
                    background: `
                            linear-gradient(
                                135deg,
                                #086D63 0%,
                                ${PRIMARY_DARK} 100%
                            )
                        `,
                }}
            >
                <Avatar
                    sx={{
                        width: 90,
                        height: 90,
                        bgcolor: 'custom.400',
                        color: "primary.contrastText",
                        mb: 4,
                    }}
                >
                    <LogoSupportIcon />
                </Avatar>

                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        textAlign: "center",
                        mb: 2,
                    }}
                >
                    Welcome Back
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        maxWidth: 420,
                        textAlign: "center",
                        lineHeight: 1.7,
                        opacity: 0.9,
                        fontWeight: 400,
                    }}
                >
                    Sign in to manage your admin workspace,
                    workers, clients, bookings and subscriptions.
                </Typography>
            </Box>

            {/* right side */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    px: {
                        xs: 2,
                        sm: 4,
                        md: 8,
                    },
                    py: {
                        xs: 4,
                        md: 6,
                    },
                }}
            >
                <Stack
                    spacing={3}
                    sx={{
                        width: "100%",
                        maxWidth: {
                            xs: 420,
                            sm: "100%",
                        },
                        mx: "auto",
                        border: {
                            xs: `1px solid custom.400`,
                            sm: "none",
                        },
                        borderRadius: {
                            xs: 3,
                            sm: 0,
                        },
                        p: {
                            xs: 3,
                            sm: 0,
                        },
                        bgcolor: {
                            xs: "primary.contrastText",
                            sm: "transparent",
                        },
                    }}
                >
                    <Stack
                        spacing={1}
                        sx={{
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: "custom.100",
                                textAlign: "center",
                                fontSize: {
                                    xs: 26,
                                    sm: 32,
                                },
                            }}
                        >
                            Admin Portal
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "custom.200",
                                textAlign: "center",
                            }}
                        >
                            Sign in to manage your workspace
                        </Typography>
                    </Stack>

                    {loginSuccess && (
                        <Alert severity="success" sx={{ borderRadius: 2 }}>
                            Login successful.
                        </Alert>
                    )}

                    {authError && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {authError}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Stack spacing={2.5}>
                            <InputTextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={values.email}
                                onChange={(e) =>
                                    handleChange(e, "email")
                                }
                                placeholder="enter the email"
                                disabled={loading}
                                errors={errors.email}
                                startAdornment={
                                    <MailOutlineOutlined
                                        fontSize="small"
                                        sx={{
                                            color: "custom.200",
                                        }}
                                    />
                                }
                            />

                            <InputTextField
                                fullWidth
                                label="Password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="enter the password"
                                value={values.password}
                                onChange={(e) =>
                                    handleChange(e, "password")
                                }
                                disabled={loading}
                                errors={errors.password}
                                endAdornment={
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        disabled={loading}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff fontSize="small" />
                                        ) : (
                                            <Visibility fontSize="small"/>
                                        )}
                                    </IconButton>
                                }
                            />
                            <Stack
                                direction={{
                                    xs: "row",
                                }}
                                sx={{
                                    mt: '0 !important',
                                    justifyContent: "space-between",
                                    alignItems: {
                                        xs: "center",
                                    },
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.remember}
                                            onChange={handleRemember}
                                            disabled={loading}
                                            sx={{
                                                color: "custom.400",
                                                cursor: "pointer",
                                                "&.Mui-checked": {
                                                    color: "primary.main",
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "custom.100",
                                            }}
                                        >
                                            Remember me
                                        </Typography>
                                    }
                                />

                                <Link
                                    href="#"
                                    underline="hover"
                                    sx={{
                                        color: "primary.main",
                                        fontWeight: 600,
                                        fontSize: 14,
                                        cursor: "pointer",
                                    }}
                                >
                                    Forgot password?
                                </Link>
                            </Stack>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    height: 52,
                                    borderRadius: 2,
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    textTransform: "none",
                                    fontSize: 16,
                                    fontWeight: 700,
                                    boxShadow: "none",
                                    "&:hover": {
                                        bgcolor: PRIMARY_DARK,
                                        boxShadow: "none",
                                    },
                                    "&:disabled": {
                                        bgcolor: "#9ABDB8",
                                        color: "primary.contrastText",
                                    },
                                }}
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: "#FFFFFF",
                                        }}
                                    />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </Stack>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "custom.200",
                            textAlign: "center",
                        }}
                    >
                        Not an admin?{" "}
                        <Link
                            href="#"
                            underline="hover"
                            sx={{
                                color: "primary.main",
                                fontWeight: 600,
                            }}
                        >
                            Contact your workspace owner
                        </Link>
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
};

export default Login;