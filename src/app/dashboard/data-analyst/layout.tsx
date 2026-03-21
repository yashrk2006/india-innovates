"use client";
import { useState, ReactNode } from "react";
import { SidebarContext } from "@/components/data-analyst/SidebarContext";
import DataAnalystSidebar from "@/components/data-analyst/DataAnalystSidebar";

export default function DataAnalystLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen }}>
            <div className="flex h-screen bg-stone-50 text-slate-700 overflow-hidden" style={{ fontFamily: "'Public Sans', 'Literata', serif" }}>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                <DataAnalystSidebar />
                {children}
            </div>
        </SidebarContext.Provider>
    );
}
