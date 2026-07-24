import { useState, useRef, useCallback } from "react";
import {
    Box,
    Typography,
    IconButton,
    Button,
    Paper,
    Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { DeleteIcon, FileDownloadIcon } from "@/assets";
import FieldError from "@/components/fieldError/fieldError";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ACCEPTED_FORMATS = ["application/pdf", "image/jpeg", "image/png"];
const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";
const FORMAT_LABEL = "PDF, JPG, PNG";

// Theme Colors
const PRIMARY = "#2E7D6B";
const PRIMARY_LIGHT = "#E8F5F1";
const DANGER = "#D32F2F";
const LABEL_COLOR = "#191C1D";
const SUB_COLOR = "#7F7F7F";
const FILE_BG = "#D4E6E5";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date | string | null | undefined): string {
    if (!date) return "";

    const parsedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate
        .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        .toUpperCase();
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    uploadedAt: Date;
    type?: any
}

interface FileRowProps {
    uploadedFile: UploadedFile;
    onRemove: () => void;
    compact?: boolean;
    disabled?: boolean;
}

/**
 * All 3 variants share the same controlled contract so a parent form can own
 * the uploaded-file state exactly like any other field (and reset it on
 * Submit/Cancel, or preload it for Edit/View):
 *
 *   value:    UploadedFile | null  - the file currently held by the parent
 *   onChange: (file) => void       - called with a new UploadedFile on
 *                                    upload, or `null` when the file is removed
 *   disabled: boolean              - true in View mode; hides upload/remove actions
 */
interface Variant1Props {
    label?: string;
    value: UploadedFile | null;
    onChange: (file: UploadedFile | null) => void;
    disabled?: boolean;
    errors?: string;
}

interface Variant2Props {
    label?: string;
    sublabel?: string;
    icon?: React.ReactNode;
    value: UploadedFile | null;
    onChange: (file: UploadedFile | null) => void;
    disabled?: boolean;
    errors?: string;
}

interface Variant3Props {
    label: string;
    value: UploadedFile | null;
    onChange: (file: UploadedFile | null) => void;
    disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Styled Components
// ---------------------------------------------------------------------------

const DropZone = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isDragging",
})<{ isDragging?: boolean }>(({ isDragging }) => ({
    border: `1.4px dashed ${isDragging ? PRIMARY : "#2D9E8F"}`,
    borderRadius: 12,
    backgroundColor: isDragging ? PRIMARY_LIGHT : "#FAFFFE",
    padding: "36px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    transition: "all 0.2s ease",
}));

const UploadButton = styled(Button)(() => ({
    borderRadius: 8,
    border: `1px solid`,
    borderColor: '#706767',
    color: "#706767",
    fontWeight: 600,
    fontSize: 16,
    padding: "8px 20px",
    textTransform: "none",
    gap: 6,
}));

// ---------------------------------------------------------------------------
// File Row
// ---------------------------------------------------------------------------

function FileRow({ uploadedFile, onRemove, compact = false, disabled = false }: FileRowProps) {
    const isPdf = ["application/pdf", "pdf"]?.includes(uploadedFile?.type || uploadedFile?.file?.type);

    return (
        <Paper
            variant="outlined"
            sx={{
                display: "flex",
                alignItems: "center",
                textAlign: 'left',
                gap: 1.5,
                px: 2,
                mt: 2,
                py: compact ? 1.2 : 1.5,
                borderRadius: 2,
                borderColor: "#D2D5DB",
                backgroundColor: "#FFFFFF",
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: FILE_BG,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {isPdf ? (
                    <InsertDriveFileIcon sx={{ color: "#6B7280", fontSize: 20 }} />
                ) : (
                    <ImageOutlinedIcon sx={{ color: PRIMARY, fontSize: 20 }} />
                )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: LABEL_COLOR, lineHeight: 1.4, wordBreak: "break-word" }}
                >
                    {uploadedFile.name}
                </Typography>

                <Typography variant="caption" sx={{ color: SUB_COLOR, textTransform: "uppercase", letterSpacing: 0.3 }}>
                    {`Uploaded ${formatDate(new Date(uploadedFile?.uploadedAt))} • ${formatSize(uploadedFile?.size)}`}
                </Typography>
            </Box>

            {/* Hide the delete action entirely in disabled/View mode */}
            {!disabled && (
                <IconButton
                    size="medium"
                    onClick={onRemove}
                    sx={{ color: DANGER, flexShrink: 0 }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )}
        </Paper>
    );
}

// ---------------------------------------------------------------------------
// Hidden File Input Hook
// ---------------------------------------------------------------------------

function useFileInput(accept: string, onSelect: (file: File) => void) {
    const inputRef = useRef<HTMLInputElement>(null);

    const trigger = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const inputElement = (
        <input
            ref={inputRef}
            type="file"
            accept={accept}
            hidden
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (file) onSelect(file);
                // Allow selecting the same file again
                event.target.value = "";
            }}
        />
    );

    return { trigger, inputElement };
}

// ---------------------------------------------------------------------------
// File Validation
// ---------------------------------------------------------------------------

function validate(file: File): string | null {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
        return `Invalid file format. Supported formats: ${FORMAT_LABEL}`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return `File size should not exceed ${MAX_FILE_SIZE_MB} MB.`;
    }
    return null;
}

function toUploadedFile(file: File): UploadedFile {
    return { file, name: file.name, size: file.size, uploadedAt: new Date() };
}

// ═══════════════════════════════════════════════════════════════
// Variant 1 — Drop Zone Upload
// ═══════════════════════════════════════════════════════════════

export function UploadVariant1({
    label = "Upload your Id proof",
    value,
    onChange,
    disabled = false,
    errors = ''
}: Variant1Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = useCallback(
        (file: File) => {
            const validationError = validate(file);
            if (validationError) {
                setError(validationError);
                return;
            }
            setError(null);
            onChange(toUploadedFile(file));
        },
        [onChange]
    );

    const { trigger, inputElement } = useFileInput(ACCEPTED_EXTENSIONS, handleFile);

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setIsDragging(false);
            if (disabled) return;
            const file = event.dataTransfer.files?.[0];
            if (file) handleFile(file);
        },
        [handleFile, disabled]
    );

    return (
        <Box>
            <Typography sx={{ fontWeight: 600, color: "#222124", mb: 1, fontSize: 14, textAlign: 'left' }}>
                {label}
            </Typography>

            {!disabled && inputElement}

            {!disabled && <DropZone
                isDragging={isDragging}
                onClick={() => !disabled && trigger()}
                onDragOver={(event) => {
                    event.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                sx={disabled ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
            >
                <Box
                    sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        backgroundColor: PRIMARY_LIGHT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <FileDownloadIcon style={{ color: "#2D9E8F", fontSize: 26 }} />
                </Box>

                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, fontSize: 14, color: "#1C1B1D" }}>
                    {label}
                </Typography>

                <Typography variant="body2" sx={{ color: "#64748B", mt: -0.5 }}>
                    Supported formats: {FORMAT_LABEL}
                </Typography>
            </DropZone>}

            {error && (
                <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {value && (
                <Box sx={{ mt: 1.5 }}>
                    <FileRow uploadedFile={value} onRemove={() => onChange(null)} disabled={disabled} />
                </Box>
            )}
            <FieldError message={errors} />
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Variant 2 — Label Row Upload Button
// ═══════════════════════════════════════════════════════════════

export function UploadVariant2({
    label = "NDIS Certificate of Registration",
    sublabel = "Mandatory for all registered providers",
    icon,
    value,
    onChange,
    disabled = false,
    errors = "",
}: Variant2Props) {
    const [error, setError] = useState<string | null>(null);

    const handleFile = useCallback(
        (file: File) => {
            const validationError = validate(file);
            if (validationError) {
                setError(validationError);
                return;
            }
            setError(null);
            onChange(toUploadedFile(file));
        },
        [onChange]
    );

    const { trigger, inputElement } = useFileInput(
        ACCEPTED_EXTENSIONS,
        handleFile
    );

    return (
        <Box sx={{ width: "100%" }}>
            {!disabled && inputElement}

            <Paper
                variant="outlined"
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    borderColor: "#D2D5DB",
                    mb: 1,
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: FILE_BG,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {icon ? (
                        icon
                    ) : (
                        <DescriptionOutlinedIcon
                            sx={{
                                color: "#3E4947",
                                fontSize: 24,
                            }}
                        />
                    )}
                </Box>

                {/* Label */}
                <Box
                    sx={{
                        flex: 1,
                        width: "100%",
                        minWidth: 0,
                        textAlign: 'left'
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 600,
                            fontSize: {
                                xs: 15,
                                sm: 16,
                            },
                            color: LABEL_COLOR,
                        }}
                    >
                        {label}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            color: SUB_COLOR,
                            fontSize: 12,
                        }}
                    >
                        {sublabel}
                    </Typography>
                </Box>

                {value ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "row",
                                // sm: "row",
                            },
                            alignItems: {
                                xs: "stretch",
                                sm: "left",
                            },
                            gap: 1,
                            width: {
                                xs: "100%",
                                sm: "auto",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                minWidth: 0,
                                flex: 1,
                                textAlign: 'left'
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 600,
                                    color: LABEL_COLOR,
                                    wordBreak: "break-word",
                                }}
                            >
                                {value.name}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: SUB_COLOR,
                                    display: "block",
                                }}
                            >
                                {`Uploaded ${formatDate(
                                    value.uploadedAt
                                )} • ${formatSize(value.size)}`}
                            </Typography>
                        </Box>

                        {!disabled && (
                            <IconButton
                                onClick={() => onChange(null)}
                                sx={{
                                    color: DANGER,
                                    alignSelf: {
                                        xs: "flex-end",
                                        sm: "center",
                                    },
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                ) : (
                    <UploadButton
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={trigger}
                        disabled={disabled}
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "auto",
                            },
                            minWidth: {
                                sm: 120,
                            },
                        }}
                    >
                        Upload
                    </UploadButton>
                )}
            </Paper>

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 1,
                        borderRadius: 2,
                    }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <FieldError message={errors} />
        </Box>
    );
}

// ═══════════════════════════════════════════════════════════════
// Variant 3 — Front / Back Upload
// ═══════════════════════════════════════════════════════════════

export function UploadVariant3({ label, value, onChange, disabled = false }: Variant3Props) {
    const [error, setError] = useState<string | null>(null);

    const handleFile = useCallback(
        (file: File) => {
            const validationError = validate(file);
            if (validationError) {
                setError(validationError);
                return;
            }
            setError(null);
            onChange(toUploadedFile(file));
        },
        [onChange]
    );

    const { trigger, inputElement } = useFileInput(ACCEPTED_EXTENSIONS, handleFile);

    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
            {!disabled && inputElement}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: 12, sm: 14 }, textAlign: 'left', }}>{label}</Typography>

                {value ? <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ flex: 1, minWidth: 0, textAlign: "left", width: 'max-content' }}>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: LABEL_COLOR, fontSize: { xs: 11, sm: 14 }, lineHeight: 1.4, wordBreak: "break-word" }}
                        >
                            {value.name}
                        </Typography>

                        <Typography variant="caption" sx={{ color: SUB_COLOR, textTransform: "uppercase", fontSize: { xs: 12, sm: 14 }, letterSpacing: 0.3 }}>
                            {`Uploaded ${formatDate(value.uploadedAt)} • ${formatSize(value.size)}`}
                        </Typography>
                    </Box>

                    {/* Hide the delete action entirely in disabled/View mode */}
                    {!disabled && (
                        <IconButton
                            size="small"
                            onClick={() => onChange(null)}
                            sx={{ color: DANGER, flexShrink: 0 }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box> :
                    <UploadButton onClick={trigger} startIcon={<FileDownloadIcon />} disabled={disabled}>
                        Upload
                    </UploadButton>}
            </Box>

            {
                error && (
                    <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )
            }

            {/* {value && <FileRow uploadedFile={value} onRemove={() => onChange(null)} disabled={disabled} />} */}
        </Paper >
    );
}