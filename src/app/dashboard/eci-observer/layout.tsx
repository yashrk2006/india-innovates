"use client";
import { useState, ReactNode } from "react";
import ECISidebar from "@/components/eci/ECISidebar";
import { SidebarContext } from "@/components/eci/SidebarContext";

export default function ECILayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen }}>
            <div className="flex h-screen bg-[#06080e] text-slate-900 overflow-hidden relative">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                <ECISidebar isOpen={isSidebarOpen} />
                {children}
            </div>
        </SidebarContext.Provider>
    );
}
