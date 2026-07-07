import React, { useRef, useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";

import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { styles } from "./styles";
import { FieldError, FormLabel } from "../../components";
import { UploadIcon } from "../../assets";

const ACCEPTED_DOC_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
];

const MAX_DOC_SIZE_MB = 10;

interface FileUploadBoxProps {
    label?: string;
    helperText?: string;
    onFileChange?: (file: File | null) => void;
    required?: boolean;
    error?: string;
    acceptedTypes?: string[];
    maxSizeMb?: number;
}

const FileUpload: React.FC<FileUploadBoxProps> = ({
    label,
    helperText = "Document must be issued within last 6 months",
    onFileChange,
    required,
    error,
    acceptedTypes = ACCEPTED_DOC_TYPES,
    maxSizeMb = MAX_DOC_SIZE_MB,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [localError, setLocalError] = useState("");

    const validate = (file: File) => {
        if (!acceptedTypes.includes(file.type)) {
            return "Unsupported file type. Please upload a PDF or image.";
        }
        if (file.size > maxSizeMb * 1024 * 1024) {
            return `File must be smaller than ${maxSizeMb}MB.`;
        }
        return "";
    };

    const processFile = (file: File) => {
        const err = validate(file);
        if (err) {
            setLocalError(err);
            return;
        }

        setLocalError("");
        setFile(file);
        onFileChange?.(file);
    };

    const handlePick = () => inputRef.current?.click();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        e.target.value = "";
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        setLocalError("");
        onFileChange?.(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const formatSize = (bytes: number) =>
        bytes < 1024 * 1024
            ? `${(bytes / 1024).toFixed(0)} KB`
            : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

    const displayError = localError || error;

    return (
        <Box sx={styles.wrapper}>
            {label && <FormLabel label={label} required={required} />}

            {file ? (
                <Box sx={styles.uploadedBox}>
                    <CheckCircleOutlineOutlined sx={{ color: "#10B981", fontSize: 18 }} />

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={styles.fileName}>{file.name}</Typography>
                        <Typography sx={styles.fileSize}>
                            {formatSize(file.size)}
                        </Typography>
                    </Box>

                    <Tooltip title="Remove file">
                        <IconButton onClick={handleDelete}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ) : (
                <Box
                    sx={styles.box(displayError, dragging)}
                    onClick={handlePick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={acceptedTypes.join(",")}
                        style={{ display: "none" }}
                        onChange={handleChange}
                    />

                    <UploadIcon style={styles.icon} />

                    <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#18181C" }}>
                        Drag and Drop or{" "}
                        <b style={{ color: "#1650CF" }}>Click to upload</b>
                    </Typography>

                    <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#667085" }}>
                        {helperText}
                    </Typography>
                </Box>
            )}

            <FieldError message={displayError} />
        </Box>
    );
};
export default FileUpload;