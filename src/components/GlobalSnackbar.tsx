import { Snackbar, Alert, Slide } from "@mui/material";
import { useToast } from "@/store/toastStore";

import type { SlideProps } from "@mui/material/Slide";

function TransitionRight(props: SlideProps) {
    return <Slide {...props} direction="left" />;
}

export const GlobalSnackbar = () => {
    const { open, message, closeToast } = useToast();

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={closeToast}
            slots={{ transition: TransitionRight }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Alert
                onClose={closeToast}
                severity="error"
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
