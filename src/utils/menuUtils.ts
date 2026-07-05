export function updateSelectedMenu(setSelectedMenu: (menu: string) => void, menuName: string) {
    if (!menuName) return;

    const formatted = menuName.trim();
    setSelectedMenu(formatted);
}