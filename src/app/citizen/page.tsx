"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/services";

const quickActions = [
    { label: "Lodge Grievance", icon: "report_problem", href: "/citizen/grievance", color: "bg-red-50 text-red-600 border-red-100" },
    { label: "My Schemes", icon: "description", href: "/citizen/schemes", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Verify Identity", icon: "fingerprint", href: "/citizen/verify", color: "bg-purple-50 text-purple-600 border-purple-100" },
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

function QuickStats() {
    const [stats, setStats] = useState({ activeGrievances: 0, activeSchemes: 0, totalUpdates: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats().then(data => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    const statItems = [
        { value: "142", label: "Booth No.", icon: "how_to_vote", color: "text-green-600 bg-green-50" },
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

function BoothHealthScore() {
    const bars = [
        { label: "Voter Turnout", value: 78 },
        { label: "Scheme Enrollment", value: 65 },
        { label: "Issue Resolution", value: 90 },
        { label: "Digital Literacy", value: 55 },
    ];

    return (
        <div className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm animate-fade-up stagger-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-slate-900">Booth Health</h3>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Good</span>
            </div>
            <div className="space-y-3">
                {bars.map(b => (
                    <div key={b.label}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-stone-500">{b.label}</span>
                            <span className="text-slate-900">{b.value}%</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full animate-fill-bar"
                                style={{ width: `${b.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function CitizenHomePage() {
    return (
        <div className="p-5 md:p-0 space-y-6">
            <ElectionCountdown />
            <QuickStats />
            <QuickActions />
            <UpcomingEvents />
            <BoothHealthScore />
        </div>
    );
}
