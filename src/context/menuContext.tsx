import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react'

type MenuContextType = {
    selectedMenu: string;
    setSelectedMenu: (menu: string) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
    const [selectedMenu, setSelectedMenu] = useState<string>("");

    return (
        <MenuContext.Provider value={{ selectedMenu, setSelectedMenu }}>
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenu must be used inside MenuProvider");
    }
    return context;
}