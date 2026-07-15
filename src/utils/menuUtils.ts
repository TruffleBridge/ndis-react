export function updateSelectedMenu(setSelectedMenu: (menu: string) => void, menuName: string) {
    if (!menuName) return;

    const formatted = menuName.trim();
    setSelectedMenu(formatted);
}

// status values formatted from the backend data
export const formatStatus = (status: string) => {
    return status
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
};