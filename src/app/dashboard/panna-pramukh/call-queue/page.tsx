"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Icon({ name, className = "", size, style }: { name: string; className?: string; size?: number; style?: React.CSSProperties }) {
    return <span className={`material-symbols-outlined ${className}`} style={{ ...(size ? { fontSize: size } : {}), ...style }}>{name}</span>;
}

function NavItem({ icon, label, active, href }: { icon: string; label: string; active?: boolean; href?: string }) {
    const router = useRouter();
    return (
        <button onClick={() => href && router.push(href)} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-[11px] font-medium transition-all ${active ? "bg-[rgba(201,168,76,0.12)] text-[#c9a84c]" : "text-[#f0ece3]/40 hover:text-[#f0ece3]/70 hover:bg-white/[0.03]"}`}>
            <Icon name={icon} size={16} /><span>{label}</span>
        </button>
    );
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
    MEDIUM: { border: "border-l-[#c9a84c]", badge: "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30" },
    LOW: { border: "border-l-white/20", badge: "bg-white/5 text-white/40 border-white/10" },
};

export default function CallQueuePage() {
    const [autoDial, setAutoDial] = useState(false);
    const [callStats] = useState({ total: 18, answered: 14, voicemail: 3, noAnswer: 1 });
    const [outcome, setOutcome] = useState("");

    return (
        <div className="flex h-screen bg-[#08090f] text-[#f0ece3] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-56 bg-[#111520] border-r border-[rgba(201,168,76,0.08)] flex flex-col shrink-0">
                <div className="p-4 border-b border-[rgba(201,168,76,0.08)]">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded bg-[#4ade80]/20 flex items-center justify-center"><Icon name="contacts" size={14} className="text-[#4ade80]" /></div>
                        <span className="font-serif text-sm font-bold tracking-wide">PANNA PRAMUKH</span>
                    </div>
                    <p className="text-[9px] text-white/25 font-mono tracking-widest ml-9">FIELD WORKER</p>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 px-3">My Pages</p>
                    <NavItem icon="dashboard" label="Overview" href="/dashboard/panna-pramukh" />
                    <NavItem icon="list_alt" label="Voter List" href="/dashboard/panna-pramukh/voter-list" />
                    <NavItem icon="phone_in_talk" label="Call Queue" active href="/dashboard/panna-pramukh/call-queue" />
                    <p className="text-[8px] font-mono text-white/20 tracking-[3px] uppercase mb-2 mt-4 px-3">Actions</p>
                    <NavItem icon="edit_note" label="Log Contact" href="/dashboard/panna-pramukh/log-contact" />
                    <NavItem icon="report_problem" label="Record Issue" />
                    <NavItem icon="share" label="Share Scheme" />
                </nav>
                <div className="p-4 border-t border-[rgba(201,168,76,0.08)]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-[#4ade80] bg-[#111520] flex items-center justify-center text-[10px] font-bold">RS</div>
                        <div><p className="text-[11px] font-bold">Ramesh Sharma</p><p className="text-[9px] text-white/30 font-mono">Pages 1-5 · Booth 142</p></div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 bg-[#08090f]/90 backdrop-blur-md border-b border-[rgba(201,168,76,0.08)] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-lg font-bold">Call Queue</h1>
                        <span className="text-[9px] font-mono bg-[#c9a84c]/10 text-[#c9a84c] px-2 py-0.5 rounded border border-[#c9a84c]/20">{queue.length} pending calls</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/40">Auto-Dial</span>
                        <button onClick={() => setAutoDial(!autoDial)} className={`relative w-10 h-5 rounded-full transition-colors ${autoDial ? "bg-[#4ade80]" : "bg-white/10"}`}>
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
                                <div key={item.id} className={`bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] border-l-[3px] ${style.border} p-4`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm">{item.name}</span>
                                                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${style.badge}`}>{item.priority}</span>
                                            </div>
                                            <p className="text-[10px] font-mono text-white/30">{item.epic} · {item.phone}</p>
                                        </div>
                                        <span className="text-[9px] text-white/25 font-mono">{item.duration}</span>
                                    </div>
                                    <p className="text-[11px] text-white/50 mb-1"><span className="text-[#c9a84c]">{item.reason}</span> · {item.details}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <button className="flex items-center gap-1.5 bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20 px-3 py-1.5 rounded text-[11px] font-bold hover:bg-[#4ade80]/20 transition-colors">
                                            <Icon name="call" size={14} /> Call Now
                                        </button>
                                        <button className="flex items-center gap-1.5 bg-white/5 text-white/40 border border-white/10 px-3 py-1.5 rounded text-[11px] hover:bg-white/10 transition-colors">Skip</button>
                                        <button className="text-[10px] text-white/25 hover:text-white/50 ml-2">Defer to Tomorrow →</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 space-y-4">
                        {/* Call Script */}
                        <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                            <h3 className="text-[11px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Call Script Template</h3>
                            <div className="space-y-3 text-[11px]">
                                <div>
                                    <p className="text-white/40 mb-1 font-bold">Opening Lines</p>
                                    <p className="text-white/60 italic">&quot;Namaste, I am calling from Booth #142...&quot;</p>
                                    <p className="text-white/60 italic">&quot;Is this a good time to speak for 2 minutes?&quot;</p>
                                </div>
                                <div>
                                    <p className="text-white/40 mb-1 font-bold">Key Talking Points</p>
                                    <ul className="text-white/50 space-y-1 list-disc list-inside">
                                        <li>Check recent scheme utility</li>
                                        <li>Confirm voter ID details</li>
                                        <li>Address pending issues</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-white/40 mb-1 font-bold">Scheme Highlights</p>
                                    <ul className="text-[#4ade80]/70 space-y-1 list-disc list-inside">
                                        <li>Jal Jeevan Mission</li>
                                        <li>PM Kisan Samman Nidhi</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                            <h3 className="text-[11px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Today&apos;s Call Stats</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center"><p className="font-serif text-xl font-bold text-[#4ade80]">{callStats.answered}</p><p className="text-[9px] text-white/30">Answered</p></div>
                                <div className="text-center"><p className="font-serif text-xl font-bold text-[#c9a84c]">{callStats.voicemail}</p><p className="text-[9px] text-white/30">Voicemail</p></div>
                                <div className="text-center"><p className="font-serif text-xl font-bold text-red-400">{callStats.noAnswer}</p><p className="text-[9px] text-white/30">No Answer</p></div>
                                <div className="text-center"><p className="font-serif text-xl font-bold">{callStats.total}</p><p className="text-[9px] text-white/30">Total</p></div>
                            </div>
                        </div>

                        {/* Quick Outcome */}
                        <div className="bg-[#111520] rounded border border-[rgba(201,168,76,0.08)] p-4">
                            <h3 className="text-[11px] font-mono text-[#c9a84c] tracking-wider uppercase mb-3">Quick Outcome</h3>
                            <textarea value={outcome} onChange={e => setOutcome(e.target.value)} placeholder="Log call result..." rows={3} className="w-full bg-white/5 border border-white/10 rounded p-2 text-[11px] resize-none outline-none focus:border-[#c9a84c]/30" />
                            <button className="w-full mt-2 bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 rounded py-1.5 text-[11px] font-bold hover:bg-[#c9a84c]/20">Save Outcome</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
