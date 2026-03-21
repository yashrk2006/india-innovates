"use client";
import { useState, ReactNode } from "react";
import { SidebarContext } from "@/components/party-central/SidebarContext";
import PartyCentralSidebar from "@/components/party-central/PartyCentralSidebar";

export default function PartyCentralLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen }}>
            <div className="flex h-screen bg-stone-50 text-slate-700 overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                <PartyCentralSidebar />
                {children}
            </div>
        </SidebarContext.Provider>
    );
}
