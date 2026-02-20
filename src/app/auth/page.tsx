"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/* ─── Icon helper ─── */
function Icon({ name, className = "", size }: { name: string; className?: string; size?: number }) {
    return (
        <span className={`material-symbols-outlined ${className}`} style={size ? { fontSize: size } : undefined}>
            {name}
        </span>
    );
}

/* ─── Role data ─── */
const roles = [
    {
        id: "super-admin",
        icon: "admin_panel_settings",
        title: "Super Admin",
        desc: "System Configuration & Oversight",
        scope: "National",
        accent: "bg-accent-red/10 text-accent-red",
        bar: "bg-accent-red",
    },
    {
        id: "party-command",
        icon: "flag",
        title: "Party Command",
        desc: "Strategy & Resource Allocation",
        scope: "State",
        accent: "bg-accent-saffron/10 text-accent-saffron",
        bar: "bg-accent-saffron",
    },
    {
        id: "manager",
        icon: "campaign",
        title: "Manager",
        desc: "Execution & Monitoring",
        scope: "District",
        accent: "bg-blue-500/10 text-blue-500",
        bar: "bg-blue-500",
    },
    {
        id: "citizen",
        icon: "how_to_vote",
        title: "Citizen",
        desc: "Public Interface & Feedback",
        scope: "Constituency",
        accent: "bg-primary/10 text-primary",
        bar: "bg-primary",
    },
    {
        id: "booth-adhyaksh",
        icon: "groups",
        title: "Booth Adhyaksh",
        desc: "Ground Zero Management",
        scope: "Booth",
        accent: "bg-accent-green/10 text-accent-green",
        bar: "bg-accent-green",
    },
    {
        id: "panna-pramukh",
        icon: "menu_book",
        title: "Panna Pramukh",
        desc: "Voter Outreach",
        scope: "Page",
        accent: "bg-purple-500/10 text-purple-500",
        bar: "bg-purple-500",
    },
    {
        id: "data-analyst",
        icon: "analytics",
        title: "Data Analyst",
        desc: "Trends & Forecasting",
        scope: "Intelligence",
        accent: "bg-cyan-500/10 text-cyan-500",
        bar: "bg-cyan-500",
    },
    {
        id: "eci-observer",
        icon: "visibility",
        title: "ECI Observer",
        desc: "Regulatory Oversight",
        scope: "Compliance",
        accent: "bg-white/10 text-white",
        bar: "bg-white",
    },
];

/* ─── Stagger variants ─── */
const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};
const cardVariant = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

/* ══════════════════════════════════════════════════════════
   AUTH GATEWAY – Role Selection
   ══════════════════════════════════════════════════════════ */
export default function AuthGateway() {
    const router = useRouter();

    const handleRoleSelect = (roleId: string) => {
        router.push(`/auth/login?role=${roleId}`);
    };

    return (
        <div className="bg-charcoal-light font-display antialiased h-screen overflow-hidden flex flex-col md:flex-row">
            {/* ─── Left Panel: Branding ─── */}
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" as const }}
                className="hidden md:flex flex-col w-full md:w-[40%] bg-charcoal-dark relative overflow-hidden border-r border-white/5"
            >
                {/* Dot pattern */}
                <div
                    className="absolute inset-0 opacity-30 z-0"
                    style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,167,74,0.12) 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-charcoal-dark to-transparent z-10" />

                {/* Content */}
                <div className="relative z-20 flex flex-col h-full p-12 justify-between">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-charcoal-dark">
                            <Icon name="how_to_vote" size={28} />
                        </div>
                        <h1 className="text-white text-2xl font-bold tracking-tight">
                            Booth<span className="text-primary">IQ</span>
                        </h1>
                    </motion.div>

                    {/* Quote */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="my-auto"
                    >
                        <div className="w-12 h-1 bg-primary mb-8" />
                        <h2 className="text-white font-serif italic text-4xl lg:text-5xl leading-tight opacity-90">
                            &ldquo;Democracy is the government of the people, by the people, for the people.&rdquo;
                        </h2>
                        <p className="mt-6 text-white/50 font-mono text-sm uppercase tracking-widest">— Abraham Lincoln</p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="flex flex-col gap-8"
                    >
                        <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                            {[
                                { value: "1.2M+", label: "Booths" },
                                { value: "950M+", label: "Voters" },
                                { value: "500+", label: "Schemes" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 + i * 0.15, duration: 0.5 }}
                                >
                                    <p className="text-primary font-bold text-2xl lg:text-3xl font-mono">{stat.value}</p>
                                    <p className="text-white/60 text-sm mt-1">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Security badge */}
                        <div className="flex items-center justify-center gap-2 text-white/40 text-xs font-mono bg-white/5 py-3 rounded-lg border border-white/5">
                            <Icon name="lock" size={16} />
                            <span>Secured by Aadhaar Integration</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* ─── Right Panel: Role Selection ─── */}
            <div className="flex-1 bg-charcoal-light relative flex flex-col h-full overflow-y-auto w-full md:w-[60%]">
                {/* Mobile header */}
                <div className="md:hidden p-6 bg-charcoal-dark border-b border-white/5 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-charcoal-dark">
                            <Icon name="how_to_vote" size={20} />
                        </div>
                        <h1 className="text-white text-xl font-bold">
                            Booth<span className="text-primary">IQ</span>
                        </h1>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="w-full mb-10 text-center md:text-left"
                    >
                        <h3 className="text-primary font-mono text-xs tracking-[0.2em] mb-2 uppercase">
                            Authentication Gateway
                        </h3>
                        <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight inline-block relative pb-2">
                            Select Your Role To Continue
                            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
                        </h1>
                    </motion.div>

                    {/* Role Grid */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
                    >
                        {roles.map((role) => (
                            <motion.button
                                key={role.id}
                                variants={cardVariant}
                                whileHover={{
                                    scale: 1.04,
                                    y: -6,
                                    transition: { duration: 0.25 },
                                }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleRoleSelect(role.id)}
                                className="group text-left relative h-48 w-full focus:outline-none"
                            >
                                <div className="absolute inset-0 w-full h-full bg-[#1c1c24] border border-white/10 rounded-xl p-5 flex flex-col justify-between group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]">
                                    <div className="flex justify-between items-start">
                                        <div className={`p-2 rounded-lg ${role.accent}`}>
                                            <Icon name={role.icon} />
                                        </div>
                                        <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded">
                                            {role.scope}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-serif text-xl mb-1 group-hover:text-primary transition-colors duration-300">
                                            {role.title}
                                        </h4>
                                        <p className="text-white/50 text-xs">{role.desc}</p>
                                    </div>
                                    {/* Top color bar */}
                                    <div
                                        className={`absolute top-0 left-0 w-full h-1 ${role.bar} rounded-t-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                                    />
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Footer links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-12 w-full flex justify-between items-center border-t border-white/5 pt-6 text-sm"
                    >
                        <Link
                            href="#"
                            className="text-white/40 hover:text-primary transition-colors duration-300 flex items-center gap-2"
                        >
                            <Icon name="help" className="text-sm" /> Need Assistance?
                        </Link>
                        <Link href="#" className="text-white/40 hover:text-primary transition-colors duration-300">
                            Privacy Policy
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
