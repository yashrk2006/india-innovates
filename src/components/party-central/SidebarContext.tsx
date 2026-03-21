"use client";
import { createContext, useContext } from "react";

export const SidebarContext = createContext<{ isOpen: boolean; setIsOpen: (val: boolean) => void }>({ isOpen: false, setIsOpen: () => {} });

export function useSidebar() {
    return useContext(SidebarContext);
}
