"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDashboardStats, getBoothWorkers, getBoothAnalytics } from "@/lib/services";

const quickActions = [
    { label: "Lodge Grievance", icon: "report_problem", href: "/citizen/grievance", color: "bg-red-50 text-red-600 border-red-100" },
    { label: "My Schemes", icon: "description", href: "/citizen/schemes", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Area Updates", icon: "map", href: "/citizen/area-updates", color: "bg-green-50 text-green-600 border-green-100" },
];

const upcomingEvents = [
    { id: 1, date: "Mar 4", title: "Voter Registration Drive", location: "Panchayat Bhawan", icon: "event" },
    { id: 2, date: "Mar 8", title: "Women's Day Health Camp", location: "Community Hall", icon: "medical_services" },
    { id: 3, date: "Mar 15", title: "Booth Level Officer Visit", location: "Booth #142", icon: "groups" },
];

function ElectionCountdown() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const target = new Date("2026-03-04T06:00:00");
        const tick = () => {
            const diff = target.getTime() - Date.now();
            if (diff <= 0) return;
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-5 text-white shadow-lg shadow-primary/20 animate-fade-up">
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-3">Election Countdown</p>
            <div className="flex gap-3">
                {[
                    { v: timeLeft.days, l: "Days" },
                    { v: timeLeft.hours, l: "Hours" },
                    { v: timeLeft.minutes, l: "Mins" },
                    { v: timeLeft.seconds, l: "Secs" },
                ].map(({ v, l }) => (
                    <div key={l} className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
                        <p className="font-mono font-bold text-2xl leading-none">{String(v).padStart(2, "0")}</p>
                        <p className="text-white/70 text-[10px] mt-1">{l}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function QuickStats({ voter }: { voter: any }) {
    const [stats, setStats] = useState({ activeGrievances: 0, activeSchemes: 0, totalUpdates: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats().then(data => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    const statItems = [
        { value: voter?.booth_id || "142", label: "Booth No.", icon: "how_to_vote", color: "text-green-600 bg-green-50" },
        { value: loading ? "…" : String(stats.activeGrievances), label: "Active Grievances", icon: "warning", color: "text-orange-600 bg-orange-50" },
        { value: loading ? "…" : String(stats.activeSchemes), label: "Active Schemes", icon: "assignment", color: "text-blue-600 bg-blue-50" },
        { value: loading ? "…" : String(stats.totalUpdates), label: "Area Projects", icon: "construction", color: "text-purple-600 bg-purple-50" },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {statItems.map((s, i) => (
                <div key={s.label} className={`bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow cursor-default animate-fade-up stagger-${i + 1}`}>
                    <div className={`size-10 rounded-full flex items-center justify-center ${s.color}`}>
                        <span className="material-symbols-outlined">{s.icon}</span>
                    </div>
                    <p className="font-bold text-2xl text-slate-900">{s.value}</p>
                    <p className="text-xs text-stone-500 leading-tight">{s.label}</p>
                </div>
            ))}
        </div>
    );
}

function QuickActions() {
    return (
        <div className="animate-fade-up stagger-3">
            <h3 className="font-display text-lg font-bold text-slate-800 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {quickActions.map((a) => (
                    <Link
                        key={a.label}
                        href={a.href}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${a.color}`}
                    >
                        <span className="material-symbols-outlined text-2xl">{a.icon}</span>
                        <span className="text-xs font-bold text-center leading-tight">{a.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function UpcomingEvents() {
    return (
        <div className="animate-fade-up stagger-4">
            <h3 className="font-display text-lg font-bold text-slate-800 mb-3">Upcoming Events</h3>
            <div className="space-y-3">
                {upcomingEvents.map(e => (
                    <div
                        key={e.id}
                        onClick={() => alert(`Registration details for ${e.title} coming soon.`)}
                        className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="shrink-0 text-center bg-primary/10 rounded-xl p-2.5 w-14">
                            <p className="text-xs font-bold text-primary leading-none">{e.date.split(" ")[0]}</p>
                            <p className="text-lg font-bold text-primary leading-tight">{e.date.split(" ")[1]}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-900 truncate">{e.title}</p>
                            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {e.location}
                            </p>
                        </div>
                        <span className="material-symbols-outlined text-stone-300">chevron_right</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BoothHealthScore({ boothId }: { boothId: number }) {
    const [analytics, setAnalytics] = useState({ resolvedGrievances: 0, totalGrievances: 0, resolutionRate: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (boothId) {
            getBoothAnalytics(boothId).then(data => {
                setAnalytics(data);
                setLoading(false);
            });
        }
    }, [boothId]);

    const bars = [
        { label: "Grievance Resolution", value: analytics.resolutionRate, color: "bg-green-500" },
        { label: "Voter Turnout (Goal)", value: 85, color: "bg-orange-500" },
        { label: "Scheme Coverage", value: 72, color: "bg-blue-500" },
    ];

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white p-6 shadow-xl shadow-slate-200/50 animate-fade-up stagger-5">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-display font-bold text-slate-900 text-lg">Booth Intelligence</h3>
                    <p className="text-xs text-stone-500">Real-time progress for Booth #{boothId}</p>
                </div>
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <span className="material-symbols-outlined">analytics</span>
                </div>
            </div>
            <div className="space-y-4">
                {bars.map(b => (
                    <div key={b.label}>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className="text-slate-600">{b.label}</span>
                            <span className="text-slate-900">{b.value}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 animate-fill-bar ${b.color}`}
                                style={{ width: `${b.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Resolved Issues</p>
                    <p className="text-xl font-bold text-green-600">{analytics.resolvedGrievances}</p>
                </div>
                <div className="text-center border-l border-slate-100">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Total Issues</p>
                    <p className="text-xl font-bold text-slate-800">{analytics.totalGrievances}</p>
                </div>
            </div>
        </div>
    );
}

function YourBoothTeam({ boothId }: { boothId: number }) {
    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (boothId) {
            getBoothWorkers(boothId).then(data => {
                setWorkers(data);
                setLoading(false);
            });
        }
    }, [boothId]);

    if (loading) return <div className="animate-pulse bg-stone-100 h-32 rounded-xl" />;
    if (workers.length === 0) return null;

    return (
        <div className="animate-fade-up stagger-2">
            <h3 className="font-display text-lg font-bold text-slate-800 mb-3 px-1">Your Booth Support Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workers.map((w, i) => (
                    <div key={w.id} className={`bg-white/60 backdrop-blur-md rounded-2xl border border-white p-5 shadow-sm flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-up stagger-${i+1}`}>
                        <div className="size-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20 ring-4 ring-white">
                            {w.name[0]}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 leading-tight">{w.name}</h4>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">{w.role.replace(/-/g, ' ')}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-green-600 font-bold uppercase">Available Now</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => alert(`Calling ${w.name}...`)} className="size-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100 hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-90">
                                <span className="material-symbols-outlined text-lg">call</span>
                            </button>
                             <button onClick={() => alert(`Starting Chat with ${w.name}...`)} className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90">
                                <span className="material-symbols-outlined text-lg">chat</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ElectedRepresentatives() {
    const reps = [
        { role: "Member of Legislative Assembly", name: "Ravi Sharma", party: "BJP", image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=150" },
        { role: "City Corporator (Ward 4)", name: "Amit Patel", party: "BJP", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" },
    ];

    return (
        <div className="animate-fade-up stagger-5">
            <h3 className="font-display text-lg font-bold text-slate-800 mb-3">Your Representatives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reps.map(r => (
                    <div key={r.role} className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <img src={r.image} alt={r.name} className="size-16 rounded-full object-cover border-2 border-primary/20 bg-stone-100" />
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1">{r.role}</p>
                            <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">{r.name}</h4>
                            <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-sm border border-orange-200">
                                {r.party}
                            </span>
                        </div>
                        <button onClick={() => alert(`Contact details for ${r.name} coming soon.`)} className="size-10 rounded-full bg-stone-50 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors shrink-0">
                            <span className="material-symbols-outlined">call</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CampaignPromises() {
    const promises = [
        { title: "24/7 Water Supply in Ward 4", status: "In Progress", progress: 65 },
        { title: "New Community Health Clinic", status: "Completed", progress: 100 },
        { title: "Free Wi-Fi at Panchayat", status: "Planned", progress: 0 },
        { title: "Repair Main Connection Road", status: "Completed", progress: 100 },
    ];

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 shadow-lg animate-fade-up stagger-6 border border-slate-700">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="font-display font-bold text-white text-lg">Manifesto Tracker</h3>
                    <p className="text-xs text-slate-400">Tracking promises made by current leadership</p>
                </div>
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm border border-white/10">
                    <span className="material-symbols-outlined">track_changes</span>
                </div>
            </div>

            <div className="space-y-4">
                {promises.map((p, i) => (
                    <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-slate-200">{p.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded focus:outline-none ${
                                p.progress === 100 ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                                p.progress > 0 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 
                                'bg-slate-700 text-slate-300 border border-slate-600'
                            }`}>
                                {p.status}
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                    p.progress === 100 ? 'bg-green-400' : 'bg-blue-400'
                                }`}
                                style={{ width: `${p.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function CitizenHomePage() {
    const [voter, setVoter] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem("verified_voter");
        if (stored) {
            setVoter(JSON.parse(stored));
        }
    }, []);

    return (
        <div className="p-5 md:p-0 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                        Namaste, <span className="text-primary">{voter?.name || "Citizen"}</span>
                    </h2>
                    <p className="text-slate-500 font-medium">Welcome to your Citizen Intelligence Portal</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-stone-100 shadow-sm flex items-center gap-3">
                    <div className="size-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">verified</span>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">Identity Verified</p>
                        <p className="text-xs font-bold text-slate-700">{voter?.epic_number || voter?.aadhaar || "Digilocker Secure"}</p>
                    </div>
                </div>
            </div>

            <ElectionCountdown />
            <YourBoothTeam boothId={voter?.eci?.booth_id || 142} />
            <QuickStats voter={voter} />
            <ElectedRepresentatives />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BoothHealthScore boothId={voter?.eci?.booth_id || 142} />
                <CampaignPromises />
            </div>
            <QuickActions />
            <UpcomingEvents />
        </div>
    );
}
