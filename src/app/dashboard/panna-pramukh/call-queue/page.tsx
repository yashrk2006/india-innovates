"use client";
import { useState } from "react";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}



const queue = [
    { id: 1, name: "Suresh Kumar", epic: "UTR/05/142/1201", phone: "98XXX-XX234", reason: "Issue Follow-up", priority: "HIGH", duration: "~3 min", details: "Complained about water supply last week" },
    { id: 2, name: "Anita Devi", epic: "UTR/05/142/0834", phone: "91XXX-XX891", reason: "New Contact", priority: "HIGH", duration: "~5 min", details: "First-time voter, needs scheme info" },
    { id: 3, name: "Rajesh Meena", epic: "UTR/05/142/1567", phone: "70XXX-XX456", reason: "Scheme Update", priority: "MEDIUM", duration: "~2 min", details: "Eligible for PM Kisan, needs to be informed" },
    { id: 4, name: "Kavita Rani", epic: "UTR/05/142/0923", phone: "88XXX-XX127", reason: "Follow-up", priority: "MEDIUM", duration: "~3 min", details: "Was positive last visit, confirm support" },
    { id: 5, name: "Mohan Lal", epic: "UTR/05/142/1789", phone: "99XXX-XX890", reason: "New Contact", priority: "LOW", duration: "~5 min", details: "Senior voter, door visit preferred" },
    { id: 6, name: "Deepak Tiwari", epic: "UTR/05/142/0456", phone: "93XXX-XX678", reason: "Verification", priority: "LOW", duration: "~2 min", details: "Update address and phone number" },
];

const priorityStyle: Record<string, { border: string; badge: string }> = {
    HIGH: { border: "border-l-red-400", badge: "bg-red-400/10 text-red-400 border-red-400/30" },
    MEDIUM: { border: "border-l-[#1e293b]", badge: "bg-[#1e293b]/10 text-[#1e293b] border-[#1e293b]/30" },
    LOW: { border: "border-l-white/20", badge: "bg-white/5 text-slate-500 border-slate-200" },
};

export default function CallQueuePage() {
    const [autoDial, setAutoDial] = useState(false);
    const [callStats] = useState({ total: 18, answered: 14, voicemail: 3, noAnswer: 1 });
    const [outcome, setOutcome] = useState("");

    return (
        <>
                <header className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-lg font-bold">Call Queue</h1>
                        <span className="text-[9px] font-mono bg-[#1e293b]/10 text-[#1e293b] px-2 py-0.5 rounded border border-[#1e293b]/20">{queue.length} pending calls</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500">Auto-Dial</span>
                        <button onClick={() => setAutoDial(!autoDial)} className={`relative w-10 h-5 rounded-full transition-colors ${autoDial ? "bg-[#10b981]" : "bg-white/10"}`}>
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${autoDial ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                    </div>
                </header>

                <div className="p-6 flex gap-6">
                    {/* Queue List */}
                    <div className="flex-[2] space-y-3">
                        {queue.map(item => {
                            const style = priorityStyle[item.priority];
                            return (
                                <div key={item.id} className={`bg-white shadow-sm rounded border border-slate-200 border-l-[3px] ${style.border} p-4`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm">{item.name}</span>
                                                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${style.badge}`}>{item.priority}</span>
                                            </div>
                                            <p className="text-[10px] font-mono text-slate-500">{item.epic} · {item.phone}</p>
                                        </div>
                                        <span className="text-[9px] text-slate-400 font-mono">{item.duration}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mb-1"><span className="text-[#1e293b]">{item.reason}</span> · {item.details}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <button className="flex items-center gap-1.5 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 px-3 py-1.5 rounded text-[11px] font-bold hover:bg-[#10b981]/20 transition-colors">
                                            <Icon name="call" size={14} /> Call Now
                                        </button>
                                        <button className="flex items-center gap-1.5 bg-white/5 text-slate-500 border border-slate-200 px-3 py-1.5 rounded text-[11px] hover:bg-white/10 transition-colors">Skip</button>
                                        <button className="text-[10px] text-slate-400 hover:text-slate-500 ml-2">Defer to Tomorrow →</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 space-y-4">
                        {/* Call Script */}
                        <div className="bg-white shadow-sm rounded border border-slate-200 p-4">
                            <h3 className="text-[11px] font-mono text-[#1e293b] tracking-wider uppercase mb-3">Call Script Template</h3>
                            <div className="space-y-3 text-[11px]">
                                <div>
                                    <p className="text-slate-500 mb-1 font-bold">Opening Lines</p>
                                    <p className="text-slate-600 italic">&quot;Namaste, I am calling from Booth #142...&quot;</p>
                                    <p className="text-slate-600 italic">&quot;Is this a good time to speak for 2 minutes?&quot;</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 mb-1 font-bold">Key Talking Points</p>
                                    <ul className="text-slate-500 space-y-1 list-disc list-inside">
                                        <li>Check recent scheme utility</li>
                                        <li>Confirm voter ID details</li>
                                        <li>Address pending issues</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-slate-500 mb-1 font-bold">Scheme Highlights</p>
                                    <ul className="text-[#10b981]/70 space-y-1 list-disc list-inside">
                                        <li>Jal Jeevan Mission</li>
                                        <li>PM Kisan Samman Nidhi</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-white shadow-sm rounded border border-slate-200 p-4">
                            <h3 className="text-[11px] font-mono text-[#1e293b] tracking-wider uppercase mb-3">Today&apos;s Call Stats</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center"><p className="font-serif text-xl font-bold text-[#10b981]">{callStats.answered}</p><p className="text-[9px] text-slate-500">Answered</p></div>
                                <div className="text-center"><p className="font-serif text-xl font-bold text-[#1e293b]">{callStats.voicemail}</p><p className="text-[9px] text-slate-500">Voicemail</p></div>
                                <div className="text-center"><p className="font-serif text-xl font-bold text-red-400">{callStats.noAnswer}</p><p className="text-[9px] text-slate-500">No Answer</p></div>
                                <div className="text-center"><p className="font-serif text-xl font-bold">{callStats.total}</p><p className="text-[9px] text-slate-500">Total</p></div>
                            </div>
                        </div>

                        {/* Quick Outcome */}
                        <div className="bg-white shadow-sm rounded border border-slate-200 p-4">
                            <h3 className="text-[11px] font-mono text-[#1e293b] tracking-wider uppercase mb-3">Quick Outcome</h3>
                            <textarea value={outcome} onChange={e => setOutcome(e.target.value)} placeholder="Log call result..." rows={3} className="w-full bg-white/5 border border-slate-200 rounded p-2 text-[11px] resize-none outline-none focus:border-[#1e293b]/30" />
                            <button className="w-full mt-2 bg-[#1e293b]/10 text-[#1e293b] border border-[#1e293b]/20 rounded py-1.5 text-[11px] font-bold hover:bg-[#1e293b]/20">Save Outcome</button>
                        </div>
                    </div>
                </div>
        </>
    );
}
