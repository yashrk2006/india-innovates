import { SidebarProvider } from "@/components/super-admin/SidebarContext";
import { SuperAdminSidebar } from "@/components/super-admin/SuperAdminSidebar";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex h-screen overflow-hidden bg-stone-50 text-slate-900 font-sans selection:bg-slate-800/20">
                <SuperAdminSidebar />
                <div className="flex-1 flex flex-col min-w-0 bg-stone-50 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
}
