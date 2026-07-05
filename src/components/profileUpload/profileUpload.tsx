import React, { useRef, useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { styles } from "./styles";
import FieldError from "../fieldError/fieldError";
import { DeleteIcon, UploadIcon } from "../../assets";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_PHOTO_SIZE_MB = 5;

interface PhotoUploadProps {
    onFileChange?: (file: File | null) => void;
    error?: string;
}

const ProfileUpload: React.FC<PhotoUploadProps> = ({
    onFileChange,
    error,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [preview, setPreview] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string>("");

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
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const err = validate(file);
        if (err) {
            setLocalError(err);
            return;
        }

        setLocalError("");
        const url = URL.createObjectURL(file);
        setPreview(url);

        onFileChange?.(file);
        e.target.value = "";
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        setLocalError("");
        onFileChange?.(null);
    };

    const displayError = localError || error;

    return (
        <Box sx={styles.wrapper}>
            <Box
                sx={styles.box(displayError, !!preview)}
                onClick={!preview ? handlePick : undefined}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    style={{ display: "none" }}
                    onChange={handleChange}
                />

                {preview ? (
                    <>
                        <Box component="img" src={preview} sx={styles.preview} />

                        <Tooltip title="Remove photo">
                            <IconButton sx={styles.deleteBtn} onClick={handleDelete}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <UploadIcon style={styles.icon} />
                        <Typography sx={styles.uploadText}>
                            Upload Photo
                        </Typography>
                    </>
                )}
            </Box>

            <FieldError message={displayError} />
        </Box>
    );
};
export default ProfileUpload;