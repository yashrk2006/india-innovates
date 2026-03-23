"use client";
import { useState, ReactNode } from "react";
import ManagerSidebar from "@/components/features/manager/ManagerSidebar";
import { SidebarContext } from "@/components/features/manager/SidebarContext";

export default function ManagerLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen }}>
            <div className="flex h-screen bg-stone-50 text-stone-900 overflow-hidden" style={{ fontFamily: "'Public Sans', 'Literata', serif" }}>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-stone-900/50 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                <ManagerSidebar isOpen={isSidebarOpen} />
                {children}
            </div>
        </SidebarContext.Provider>
    );
}
