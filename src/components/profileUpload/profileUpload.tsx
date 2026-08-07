import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import FieldError from "../fieldError/fieldError";
import { DeleteIcon } from "../../assets";

const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];

const MAX_PHOTO_SIZE_MB = 5;

interface PhotoUploadProps {
    onFileChange?: (file: File | null) => void;
    error?: string;
    url?: string;
    disabled?: boolean;
}

const ProfileUpload: React.FC<PhotoUploadProps> = ({
    onFileChange,
    url = "",
    error,
    disabled = false,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [preview, setPreview] = useState<string | null>(url);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        setPreview(url || null);
    }, [url]);

    const validate = (file: File) => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            return "Only JPG, PNG, WEBP or GIF images are allowed.";
        }

        if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
            return `Image must be smaller than ${MAX_PHOTO_SIZE_MB}MB.`;
        }

        return "";
    };

    const handlePick = () => {
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (disabled) return;

        const file = e.target.files?.[0];

        if (!file) return;

        const error = validate(file);

        if (error) {
            setLocalError(error);
            return;
        }

        setLocalError("");

        const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);
        onFileChange?.(file);

        e.target.value = "";
    };

    const handleDelete = (
        e: React.MouseEvent
    ) => {
        e.stopPropagation();

        if (disabled) return;

        if (preview?.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        setPreview(null);
        setLocalError("");

        onFileChange?.(null);
    };

    const displayError = localError || error;

    return (
        <Box
            sx={{
                width: {
                    xs: 84,
                    sm: 96,
                    md: 112,
                },
                height: {
                    xs: 84,
                    sm: 96,
                    md: 112,
                },
            }}
        >
            <Box
                onClick={!preview && !disabled ? handlePick : undefined}
                sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    position: "relative",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    cursor: disabled
                        ? "not-allowed"
                        : !preview
                            ? "pointer"
                            : "default",

                    bgcolor: "primary.main",

                    border: "3px solid",
                    borderColor: displayError
                        ? "#EF4444"
                        : "custom.800",

                    opacity: disabled ? 0.6 : 1,
                }}
            >
                <input
                    ref={inputRef}
                    hidden
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={handleChange}
                    disabled={disabled}
                />

                {preview ? (
                    <>
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                component="img"
                                src={preview}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>

                        <Tooltip title="Remove">
                            <IconButton
                                onClick={handleDelete}
                                disabled={disabled}
                                sx={{
                                    position: "absolute",

                                    top: -4,
                                    right: -4,

                                    zIndex: 99,

                                    width: 32,
                                    height: 32,

                                    bgcolor: "custom.300",
                                    color: "#fff",

                                    border: "2px solid #fff",

                                    "&:hover": {
                                        bgcolor: "custom.400",
                                    },

                                    "&.Mui-disabled": {
                                        bgcolor: "#d5d5d5",
                                        color: "#fff",
                                    },

                                    "& svg": {
                                        fontSize: 18,
                                    },
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#fff",
                        }}
                    >
                        Upload
                    </Typography>
                )}
            </Box>

            <FieldError message={displayError} />
        </Box>
    );
};

export default ProfileUpload;