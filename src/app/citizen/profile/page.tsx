"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVoterProfile } from "@/lib/services";
import type { Voter } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import VoterCard from "@/components/citizen/VoterCard";

const badges = [
    { name: "Verified Voter", icon: "verified", earned: true, color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
    { name: "Voice of People", icon: "campaign", earned: true, color: "bg-blue-100 text-blue-600 border-blue-200" },
    { name: "Community Leader", icon: "groups", earned: false, color: "bg-stone-100 text-stone-400 border-stone-200" },
    { name: "Scheme Champion", icon: "workspace_premium", earned: true, color: "bg-green-100 text-green-600 border-green-200" },
    { name: "Digital Pioneer", icon: "devices", earned: false, color: "bg-stone-100 text-stone-400 border-stone-200" },
];

const votingHistory = [
    { election: "UP Assembly 2022", booth: "Booth #142", voted: true, date: "Feb 14, 2022" },
    { election: "Lok Sabha 2024", booth: "Booth #142", voted: true, date: "Apr 19, 2024" },
    { election: "Local Body 2025", booth: "Booth #138", voted: false, date: "Nov 15, 2025" },
];

function genderLabel(g: string | null) {
    if (g === "M") return "Male";
    if (g === "F") return "Female";
    if (g === "O") return "Other";
    return "—";
}

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"details" | "history" | "settings">("details");
    const [voter, setVoter] = useState<Voter | null>(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        notifications: true, sms: true, language: false, dataSharing: false,
    });

    useEffect(() => {
        getVoterProfile().then(data => {
            setVoter(data);
            setLoading(false);
        });
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        document.cookie = "citizen_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push("/auth/login?role=citizen");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    // ECI data (personal info) is in voter.eci
    const eci = voter?.eci;
    const personalDetails = eci ? [
        { label: "Full Name", value: eci.name || "—", icon: "person" },
        { label: "EPIC Number", value: eci.epic_number || "—", icon: "badge" },
        { label: "Date of Birth", value: eci.dob ? new Date(eci.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—", icon: "cake" },
        { label: "Gender", value: genderLabel(eci.gender), icon: "wc" },
        { label: "Phone", value: eci.phone || "—", icon: "call" },
        { label: "Address", value: eci.address || "—", icon: "home" },
        { label: "Part No.", value: eci.eci_part_number || "—", icon: "location_city" },
        { label: "Serial No.", value: eci.serial_number ? String(eci.serial_number) : "—", icon: "tag" },
    ] : [];

    return (
        <div className="p-5 md:p-0 space-y-6">
            {/* Voter Card */}
            <div className="animate-fade-up">
                <VoterCard />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 animate-fade-up stagger-2">
                {[
                    { label: "Participation", value: `${voter?.is_key_voter ? "Key" : "Active"}`, icon: "bar_chart" },
                    { label: "Badges Earned", value: `${badges.filter(b => b.earned).length}/${badges.length}`, icon: "workspace_premium" },
                    { label: "Elections Voted", value: `${votingHistory.filter(v => v.voted).length}/${votingHistory.length}`, icon: "how_to_vote" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-stone-100 p-3 text-center shadow-sm">
                        <span className="material-symbols-outlined text-primary mb-1 block">{s.icon}</span>
                        <p className="font-bold text-lg text-slate-900">{s.value}</p>
                        <p className="text-xs text-stone-500">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm animate-fade-up stagger-3">
                <h3 className="font-display font-bold text-slate-900 mb-4">My Badges</h3>
                <div className="flex flex-wrap gap-3">
                    {badges.map(b => (
                        <div
                            key={b.name}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-bold transition-all ${b.earned ? b.color : "bg-stone-50 text-stone-300 border-stone-100"}`}
                        >
                            <span className="material-symbols-outlined text-base">{b.icon}</span>
                            {b.name}
                            {!b.earned && <span className="text-[10px] font-normal">(Locked)</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden animate-fade-up stagger-4">
                <div className="flex border-b border-stone-100">
                    {(["details", "history", "settings"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-bold capitalize transition-colors ${activeTab === tab ? "text-primary border-b-2 border-primary bg-primary/5" : "text-stone-500 hover:text-slate-700"}`}
                        >
                            {tab === "details" ? "Personal" : tab === "history" ? "Voting History" : "Settings"}
                        </button>
                    ))}
                </div>

                <div className="p-5">
                    {activeTab === "details" && (
                        personalDetails.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {personalDetails.map(d => (
                                    <div key={d.label} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                                        <span className="material-symbols-outlined text-primary text-lg mt-0.5">{d.icon}</span>
                                        <div>
                                            <p className="text-xs text-stone-500 font-medium">{d.label}</p>
                                            <p className="font-bold text-sm text-slate-900 mt-0.5">{d.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-stone-400 py-6 text-sm">No voter data available yet.<br />Contact your booth officer.</p>
                        )
                    )}

                    {activeTab === "history" && (
                        <div className="space-y-3">
                            {votingHistory.map((h, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl">
                                    <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${h.voted ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                                        <span className="material-symbols-outlined">{h.voted ? "how_to_vote" : "close"}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-slate-900">{h.election}</p>
                                        <p className="text-xs text-stone-500">{h.booth} · {h.date}</p>
                                    </div>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${h.voted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                        {h.voted ? "Voted" : "Missed"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-4">
                            {[
                                { key: "notifications" as const, label: "Push Notifications", desc: "Receive alerts for scheme updates and grievance status" },
                                { key: "sms" as const, label: "SMS Alerts", desc: "Text notifications to your registered mobile number" },
                                { key: "language" as const, label: "Hindi Interface", desc: "Switch app language to Hindi" },
                                { key: "dataSharing" as const, label: "Data Sharing", desc: "Allow booth officers to view your participation data" },
                            ].map(s => (
                                <div key={s.key} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">{s.label}</p>
                                        <p className="text-xs text-stone-500 mt-0.5">{s.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => setSettings(prev => ({ ...prev, [s.key]: !prev[s.key] }))}
                                        className={`relative w-11 h-6 rounded-full transition-colors ${settings[s.key] ? "bg-primary" : "bg-stone-300"}`}
                                    >
                                        <span className={`absolute top-1 size-4 rounded-full bg-white shadow transition-transform ${settings[s.key] ? "translate-x-6" : "translate-x-1"}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sign Out */}
            <button
                onClick={handleLogout}
                className="w-full py-3 border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined">logout</span>
                Sign Out
            </button>
        </div>
    );
}
