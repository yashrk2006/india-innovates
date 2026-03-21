"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getNotifications, markNotificationRead, markAllNotificationsRead, subscribeToNotifications } from "@/lib/services";
import type { CitizenNotification } from "@/lib/types";
import { LanguageProvider, useLanguage } from "@/components/citizen/LanguageContext";
import ESarthiBot from "@/components/citizen/ESarthiBot";

// --- Nav Items Config ---
const navItems = [
    { href: "/citizen", label: "Home", icon: "home" },
    { href: "/citizen/profile", label: "My Profile", icon: "person" },
    { href: "/citizen/schemes", label: "Government Schemes", icon: "description" },
    { href: "/citizen/area-updates", label: "Area Updates", icon: "map" },
    { href: "/citizen/grievance", label: "Lodge Grievance", icon: "report_problem" },
];

// --- Components ---

function Header({ onNotificationToggle, unreadCount }: { onNotificationToggle: () => void; unreadCount: number }) {
    const [langOpen, setLangOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage(); // Use useLanguage hook

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 px-5 py-4 flex items-center justify-between md:hidden">
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                    <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
                </div>
                <div>
                    <h1 className="font-display font-bold text-xl text-slate-900 leading-tight">Varanasi North</h1>
                    <p className="text-xs text-stone-500 font-medium tracking-wide uppercase">BoothIQ Portal</p>
                </div>
            </div>
            <div className="flex items-center gap-2 relative">
                <button
                    onClick={onNotificationToggle}
                    className="size-9 rounded-full bg-stone-100 flex items-center justify-center text-slate-700 hover:bg-stone-200 transition-colors relative active:scale-95"
                >
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 size-4 bg-red-500 rounded-full border-2 border-white text-[8px] font-bold text-white flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>
                {/* Language Selector */}
                <div className="relative">
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="size-9 rounded-full bg-stone-100 flex items-center justify-center text-slate-700 hover:bg-stone-200 transition-colors active:scale-95"
                    >
                        <span className="text-[10px] font-bold">{language}</span>
                    </button>

                    {langOpen && (
                        <div className="absolute top-12 right-0 bg-white border border-stone-200 shadow-xl rounded-xl py-2 w-24 flex flex-col z-50 animate-fade-in-up">
                            {["EN", "HI", "UR"].map(l => (
                                <button
                                    key={l}
                                    onClick={() => { setLanguage(l as any); setLangOpen(false); }}
                                    className={`px-4 py-2 text-sm text-center hover:bg-stone-50 transition-colors ${language === l ? "font-bold text-primary" : "text-slate-700 font-medium"}`}
                                >
                                    {l === "EN" ? "English" : l === "HI" ? "हिंदी" : "اردو"}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const { t } = useLanguage();

    const handleLogout = () => {
        document.cookie = "citizen_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push("/auth/login?role=citizen");
    };

    const sideItems = [
        { href: "/citizen", label: t("citizen_portal"), icon: "home" },
        { href: "/citizen/profile", label: t("identity_verified"), icon: "person" },
        { href: "/citizen/voter-services", label: t("voter_services"), icon: "assignment" },
        { href: "/citizen/schemes", label: t("manifesto_tracker"), icon: "description" },
        { href: "/citizen/area-updates", label: "My Area Updates", icon: "map" },
        { href: "/citizen/grievance", label: "Report Issue", icon: "report_problem" },
    ];

    const isActive = (href: string) => {
        if (href === "/citizen") return pathname === "/citizen";
        return pathname.startsWith(href);
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
                {sideItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive(item.href)
                            ? "bg-primary/10 text-primary font-bold shadow-sm"
                            : "text-stone-600 hover:bg-stone-50 hover:text-primary"
                            }`}
                    >
                        <span className={`material-symbols-outlined ${isActive(item.href) ? "icon-filled" : ""}`}>{item.icon}</span>
                        {item.label}
                        {isActive(item.href) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                    </Link>
                ))}
            </nav>

            {/* Quick Help Card */}
            <div className="px-4 pb-2">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-lg">support_agent</span>
                        <span className="font-bold text-sm text-slate-900">{t("need_help")}</span>
                    </div>
                    <p className="text-xs text-stone-500 mb-3">Contact your booth worker for assistance with any issue.</p>
                    <button
                        onClick={() => alert("Connecting to your assigned Booth Worker...")}
                        className="w-full py-2 bg-primary text-white font-bold text-xs rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        {t("call_booth_worker")}
                    </button>
                </div>
            </div>

            <div className="p-4 border-t border-stone-100">
                <div className="bg-stone-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 shrink-0 flex items-center justify-center text-primary font-bold text-lg">
                        R
                    </div>
                    <div className="overflow-hidden flex-1">
                        <p className="font-bold text-sm text-slate-900 truncate">Rajesh Kumar</p>
                        <p className="text-xs text-stone-500 truncate">Varanasi North • Booth 142</p>
                    </div>
                    <button onClick={handleLogout} className="ml-auto text-stone-400 hover:text-red-500 transition-colors" title="Sign Out">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

function BottomNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const isActive = (href: string) => {
        if (href === "/citizen") return pathname === "/citizen";
        return pathname.startsWith(href);
    };

    const mobileNav = [
        { href: "/citizen", label: t("home"), icon: "home" },
        { href: "/citizen/voter-services", label: t("voter_hub"), icon: "assignment" },
        { href: "/citizen/area-updates", label: t("my_area"), icon: "map", center: true },
        { href: "/citizen/grievance", label: t("grievance"), icon: "report_problem" },
        { href: "/citizen/profile", label: t("profile"), icon: "person" },
    ];

    return (
        <nav className="md:hidden sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-stone-200 px-2 pb-4 pt-2 flex justify-around items-end z-40">
            {mobileNav.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center gap-1 p-2 w-16 group transition-colors ${item.center ? "relative -top-5" : ""
                        } ${isActive(item.href) ? "text-primary" : "text-stone-400 hover:text-primary"}`}
                >
                    {item.center ? (
                        <>
                            <div className={`size-14 rounded-full shadow-lg flex items-center justify-center border-4 border-white transition-all ${isActive(item.href)
                                ? "bg-primary text-white shadow-primary/30 scale-110"
                                : "bg-primary/80 text-white shadow-stone-200 group-hover:bg-primary"
                                }`}>
                                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            </div>
                            <span className={`text-[10px] relative -top-1 ${isActive(item.href) ? "font-bold" : "font-medium"}`}>{item.label}</span>
                        </>
                    ) : (
                        <>
                            <span className={`material-symbols-outlined group-hover:scale-110 transition-transform ${isActive(item.href) ? "icon-filled" : ""}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] ${isActive(item.href) ? "font-bold" : "font-medium"}`}>{item.label}</span>
                            {isActive(item.href) && <div className="w-1 h-1 rounded-full bg-primary" />}
                        </>
                    )}
                </Link>
            ))}
        </nav>
    );
}

function NotificationPanel({ isOpen, onClose, notifications, onMarkRead, onMarkAllRead }: {
    isOpen: boolean;
    onClose: () => void;
    notifications: CitizenNotification[];
    onMarkRead: (id: number) => void;
    onMarkAllRead: () => void;
}) {
    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const formatTime = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl overflow-y-auto animate-slide-in">
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-stone-200 p-5 flex items-center justify-between">
                    <div>
                        <h2 className="font-display font-bold text-xl text-slate-900">Notifications</h2>
                        <p className="text-xs text-stone-500">{unreadCount} unread</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button onClick={onMarkAllRead} className="text-xs text-primary font-bold hover:underline">
                                Mark all read
                            </button>
                        )}
                        <button onClick={onClose} className="size-9 rounded-full bg-stone-100 flex items-center justify-center text-slate-600 hover:bg-stone-200 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>
                <div className="divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-stone-400">
                            <span className="material-symbols-outlined text-4xl mb-2 block">notifications_off</span>
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => !n.is_read && onMarkRead(n.id)}
                                className={`p-5 flex gap-3 hover:bg-stone-50 transition-colors cursor-pointer ${!n.is_read ? "bg-primary/[0.02]" : ""}`}
                            >
                                <div className="size-10 rounded-xl shrink-0 flex items-center justify-center bg-stone-100 text-stone-600">
                                    <span className="material-symbols-outlined">{n.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                                        {!n.is_read && <div className="size-2 rounded-full bg-primary shrink-0" />}
                                    </div>
                                    <p className="text-sm text-stone-600 line-clamp-2 mb-1">{n.body}</p>
                                    <span className="text-xs text-stone-400">{formatTime(n.created_at)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

// --- Page Title Map ---
const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/citizen": { title: "Welcome back, Rajesh", subtitle: "Here&apos;s what&apos;s happening in your constituency today." },
    "/citizen/profile": { title: "My Profile", subtitle: "Manage your voter identity and participation." },
    "/citizen/voter-services": { title: "Voter Services", subtitle: "Download forms and guides for electoral participation." },
    "/citizen/schemes": { title: "Government Schemes", subtitle: "Benefits and programs available for you." },
    "/citizen/area-updates": { title: "Area Updates", subtitle: "Development work in Ward 4, Varanasi North." },
    "/citizen/grievance": { title: "Lodge Grievance", subtitle: "Report issues in your area." },
    "/citizen/verify": { title: "Verification", subtitle: "Verify your identity securely." },
};

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<CitizenNotification[]>([]);
    const unreadCount = notifications.filter(n => !n.is_read).length;
    const pageInfo = pageTitles[pathname] || pageTitles["/citizen"];

    // Fetch notifications from Supabase
    useEffect(() => {
        getNotifications().then(setNotifications);
    }, []);

    // Subscribe to realtime notifications
    useEffect(() => {
        let cleanup: (() => void) | undefined;
        
        const setupSubscription = async () => {
            cleanup = await subscribeToNotifications((newNotification) => {
                setNotifications(prev => [newNotification, ...prev]);
            });
        };

        setupSubscription();
        
        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    const handleMarkRead = async (id: number) => {
        const success = await markNotificationRead(id);
        if (success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        }
    };

    const handleMarkAllRead = async () => {
        const success = await markAllNotificationsRead();
        if (success) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
    };

    return (
        <LanguageProvider>
            <div className="flex min-h-screen bg-[#f0f2f0] font-body text-slate-900" suppressHydrationWarning>
                <Sidebar />

                <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                    <Header onNotificationToggle={() => setShowNotifications(true)} unreadCount={unreadCount} />

                    {/* Desktop Header */}
                    <header className="hidden md:flex items-center justify-between px-8 py-5 bg-white/50 backdrop-blur-sm sticky top-0 z-30 border-b border-stone-200/50">
                        <div>
                            <h2 className="text-2xl font-bold font-display text-slate-900">{pageInfo.title}</h2>
                            <p className="text-stone-500 text-sm" dangerouslySetInnerHTML={{ __html: pageInfo.subtitle }} />
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Language Selector Desktop - Moved to a sub-component to use useLanguage hook safely */}
                            <DesktopLanguageSelector />

                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
                                <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-slate-700">Booth #142 Online</span>
                            </div>
                            <button
                                onClick={() => setShowNotifications(true)}
                                className="size-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-slate-600 hover:bg-stone-50 hover:text-primary transition-colors shadow-sm relative"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto scroll-smooth">
                        <div className="w-full max-w-7xl mx-auto md:p-8">
                            <div className="md:w-full min-h-screen md:min-h-0 bg-white md:bg-transparent shadow-2xl md:shadow-none pb-24 md:pb-0">
                                {children}
                            </div>
                        </div>
                    </main>

                    <ESarthiBot />
                    
                    {/* Mobile Navigation */}

                    <BottomNav />
                </div>

                <NotificationPanel
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    notifications={notifications}
                    onMarkRead={handleMarkRead}
                    onMarkAllRead={handleMarkAllRead}
                />
            </div>
        </LanguageProvider>
    );
}

function DesktopLanguageSelector() {
    const { language, setLanguage } = useLanguage();
    return (
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-200">
            {["EN", "HI", "UR"].map(l => (
                <button
                    key={l}
                    onClick={() => setLanguage(l as any)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${language === l ? "bg-white text-primary shadow-sm" : "text-stone-500 hover:text-slate-700"}`}
                >
                    {l}
                </button>
            ))}
        </div>
    );
}
