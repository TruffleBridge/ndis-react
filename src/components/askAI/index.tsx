import React, { useRef, useState, cloneElement, isValidElement } from "react";
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Chip,
    InputBase,
    Popper,
    ClickAwayListener,
    Grow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

/**
 * ------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------
 */
export interface QuickOption {
    label: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    fromAssistant: boolean;
}

export interface VirtualAssistantWidgetProps {
    open: boolean;
    title?: string;
    messages: ChatMessage[];
    quickOptions?: QuickOption[];
    onClose: () => void;
    onSelectOption?: (label: string) => void;
    onSend?: (value: string) => void;
    placeholder?: string;
}

export interface VirtualAssistantLauncherProps
    extends Omit<VirtualAssistantWidgetProps, "open" | "onClose"> {
    /** Where the floating action button + popup panel sit on screen. Default: bottom-left */
    anchor?: "bottom-left" | "bottom-right";
}

/**
 * ------------------------------------------------------------------
 * Sub-component: Header
 * ------------------------------------------------------------------
 */
function AssistantHeader({
    title,
    onClose,
}: {
    title: string;
    onClose: () => void;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                pt: 3,
                pb: 2,
            }}
        >
            <Typography
                sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#111827",
                }}
            >
                {title}
            </Typography>
            <IconButton
                onClick={onClose}
                size="small"
                sx={{
                    color: "#111827",
                    p: 0.5,
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}

/**
 * ------------------------------------------------------------------
 * Sub-component: Single chat bubble (assistant style, sparkle + text)
 * ------------------------------------------------------------------
 */
function AssistantMessage({ text }: { text: string }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                px: 3,
                py: 1,
            }}
        >
            <AutoAwesomeIcon
                sx={{
                    fontSize: 16,
                    color: "#a855f7",
                    mt: "3px",
                    flexShrink: 0,
                }}
            />
            <Typography
                sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "#1f2937",
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}

/**
 * ------------------------------------------------------------------
 * Sub-component: Quick option pill row
 * ------------------------------------------------------------------
 */
function QuickOptionsRow({
    options,
    onSelect,
}: {
    options: QuickOption[];
    onSelect?: (label: string) => void;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.25,
                px: 3,
                pt: 1,
                pb: 2,
            }}
        >
            {options.map((opt) => (
                <Chip
                    key={opt.label}
                    label={opt.label}
                    onClick={() => onSelect?.(opt.label)}
                    sx={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#737373",
                        bgcolor: "#ffffff",
                        border: "1px solid #EBCDFE",
                        borderRadius: "999px",
                        px: 1,
                        height: 28,
                    }}
                />
            ))}
        </Box>
    );
}

/**
 * ------------------------------------------------------------------
 * Sub-component: Bottom input bar
 * ------------------------------------------------------------------
 */
function AssistantInputBar({
    placeholder,
    onSend,
}: {
    placeholder: string;
    onSend?: (value: string) => void;
}) {
    const [value, setValue] = useState("");

    const handleSend = () => {
        if (!value.trim()) return;
        onSend?.(value.trim());
        setValue("");
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mx: 3,
                mb: 3,
                mt: 1,
                px: 1.5,
                py: 1,
                border: "1px solid #E6E6E6",
                borderRadius: "999px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05),0 10px 25px rgba(99, 102, 241, 0.12),0 16px 40px rgba(168, 85, 247, 0.12)",

            }}
        >
            <IconButton size="small" sx={{
                color: "#6b7280",
                border: '0.8px solid #E6E6E6',
                width: 34,
                height: 34,
                transform: 'rotateY(180deg)', rotate: '19deg'
            }}>
                <AttachFileIcon fontSize="small" />
            </IconButton>

            <InputBase
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                }}
                placeholder={placeholder}
                sx={{
                    flex: 1,
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: "#111827",
                    "& input::placeholder": {
                        color: "#666666",
                        opacity: 1,
                    },
                }}
            />

            <IconButton size="small" sx={{ color: "#1442A7" }}>
                <MicIcon fontSize="small" />
            </IconButton>

            <IconButton
                onClick={handleSend}
                size="small"
                sx={{
                    bgcolor: "#004BEE",
                    color: "#ffffff",
                    width: 34,
                    height: 34,
                    "&:hover": { bgcolor: "#004BEE" },
                }}
            >
                <SendIcon sx={{ fontSize: 18 }} />
            </IconButton>
        </Box>
    );
}

/**
 * ------------------------------------------------------------------
 * Parent component: VirtualAssistantWidget
 * ------------------------------------------------------------------
 * Composes header, scrollable message list (+ quick options), and
 * the bottom input bar inside the bordered gradient card seen in
 * the reference screenshot.
 */
export default function VirtualAssistantWidget({
    open,
    title = "Virtual Assistant",
    messages,
    quickOptions,
    onClose,
    onSelectOption,
    onSend,
    placeholder = "Ask a question",
}: VirtualAssistantWidgetProps) {
    if (!open) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                width: 380,
                maxWidth: "92vw",
                height: 470,
                maxHeight: "75vh",
                display: "flex",
                flexDirection: "column",
                borderRadius: "20px",
                overflow: "hidden",
                fontFamily: "Inter, sans-serif",
                // gradient border effect matching screenshot (purple -> orange)
                border: "2px solid transparent",
                backgroundImage:
                    "linear-gradient(#ffffff, #ffffff), linear-gradient(160deg, #a855f7 0%, #a855f7 40%, #f97316 100%)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            }}
        >
            <AssistantHeader title={title} onClose={onClose} />

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                }}
            >
                <Box sx={{ overflow: 'auto' }}>
                    {messages.map((msg) =>
                        msg.fromAssistant ? (
                            <AssistantMessage key={msg.id} text={msg.text} />
                        ) : (
                            <Box key={msg.id} sx={{ px: 3, py: 1, textAlign: "right" }}>
                                <Typography
                                    sx={{
                                        display: "inline-block",
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: "14px",
                                        bgcolor: "#eff6ff",
                                        color: "#1f2937",
                                        borderRadius: "12px",
                                        px: 1.5,
                                        py: 1,
                                    }}
                                >
                                    {msg.text}
                                </Typography>
                            </Box>
                        )
                    )}

                    {quickOptions && quickOptions.length > 0 && (
                        <QuickOptionsRow options={quickOptions} onSelect={onSelectOption} />
                    )}
                </Box>
            </Box>

            <AssistantInputBar placeholder={placeholder} onSend={onSend} />
        </Paper>
    );
}

/**
 * ------------------------------------------------------------------
 * Popover wrapper: YOU provide the CTA (any element — button, chip,
 * icon, whatever). Wrap it with this component and it opens the
 * assistant panel anchored right next to wherever that CTA lives on
 * the page. No fixed positioning — it just follows your button.
 *
 * Usage:
 *   <VirtualAssistantPopover messages={messages} quickOptions={opts}>
 *     <Button>Ask AI</Button>
 *   </VirtualAssistantPopover>
 * ------------------------------------------------------------------
 */
export interface VirtualAssistantPopoverProps
    extends Omit<VirtualAssistantWidgetProps, "open" | "onClose"> {
    /** The trigger element. Click toggles the popup open/closed. */
    children: React.ReactElement;
    /** Popper placement relative to the trigger element. Default: "bottom-start" */
    placement?:
    | "bottom-start"
    | "bottom-end"
    | "bottom"
    | "top-start"
    | "top-end"
    | "top";
}

export function VirtualAssistantPopover({
    children,
    placement = "bottom-start",
    ...widgetProps
}: VirtualAssistantPopoverProps) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLElement>(null);

    const trigger = isValidElement(children)
        ? cloneElement(children as React.ReactElement<any>, {
            ref: anchorRef,
            onClick: (e: React.MouseEvent) => {
                const existingOnClick = (children as React.ReactElement<any>).props
                    .onClick as ((event: React.MouseEvent) => void) | undefined;
                existingOnClick?.(e);
                setOpen((v) => !v);
            },
        })
        : children;

    return (
        <>
            {trigger}

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement={placement}
                transition
                sx={{ zIndex: 1300 }}
                modifiers={[{ name: "offset", options: { offset: [0, 10] } }]}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: "top left" }}>
                        <Box>
                            <ClickAwayListener onClickAway={() => setOpen(false)}>
                                <Box>
                                    <VirtualAssistantWidget
                                        {...widgetProps}
                                        open={open}
                                        onClose={() => setOpen(false)}
                                    />
                                </Box>
                            </ClickAwayListener>
                        </Box>
                    </Grow>
                )}
            </Popper>
        </>
    );
}

/**
 * ------------------------------------------------------------------
 * Launcher: fixed floating action button (bottom-left by default)
 * that opens the popup panel directly above it. Self-contained —
 * owns its own open/close state.
 * ------------------------------------------------------------------
 */
export function VirtualAssistantLauncher({
    anchor = "bottom-left",
    ...widgetProps
}: VirtualAssistantLauncherProps) {
    const [open, setOpen] = useState(false);

    const sideSx = anchor === "bottom-left" ? { left: 24 } : { right: 24 };

    return (
        <>
            {/* Popup panel, anchored above the FAB */}
            {open && (
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 96,
                        zIndex: 1300,
                        ...sideSx,
                    }}
                >
                    <VirtualAssistantWidget
                        {...widgetProps}
                        open={open}
                        onClose={() => setOpen(false)}
                    />
                </Box>
            )}

            {/* Floating "Ask AI" trigger button */}
            <Box
                sx={{
                    position: "fixed",
                    bottom: 24,
                    zIndex: 1300,
                    ...sideSx,
                }}
            >
                <IconButton
                    onClick={() => setOpen((v) => !v)}
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "999px",
                        bgcolor: "#ffffff",
                        border: "1px solid #e9d5ff",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                        "&:hover": { bgcolor: "#faf5ff" },
                    }}
                >
                    {open ? (
                        <CloseIcon sx={{ color: "#7e22ce" }} />
                    ) : (
                        <AutoAwesomeIcon sx={{ color: "#a855f7" }} />
                    )}
                </IconButton>
            </Box>
        </>
    );
}