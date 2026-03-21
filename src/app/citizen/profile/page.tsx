"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVoterProfile } from "@/lib/services";
import type { Voter } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import VoterCard from "@/components/citizen/VoterCard";
import { useLanguage } from "@/components/citizen/LanguageContext";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

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
    const [activeTab, setActiveTab] = useState<"details" | "history" | "settings" | "id">("details");
    const [voter, setVoter] = useState<Voter | null>(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const [settings, setSettings] = useState({
        notifications: true, sms: true, dataSharing: false,
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
                    {(["details", "id", "history", "settings"] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-bold capitalize transition-colors ${activeTab === tab ? "text-primary border-b-2 border-primary bg-primary/5" : "text-stone-500 hover:text-slate-700"}`}
                        >
                            {tab === "details" ? t("personal_tab") : tab === "id" ? t("digital_id_tab") : tab === "history" ? t("history_tab") : t("settings_tab")}
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
                            <div className="text-center py-10 px-4">
                                <div className="size-16 rounded-full bg-stone-50 flex items-center justify-center mx-auto mb-4 text-stone-300">
                                    <span className="material-symbols-outlined text-4xl">person_off</span>
                                </div>
                                <p className="text-stone-500 font-medium">No voter profile data found.</p>
                                <p className="text-stone-400 text-sm mt-1">Please ensure your EPIC number is linked to your account.</p>
                            </div>
                        )
                    )}

                    {activeTab === "id" && (
                        <div className="space-y-6">
                            <div className="relative group">
                                <VoterCard />
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="bg-white px-4 py-2 rounded-lg font-bold text-primary shadow-xl scale-90 group-hover:scale-100 transition-transform">
                                        {t("authorized_view")}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => toast.success("Secure Digital ID Downloaded")}
                                    className="flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-white hover:border-primary/20 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">download</span>
                                    <span className="text-xs font-bold text-slate-900">{t("download_pdf")}</span>
                                </button>
                                <button 
                                    onClick={() => toast.success("QR Code Generated for Booth Scanning")}
                                    className="flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-white hover:border-primary/20 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">qr_code_2</span>
                                    <span className="text-xs font-bold text-slate-900">{t("show_qr_code")}</span>
                                </button>
                            </div>

                            {/* DigiLocker Simulation */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined">cloud_sync</span>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-sm tracking-tight text-white">Government Sync</h5>
                                            <p className="text-[10px] text-blue-200">Official Document Integration</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 bg-white/20 rounded text-[9px] font-bold uppercase tracking-widest border border-white/20">Secure</span>
                                </div>
                                <p className="text-xs text-blue-100 leading-relaxed mb-6">
                                    Securely sync your election documents from national repositories like DigiLocker and UMANG.
                                </p>
                                <button 
                                    onClick={async () => {
                                        const id = toast.loading("Connecting to DigiLocker...");
                                        await new Promise(r => setTimeout(r, 2000));
                                        toast.success("Documents Synced Successfully", { id });
                                    }}
                                    className="w-full py-3 bg-white text-blue-700 rounded-xl font-bold text-xs hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">sync</span>
                                    {t("fetch_from_gov")}
                                </button>
                            </div>

                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-xl">info</span>
                                    <p className="text-xs text-stone-600 leading-relaxed">
                                        {t("e_epic_desc")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "history" && (
                        <div className="space-y-4">
                            {votingHistory.map((h, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">{h.election}</p>
                                        <p className="text-xs text-stone-500">{h.booth} • {h.date}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${h.voted ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                        {h.voted ? t("vote_cast") : t("not_voted")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">{t("push_notifications")}</p>
                                        <p className="text-xs text-stone-500">{t("push_notifications_desc")}</p>
                                    </div>
                                    <button 
                                        onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.notifications ? "bg-primary" : "bg-stone-300"}`}
                                    >
                                        <div className={`size-4 bg-white rounded-full transition-transform ${settings.notifications ? "translate-x-6" : "translate-x-0"}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">{t("data_sharing")}</p>
                                        <p className="text-xs text-stone-500">{t("data_sharing_desc")}</p>
                                    </div>
                                    <button 
                                        onClick={() => setSettings(prev => ({ ...prev, dataSharing: !prev.dataSharing }))}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.dataSharing ? "bg-primary" : "bg-stone-300"}`}
                                    >
                                        <div className={`size-4 bg-white rounded-full transition-transform ${settings.dataSharing ? "translate-x-6" : "translate-x-0"}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">{t("hindi_interface")}</p>
                                        <p className="text-xs text-stone-500">{t("hindi_interface_desc")}</p>
                                    </div>
                                    <button 
                                        className="size-10 rounded-full bg-white border-2 border-primary flex items-center justify-center text-primary font-bold"
                                    >
                                        हिं
                                    </button>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                {t("sign_out")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function genderLabelTranslate(g: string | null, t: any) {
    if (g === "M") return t("male") || "Male";
    if (g === "F") return t("female") || "Female";
    if (g === "O") return t("other") || "Other";
    return "—";
}
