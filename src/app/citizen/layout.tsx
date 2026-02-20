"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Components ---

function Header() {
    return (
        <header className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-sm border-b border-stone-200 px-5 py-4 flex items-center justify-between md:hidden">
            <div className="flex items-center gap-3">
                {/* Logo Placeholder */}
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
                </div>
                <div>
                    <h1 className="font-display font-bold text-xl text-slate-900 leading-tight">Varanasi North</h1>
                    <p className="text-xs text-stone-500 font-medium tracking-wide uppercase">BoothIQ Portal</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="size-9 rounded-full bg-stone-100 flex items-center justify-center text-slate-700 hover:bg-stone-200 transition-colors relative">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button className="size-9 rounded-full bg-stone-100 flex items-center justify-center text-slate-700 hover:bg-stone-200 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">translate</span>
                </button>
            </div>
        </header>
    );
}

function Sidebar() {
    const router = useRouter();

    const handleLogout = () => {
        // Clear cookies
        document.cookie = "citizen_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        // Redirect to login
        router.push("/auth?role=citizen");
    };

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 h-screen sticky top-0">
            <div className="p-6 border-b border-stone-100">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <span className="material-symbols-outlined text-[24px]">how_to_vote</span>
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-xl text-slate-900 leading-none">BoothIQ</h1>
                        <p className="text-xs text-stone-500 font-medium tracking-wide uppercase mt-1">Citizen Portal</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <Link href="/citizen" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary font-bold">
                    <span className="material-symbols-outlined icon-filled">home</span>
                    Home
                </Link>
                <Link href="/citizen/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-primary transition-colors font-medium">
                    <span className="material-symbols-outlined">person</span>
                    My Profile
                </Link>
                <Link href="/citizen/schemes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-primary transition-colors font-medium">
                    <span className="material-symbols-outlined">description</span>
                    Government Schemes
                </Link>
                <Link href="/citizen/area-updates" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-primary transition-colors font-medium">
                    <span className="material-symbols-outlined">map</span>
                    Area Updates
                </Link>
                <Link href="/citizen/grievance" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 hover:text-primary transition-colors font-medium">
                    <span className="material-symbols-outlined">report_problem</span>
                    Lodge Grievance
                </Link>
            </nav>

            <div className="p-4 border-t border-stone-100">
                <div className="bg-stone-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="size-10 rounded-full bg-stone-200 shrink-0 overflow-hidden">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3J1WeCCl8xIB9H2eEmeXu8IwTeUxUNNB5daxtbY_3gXgPzpgNnAM_1QdqDuMke1ok64ZC_wTbkN7bQZuvreUOsdEEXOJbXl28S2jnf3Br105ATD--gdMOks8CHgln8Zhn0dxdjhksglLhJWAn4GEJs8CGMiWKihlTwoBARAIR9lc17pZDGvxo1_KoMo0cswWqyErlO_GUrgvXpSeHa9fqXICXyjhLSWBr9ryoWgbBlwe9Cr77RH7HPqCFT2Ol9IjgOg3-c7E_fw"
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-sm text-slate-900 truncate">Rajesh Kumar</p>
                        <p className="text-xs text-stone-500 truncate">Varanasi North</p>
                    </div>
                    <button onClick={handleLogout} className="ml-auto text-stone-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

function BottomNav() {
    return (
        <nav className="md:hidden sticky bottom-0 bg-white border-t border-stone-200 px-2 pb-4 pt-2 flex justify-around items-end z-40">
            <Link href="/citizen" className="flex flex-col items-center gap-1 p-2 w-16 group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform filled">home</span>
                <span className="text-[10px] font-bold text-primary">Home</span>
            </Link>
            <Link href="/citizen/schemes" className="flex flex-col items-center gap-1 p-2 w-16 group text-stone-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">description</span>
                <span className="text-[10px] font-medium">Schemes</span>
            </Link>
            <Link href="/citizen/area-updates" className="flex flex-col items-center gap-1 p-2 w-16 group text-stone-400 hover:text-primary transition-colors relative -top-5">
                <div className="size-14 rounded-full bg-primary text-white shadow-lg shadow-green-900/20 flex items-center justify-center border-4 border-white group-hover:bg-primary-dark transition-colors">
                    <span className="material-symbols-outlined text-2xl">map</span>
                </div>
                <span className="text-[10px] font-medium relative -top-1">My Area</span>
            </Link>
            <Link href="/citizen/grievance" className="flex flex-col items-center gap-1 p-2 w-16 group text-stone-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">report_problem</span>
                <span className="text-[10px] font-medium">Grievance</span>
            </Link>
            <Link href="/citizen/profile" className="flex flex-col items-center gap-1 p-2 w-16 group text-stone-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">person</span>
                <span className="text-[10px] font-medium">Profile</span>
            </Link>
        </nav>
    );
}

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[#f0f2f0] font-body text-slate-900">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <Header /> {/* Mobile Header */}

                {/* Desktop Header / Top Bar */}
                <header className="hidden md:flex items-center justify-between px-8 py-5 bg-white/50 backdrop-blur-sm sticky top-0 z-30 border-b border-stone-200/50">
                    <div>
                        <h2 className="text-2xl font-bold font-display text-slate-900">Start your day, Rajesh</h2>
                        <p className="text-stone-500 text-sm">Here&apos;s what&apos;s happening in your constituency today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
                            <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold text-slate-700">Booth #142 Online</span>
                        </div>
                        <button className="size-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-slate-600 hover:bg-stone-50 hover:text-primary transition-colors shadow-sm">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="w-full max-w-7xl mx-auto md:p-8">
                        {/* On mobile, we still want the chassis-like feel for the content, but full width on desktop */}
                        <div className="md:w-full min-h-screen md:min-h-0 bg-background-light md:bg-transparent shadow-2xl md:shadow-none pb-24 md:pb-0">
                            {children}
                        </div>
                    </div>
                </main>

                <BottomNav />
            </div>
        </div>
    );
}
