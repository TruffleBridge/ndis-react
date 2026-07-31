import type { StylesConfig } from "react-select";
import type { AutocompleteOption } from "./autocompleteField";

export const getSelectStyles = (
  error?: string,
  disabled?: boolean
): StylesConfig<AutocompleteOption, boolean> => ({
  control: (base, state) => ({
    ...base,
    minHeight: 42,
    height: "auto",
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: disabled ? "#F4F4F4" : "#FFFFFF",
    borderWidth: "1.4px",
    borderColor: error
      ? "#EF4444"
      : state.isFocused
        ? "#086D63"
        : "#D0D5DD",
    boxShadow: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    "&:hover": {
      borderColor: error ? "#EF4444" : state.isFocused ? "#086D63" : "#D1D5DB",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "2px 12px",
  }),

  input: (base) => ({
    ...base,
    color: "#111827",
    fontSize: 14,
    margin: 0,
    padding: 0,
  }),

  placeholder: (base) => ({
    ...base,
    color: "#7F7F7F",
    fontSize: 14,
    opacity: 1,
    textAlign: 'left'
  }),

  singleValue: (base) => ({
    ...base,
    color: "#111827",
    fontSize: 14,
    textAlign: 'left'
  }),

  menu: (base) => ({
    ...base,
    borderRadius: 8,
    marginTop: 4,
    boxShadow:
      "0px 4px 6px -2px rgba(16,24,40,0.03), 0px 12px 16px -4px rgba(16,24,40,0.08)",
    zIndex: 99999,
    overflow: "hidden", // clip child so only menuList scrolls, not the whole menu
  }),

  // NOTE: actual scrolling now handled by the custom MenuList component
  // (fixed maxHeight + overflowY set inline there). This stays minimal.
  menuList: (base) => ({
    ...base,
    padding: 4,
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 99999,
  }),

  option: (base, state) => ({
    ...base,
    fontSize: 13,
    color: "#111827",
    borderRadius: 6,
    backgroundColor: state.isSelected
      ? "#E6F4F2"
      : state.isFocused
        ? "#F3F4F6"
        : "transparent",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#E6F4F2",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: "#9CA3AF",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.15s ease",
  }),

  clearIndicator: (base) => ({
    ...base,
    color: "#9CA3AF",
  }),

  loadingIndicator: (base) => ({
    ...base,
    color: "#086D63",
  }),

  multiValue: () => ({
    display: "none",
  }),
});

export const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    mb: 1,
  },
  chipSx: {
    '& .MuiChip-label': {
      fontSize: 11,
      fontWeight: 400
    },
    '&.MuiChip-root': {
      svg: { fontSize: 14 },
      height: "26px"
    }
  }
};