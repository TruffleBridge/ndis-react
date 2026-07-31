import React, { useCallback, useState } from "react";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, Link, Stack, Typography } from "@mui/material";
import MailOutlineOutlined from "@mui/icons-material/MailOutlineOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

import { InputTextField } from "@/components";
import logo from "@/assets/Nimora-logo.png";
import { useAuthStore } from "@/store/auth";


const PRIMARY = "#00665F";


interface FormValues {
    email: string;
    password: string;
    remember: boolean;
}

interface FormErrors {
    email?: string;
    password?: string;
}


const validate = (values: FormValues): FormErrors => {
    const errors: FormErrors = {};
    if (!values.email.trim()) errors.email = "Email is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
};


const Login = () => {

    const navigate = useNavigate();

    const login = useAuthStore(state => state.login);
    const loading = useAuthStore(state => state.loading);
    const authError = useAuthStore(state => state.error);
    const clearError = useAuthStore(state => state.clearError);

    const [values, setValues] = useState<FormValues>({
        email: "",
        password: "",
        remember: false
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);


    const updateValue = (field: keyof FormValues, value: any) => {
        setValues(prev => ({ ...prev, [field]: value }));
        if (authError) clearError();
    };


    const handleSubmit = useCallback(async (e: React.FormEvent) => {

        e.preventDefault();

        const validation = validate(values);

        setErrors(validation);

        if (Object.keys(validation).length) return;

        const result = await login({
            email: values.email,
            password: values.password
        });

        if (result.success) window.location.href = '/';

    }, [values, login, navigate]);


    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: { xs: "column", md: "row" } }}>

            {/* LEFT BRAND */}
            <Box sx={{
                width: { xs: "100%", md: "50%" },
                minHeight: { xs: 320, md: "100vh" },
                background: "linear-gradient(135deg,#08766D,#03473F)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 3, md: 8 },
                textAlign: "center"
            }}>

                <Box sx={{
                    width: { xs: 240, sm: 320, md: 400 },
                    height: { xs: 120, sm: 150, md: 180 },
                    background: "rgba(255,255,255,.15)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,.3)",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 20px 50px rgba(0,0,0,.2)",
                    mb: 5
                }}>
                    <Box component="img" src={logo} alt="Nimora" sx={{ width: "75%", objectFit: "contain" }} />
                </Box>

                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: { xs: 30, md: 40 }, mb: 2 }}>
                    Welcome Back
                </Typography>

                <Typography sx={{ color: "#fff", opacity: .9, maxWidth: 450, fontSize: { xs: 14, md: 18 } }}>
                    Sign in to manage your admin workspace, workers, clients, bookings and subscriptions.
                </Typography>

            </Box>


            {/* LOGIN */}
            <Box sx={{
                width: { xs: "100%", md: "50%" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 3, md: 10 },
                py: 6
            }}>

                <Stack spacing={3} sx={{
                    width: "100%", maxWidth: 450
                }}>

                    <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: 28, md: 36 }, color: "text.primary" }}>
                            Admin Portal
                        </Typography>

                        <Typography color="text.secondary">
                            Sign in to manage your workspace
                        </Typography>
                    </Box>


                    <Box component="form" onSubmit={handleSubmit}>

                        <Stack spacing={2}>

                            <InputTextField
                                label="Email Address"
                                type="email"
                                value={values.email}
                                placeholder="Enter email"
                                errors={errors.email}
                                onChange={(e: any) => updateValue("email", e)}
                                startAdornment={<MailOutlineOutlined />}
                            />


                            <InputTextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={values.password}
                                placeholder="Enter password"
                                errors={errors.password}
                                onChange={(e: any) => updateValue("password", e)}
                                endAdornment={
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                }
                            />


                            <Box sx={{ display: "flex", mt: "0 !important", justifyContent: "space-between", alignItems: "center" }}>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={values.remember}
                                            onChange={(e) => updateValue("remember", e.target.checked)}
                                        />
                                    }
                                    label="Remember me"
                                />

                                <Link sx={{ color: PRIMARY, fontWeight: 600, cursor: "pointer" }}>
                                    Forgot password?
                                </Link>

                            </Box>


                            <Button
                                type="submit"
                                disabled={loading}
                                sx={{
                                    height: 52,
                                    borderRadius: 2,
                                    background: PRIMARY,
                                    color: "#fff",
                                    fontWeight: 700,
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: "background.default" }} /> : "Sign In"}
                            </Button>

                        </Stack>

                    </Box>


                    <Typography sx={{ textAlign: "center", color: "custom.200" }}>
                        Not an admin?{" "}
                        <Link sx={{ color: PRIMARY, fontWeight: 600, cursor: 'pointer' }}>
                            Contact your workspace owner
                        </Link>
                    </Typography>

                </Stack>

            </Box>

        </Box>
    );
};

export default Login;