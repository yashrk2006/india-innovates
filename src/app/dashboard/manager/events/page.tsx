"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManagerPageLayout, { MgrCard, MgrSection, MgrKPI, MgrBar } from "@/components/manager/ManagerPageLayout";
import { useApi } from "@/lib/hooks";
import { useToast } from "@/components/ui/Toast";

function Icon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size }}>{name}</span>;
}

const events = [
    { id: "E-014", title: "Constituency Rally – Lucknow West", type: "RALLY", date: "Feb 22", time: "4:00 PM", venue: "Ram Lila Ground, Aminabad", expected: 15000, confirmed: 8400, workers: 45, transport: 12, stage: true, sound: true, permissions: true, security: true, status: "CONFIRMED", ward: "Ward 12" },
    { id: "E-013", title: "Nukkad Sabha – Chowk Bazaar", type: "NUKKAD", date: "Feb 22", time: "11:00 AM", venue: "Near Chowk Metro Station", expected: 500, confirmed: 280, workers: 8, transport: 0, stage: false, sound: true, permissions: true, security: false, status: "CONFIRMED", ward: "Ward 14" },
    { id: "E-012", title: "Door-to-Door Padyatra", type: "PADYATRA", date: "Feb 22", time: "8:00 AM", venue: "Ward 19 - Full Coverage", expected: 200, confirmed: 120, workers: 25, transport: 2, stage: false, sound: false, permissions: false, security: true, status: "PLANNED", ward: "Ward 19" },
    { id: "E-011", title: "Women's Self-Help Group Meet", type: "MEETING", date: "Feb 23", time: "3:00 PM", venue: "Community Hall, Gomtinagar", expected: 300, confirmed: 180, workers: 6, transport: 3, stage: true, sound: true, permissions: true, security: false, status: "PLANNED", ward: "Ward 20" },
    { id: "E-010", title: "Youth Employment Workshop", type: "CAMP", date: "Feb 23", time: "10:00 AM", venue: "ITI Campus, Aliganj", expected: 400, confirmed: 0, workers: 12, transport: 4, stage: true, sound: true, permissions: false, security: false, status: "PENDING APPROVAL", ward: "Ward 18" },
    { id: "E-009", title: "Senior Citizen Outreach", type: "CAMP", date: "Feb 24", time: "9:00 AM", venue: "Panchayat Bhawan, Daliganj", expected: 200, confirmed: 0, workers: 8, transport: 2, stage: false, sound: true, permissions: false, security: false, status: "DRAFT", ward: "Ward 16" },
];

const typeColor: Record<string, string> = { RALLY: "#f87171", NUKKAD: "#fbbf24", PADYATRA: "#4ade80", MEETING: "#818cf8", CAMP: "#60a5fa" };
const statusColor: Record<string, string> = { CONFIRMED: "#4ade80", PLANNED: "#60a5fa", "PENDING APPROVAL": "#fbbf24", DRAFT: "#6b7280" };

export default function EventsPage() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // ── Live data from backend ──
    const { data: campaigns } = useApi<any[]>("/api/campaigns", []);
    const { toast } = useToast();

    const handleCreateEvent = async () => {
        try {
            const res = await fetch("/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "New Campaign Event", channel: "field", message: "New event created from dashboard" }),
            });
            if (res.ok) toast("New event created successfully!", "success");
            else toast("Failed to create event", "error");
        } catch { toast("Network error", "error"); }
    };

    return (
        <ManagerPageLayout title="Events & Rallies" badge="📅 CAMPAIGN" badgeColor="#e8761a">
            <div className="grid grid-cols-5 gap-3">
                <MgrKPI icon="event" label="Total Events" value={String(events.length)} sub="This week" color="#e8761a" delay={0} />
                <MgrKPI icon="check_circle" label="Confirmed" value={String(events.filter(e => e.status === "CONFIRMED").length)} sub="Ready" color="#4ade80" delay={0.05} />
                <MgrKPI icon="groups" label="Expected Reach" value="16.6K" sub="All events" color="#c9a84c" delay={0.1} />
                <MgrKPI icon="directions_bus" label="Transport" value="23" sub="Vehicles arranged" color="#60a5fa" delay={0.15} />
                <MgrKPI icon="person" label="Campaigns" value={campaigns.length > 0 ? String(campaigns.length) : "104"} sub={campaigns.length > 0 ? "In system" : "Workers assigned"} color="#818cf8" delay={0.2} />
            </div>

            <div className="space-y-3">
                {events.map((e, i) => (
                    <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="bg-[#111520] rounded-xl border border-white/[0.06] overflow-hidden hover:border-white/[0.1] transition-all cursor-pointer"
                        onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}>
                        <div className="flex items-stretch">
                            <div className="w-1.5 shrink-0" style={{ background: typeColor[e.type] }} />
                            <div className="flex-1 p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className="text-[13px] text-white/85 font-semibold">{e.title}</h4>
                                            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded" style={{ color: typeColor[e.type], background: typeColor[e.type] + "15" }}>{e.type}</span>
                                        </div>
                                        <div className="flex gap-3 text-[9px] text-white/30">
                                            <span>📅 {e.date}, {e.time}</span><span>📍 {e.venue}</span><span>🏘 {e.ward}</span>
                                        </div>
                                    </div>
                                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{ color: statusColor[e.status], background: statusColor[e.status] + "12" }}>{e.status}</span>
                                </div>
                                <div className="flex gap-4 text-[9px] text-white/30 mt-1">
                                    <span>👥 Expected: <span className="text-white/60 font-mono">{e.expected.toLocaleString()}</span></span>
                                    <span>✅ Confirmed: <span className="text-[#c9a84c] font-mono">{e.confirmed.toLocaleString()}</span></span>
                                    <span>🧑‍💼 Workers: <span className="text-white/60 font-mono">{e.workers}</span></span>
                                    <span>🚌 Transport: <span className="text-white/60 font-mono">{e.transport}</span></span>
                                </div>
                            </div>
                        </div>
                        <AnimatePresence>
                            {expandedId === e.id && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="border-t border-white/[0.04] px-5 py-4 bg-white/[0.01]">
                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                                <span className="text-[8px] text-white/20 block">Mobilization Progress</span>
                                                <div className="flex items-center gap-2 mt-1"><MgrBar pct={Math.round(e.confirmed / e.expected * 100)} color="#c9a84c" h={5} /><span className="text-[10px] font-mono text-[#c9a84c]">{Math.round(e.confirmed / e.expected * 100)}%</span></div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                                <span className="text-[8px] text-white/20 block">Worker Assignment</span>
                                                <span className="text-[16px] font-bold text-white/70">{e.workers}</span><span className="text-[9px] text-white/25"> assigned</span>
                                            </div>
                                            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                                <span className="text-[8px] text-white/20 block">Transport</span>
                                                <span className="text-[16px] font-bold text-white/70">{e.transport}</span><span className="text-[9px] text-white/25"> vehicles</span>
                                            </div>
                                        </div>
                                        <div className="text-[8px] font-mono text-white/20 uppercase mb-2">Logistics Checklist</div>
                                        <div className="grid grid-cols-4 gap-1.5 mb-3">
                                            {[{ l: "Stage", ok: e.stage }, { l: "Sound System", ok: e.sound }, { l: "Permissions", ok: e.permissions }, { l: "Security", ok: e.security }].map(f => (
                                                <div key={f.l} className={`text-[9px] px-2 py-1.5 rounded text-center ${f.ok ? "bg-green-500/10 text-green-400 border border-green-500/15" : "bg-red-500/10 text-red-400 border border-red-500/15"}`}>
                                                    {f.ok ? "✓" : "✗"} {f.l}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => toast(`Editing event ${e.id}...`, "info")} className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-[#c9a84c]/12 text-[#c9a84c] border border-[#c9a84c]/25">EDIT EVENT</button>
                                            <button onClick={async () => {
                                                try {
                                                    const res = await fetch("/api/workers/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: `Event duty: ${e.title}`, description: `Assigned for event ${e.id}`, priority: "medium" }) });
                                                    if (res.ok) toast(`Workers assigned to ${e.id}`, "success"); else toast("Failed", "error");
                                                } catch { toast("Error", "error"); }
                                            }} className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-white/5 text-white/40 border border-white/10">ASSIGN WORKERS</button>
                                            <button onClick={async () => {
                                                try {
                                                    const res = await fetch("/api/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: `Invites: ${e.title}`, channel: "sms", message: `You are invited to ${e.title} on ${e.date} at ${e.venue}` }) });
                                                    if (res.ok) toast(`Invites sent for ${e.title}`, "success"); else toast("Failed", "error");
                                                } catch { toast("Error", "error"); }
                                            }} className="text-[9px] font-mono px-3 py-1.5 rounded-lg bg-white/5 text-white/40 border border-white/10">SEND INVITES</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}

                <button onClick={handleCreateEvent} className="w-full text-[10px] font-mono py-3 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 hover:bg-[#c9a84c]/20 transition-all flex items-center justify-center gap-1.5 mt-2">
                    <Icon name="add" size={14} /> CREATE NEW EVENT
                </button>
            </div>
        </ManagerPageLayout>
    );
}
