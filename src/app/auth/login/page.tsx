"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

/* ──────────────────────────────────────────────────────────
   Icon helper – Material Symbols Outlined
   ────────────────────────────────────────────────────────── */
function Icon({
    name,
    className = "",
    size,
}: {
    name: string;
    className?: string;
    size?: number;
}) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={size ? { fontSize: size } : undefined}
        >
            {name}
        </span>
    );
}

// Role configuration
const roleConfig: Record<
    string,
    {
        label: string;
        subtitle: string;
        features: { icon: string; title: string; desc: string }[];
    }
> = {
    mp: {
        label: "Member of Parliament",
        subtitle: "Elected Representative Portal",
        features: [
            {
                icon: "analytics",
                title: "Real-time Sentiment",
                desc: "AI-driven analysis of constituency mood.",
            },
            {
                icon: "how_to_vote",
                title: "Predictive Analytics",
                desc: "Forecast voting trends with 89% accuracy.",
            },
            {
                icon: "lock_person",
                title: "Secure Comms",
                desc: "End-to-end encrypted channel to HQ.",
            },
        ],
    },
    manager: {
        label: "Campaign Manager",
        subtitle: "Strategic Command Center",
        features: [
            {
                icon: "map",
                title: "Booth Allocation",
                desc: "Optimize resource deployment across booths.",
            },
            {
                icon: "group",
                title: "Volunteer Tracking",
                desc: "Real-time monitoring of ground staff.",
            },
            {
                icon: "campaign",
                title: "Campaign Blast",
                desc: "One-click WhatsApp & SMS campaigns.",
            },
        ],
    },
    citizen: {
        label: "Citizen Portal",
        subtitle: "Grievance Redressal & Feedback",
        features: [
            {
                icon: "campaign",
                title: "Voice Your Concern",
                desc: "Directly report issues to your representative.",
            },
            {
                icon: "trending_up",
                title: "Track Progress",
                desc: "Real-time status updates on your complaints.",
            },
            {
                icon: "feedback",
                title: "Community Feedback",
                desc: "Participate in local surveys and polls.",
            },
        ],
    },
    // Default fallback
    default: {
        label: "BoothIQ Access",
        subtitle: "Secure Intelligence Portal",
        features: [
            {
                icon: "shield",
                title: "Bank-Grade Security",
                desc: "ISO 27001 certified data protection.",
            },
            {
                icon: "bolt",
                title: "Real-time Sync",
                desc: "Updates from the ground in milliseconds.",
            },
            {
                icon: "insights",
                title: "Actionable Insights",
                desc: "Convert data into winning strategies.",
            },
        ],
    },
};

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roleKey = searchParams.get("role") || "default";
    const initialEmail = searchParams.get("email") || "";
    const config = roleConfig[roleKey] || roleConfig["default"];

    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        
        // --- AUTH BYPASS FOR DEMO ---
        const roleRoutes: Record<string, string> = {
            "super-admin": "/dashboard/super-admin",
            "mp": "/dashboard/party-central",
            "party-command": "/dashboard/party-central",
            "citizen": "/citizen",
            "manager": "/dashboard/manager",
            "data-analyst": "/dashboard/data-analyst",
            "eci-observer": "/dashboard/eci-observer",
            "booth-adhyaksh": "/dashboard/booth-adhyaksh",
            "panna-pramukh": "/dashboard/panna-pramukh",
        };

        toast.success(`Welcome back! Logging in as ${roleKey}...`);
        document.cookie = `user_role=${roleKey}; path=/`;
        if (roleKey === 'citizen') {
            document.cookie = "is_citizen_verified=true; path=/; max-age=3600";
        }
        
        router.push(roleRoutes[roleKey] || "/dashboard/super-admin");
        return;

        if (!email || !password) {
            toast.error("Please enter both email and password.");
            return;
        }

        setLoading(true);
        const supabase = createClient();
        
        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            const errorMessage = authError?.message;

            if (errorMessage) {
                toast.error(errorMessage as any);
                setLoading(false);
                return;
            }

            const userId = authData?.user?.id;

            if (!userId) {
                toast.error("Authentication failed. Please try again.");
                setLoading(false);
                return;
            }

            // Fetch the user's role from the profiles table
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", userId)
                .single();

            if (profileError || !profile) {
                console.error("Error fetching profile:", profileError);
                toast.error("Failed to fetch user profile. Please contact support.");
                setLoading(false);
                return;
            }

            const userRole = (profile as any)?.role || roleKey;

            // Set role cookie for legacy simulated role-based routing
            document.cookie = `user_role=${userRole}; path=/`;

            // If citizen, also set verification cookie
            if (userRole === 'citizen') {
                document.cookie = "is_citizen_verified=true; path=/; max-age=3600";
            }

            toast.success("Login successful!");

            // Intelligent Routing based on Role
            const roleRoutes: Record<string, string> = {
                "super_admin": "/dashboard/super-admin",
                "super-admin": "/dashboard/super-admin",
                "mp": "/dashboard/party-central",
                "party_central": "/dashboard/party-central",
                "party-command": "/dashboard/party-central",
                "citizen": "/citizen",
                "manager": "/dashboard/manager",
                "data-analyst": "/dashboard/data-analyst",
                "eci-observer": "/dashboard/eci-observer",
                "eci": "/dashboard/eci-observer",
                "booth-adhyaksh": "/dashboard/booth-adhyaksh",
                "booth_worker": "/dashboard/booth-adhyaksh",
                "panna-pramukh": "/dashboard/panna-pramukh",
            };
            
            router.push(roleRoutes[userRole] || "/dashboard/super-admin");
        } catch (err: any) {
            toast.error(err.message || "An unexpected error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden font-display text-text-cream">
            {/* ─── Left Panel: Context (40%) ─── */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden lg:flex flex-col w-[40%] bg-surface-dark relative overflow-hidden border-r border-white/5"
            >
                {/* Background Network Graphic */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 400 600"
                        preserveAspectRatio="xMidYMid slice"
                        className="w-full h-full"
                    >
                        <path
                            d="M50 100 L120 150 L200 80 L280 160 L250 250 L150 220 L50 300"
                            fill="none"
                            stroke="#e9781c"
                            strokeOpacity="0.5"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M300 300 L250 350 L180 320 L100 400 L50 450"
                            fill="none"
                            stroke="#e9781c"
                            strokeOpacity="0.3"
                            strokeWidth="1.5"
                        />
                        {[
                            { cx: 120, cy: 150, delay: 0 },
                            { cx: 200, cy: 80, delay: 0.5 },
                            { cx: 250, cy: 250, delay: 1 },
                            { cx: 100, cy: 400, delay: 1.5 },
                        ].map((dot, i) => (
                            <motion.circle
                                key={i}
                                cx={dot.cx}
                                cy={dot.cy}
                                r="4"
                                fill="#e9781c"
                                animate={{
                                    opacity: [0.3, 0.8, 0.3],
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: dot.delay,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center h-full p-12 xl:p-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                            Secure Access
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 leading-tight"
                    >
                        {config.label.split(" ").slice(0, -1).join(" ")} <br />
                        <span className="text-primary">
                            {config.label.split(" ").slice(-1)}
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-white/60 text-lg mb-12 font-light"
                    >
                        {config.subtitle}
                    </motion.p>

                    <ul className="space-y-8">
                        {config.features.map((feature, i) => (
                            <motion.li
                                key={feature.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.15 }}
                                className="flex items-start gap-4 group"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-dark border border-white/10 flex items-center justify-center text-accent-gold group-hover:border-accent-gold/50 transition-colors duration-300">
                                    <Icon name={feature.icon} />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-lg">
                                        {feature.title}
                                    </h3>
                                    <p className="text-white/50 text-sm mt-1">{feature.desc}</p>
                                </div>
                            </motion.li>
                        ))}
                    </ul>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-auto pt-12 flex items-center gap-2 text-white/30 text-xs"
                    >
                        <Icon name="verified_user" size={16} />
                        <span>BoothIQ Intelligence Platform v2.4</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* ─── Right Panel: Login Form (60%) ─── */}
            <div className={`flex-1 flex flex-col relative ${roleKey === 'citizen' ? 'bg-[#F4F7F5] text-slate-800' : 'bg-background-dark text-white'}`}>
                {/* Top Nav / Breadcrumbs */}
                <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-20">
                    <nav aria-label="Breadcrumb" className="flex">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link
                                    href="/"
                                    className={`${roleKey === 'citizen' ? 'text-slate-500 hover:text-primary' : 'text-white/40 hover:text-primary'} transition-colors text-sm font-medium`}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <span className={`${roleKey === 'citizen' ? 'text-slate-300' : 'text-white/20'} text-sm`}>/</span>
                            </li>
                            <li>
                                <Link
                                    href="/auth"
                                    className={`${roleKey === 'citizen' ? 'text-slate-500 hover:text-primary' : 'text-white/40 hover:text-primary'} transition-colors text-sm font-medium`}
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <span className={`${roleKey === 'citizen' ? 'text-slate-300' : 'text-white/20'} text-sm`}>/</span>
                            </li>
                            <li>
                                <span
                                    aria-current="page"
                                    className="text-primary text-sm font-medium"
                                >
                                    {config.label.split(" ").pop()} Portal
                                </span>
                            </li>
                        </ol>
                    </nav>
                    <Link
                        href="#"
                        className={`hidden sm:block text-sm ${roleKey === 'citizen' ? 'text-slate-500 hover:text-primary' : 'text-white/40 hover:text-white'} transition-colors`}
                    >
                        Need help?
                    </Link>
                </div>

                {/* Main Form Area */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
                    {roleKey === 'citizen' ? (
                        /* ════════════════════════════════════════════════════
                           CANDIDATE / CITIZEN STYLE VERIFICATION CARD
                           ════════════════════════════════════════════════════ */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md animate-fade-in"
                        >
                            <div className="mb-6">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#157f3c]">Step 1</span>
                                <h3 className="text-3xl font-serif font-bold text-slate-900 mt-1">Identity Verification</h3>
                            </div>

                            <div className="relative flex flex-col bg-white rounded-2xl shadow-xl shadow-green-900/5 border border-slate-100 overflow-hidden">
                                {/* Top Green Border */}
                                <div className="h-2 w-full bg-[#157f3c]"></div>

                                <div className="p-8 flex flex-col gap-6">
                                    <div className="text-center">
                                        <div className="size-20 bg-[#157f3c]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#157f3c]">
                                            <Icon name="fingerprint" size={40} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Aadhaar Verification</h2>
                                        <p className="text-slate-500 text-lg leading-snug">
                                            Enter your details to securely access grievance services.
                                        </p>
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-3 text-left">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-1">Email Address</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Icon name="mail" size={24} />
                                            </span>
                                            <input
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#157f3c] focus:border-[#157f3c] text-lg font-medium text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                                                placeholder="citizen@example.com"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Password Input */}
                                    <div className="space-y-3 text-left">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest pl-1">Password</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Icon name="lock" size={24} />
                                            </span>
                                            <input
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#157f3c] focus:border-[#157f3c] text-lg font-medium text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                                                placeholder="••••••••"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={handleLogin}
                                        disabled={loading}
                                        className="w-full bg-[#198754] hover:bg-[#157f3c] disabled:opacity-70 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                                    >
                                        <span>{loading ? "Verifying..." : "Secure Login"}</span>
                                        <Icon name="arrow_forward" />
                                    </button>

                                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-2">
                                        <Icon name="lock" size={14} />
                                        <span className="font-medium">256-bit Secure Encryption</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* ════════════════════════════════════════════════════
                           STANDARD DARK LOGIN FORM (Admin, MP, etc.)
                           ════════════════════════════════════════════════════ */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-md space-y-8"
                        >
                            {/* Standard Header */}
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-accent-gold/10 text-accent-gold border border-accent-gold/20 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse"></span>
                                    Restricted Area
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-tight">
                                    Welcome back
                                </h1>
                                <p className="text-white/50 text-lg">
                                    Please verify your credentials to continue.
                                </p>
                            </div>

                            {/* Standard Form */}
                            <form className="space-y-8 mt-8" onSubmit={(e) => e.preventDefault()}>
                                {/* Email/Password Inputs */}
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <div className="relative w-full">
                                            <input
                                                type="email"
                                                id="email"
                                                className="block py-2.5 px-0 w-full text-lg text-white bg-transparent border-0 border-b border-white/20 appearance-none focus:outline-none focus:ring-0 peer placeholder-transparent focus:border-accent-gold transition-colors"
                                                placeholder=" "
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <label
                                                htmlFor="email"
                                                className="absolute text-lg text-white/40 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-accent-gold"
                                            >
                                                Email Address
                                            </label>
                                            <div className="absolute bottom-0 left-0 h-0.5 bg-accent-gold w-0 peer-focus:w-full transition-all duration-300" />
                                        </div>
                                    </div>
                                    <div className="relative group mt-6">
                                        <div className="relative w-full">
                                            <input
                                                type="password"
                                                id="password"
                                                className="block py-2.5 px-0 w-full text-lg text-white bg-transparent border-0 border-b border-white/20 appearance-none focus:outline-none focus:ring-0 peer placeholder-transparent focus:border-accent-gold transition-colors"
                                                placeholder=" "
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <label
                                                htmlFor="password"
                                                className="absolute text-lg text-white/40 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-accent-gold"
                                            >
                                                Password
                                            </label>
                                            <div className="absolute bottom-0 left-0 h-0.5 bg-accent-gold w-0 peer-focus:w-full transition-all duration-300" />
                                        </div>
                                    </div>
                                </div>

                                {/* Biometric Step Indicator */}
                                <div className="bg-surface-dark/50 rounded-lg p-3 border border-white/5 flex items-center gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                        <Icon name="fingerprint" size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-white/80 font-medium">Email Verification</p>
                                        <p className="text-[10px] text-white/40">Secured via Supabase Auth</p>
                                    </div>
                                    <Icon name="check_circle" className="text-white/20" size={20} />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLogin}
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-md text-sm font-semibold text-white bg-primary hover:bg-[#d66a15] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-dark transition-all duration-300 overflow-hidden shadow-lg shadow-primary/20"
                                >
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <Icon name="lock_open" className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                                    </span>
                                    {loading ? "Verifying..." : "Verify & Access Dashboard"}
                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                                </motion.button>
                            </form>

                            {/* Footer */}
                            <div className="text-center pt-4">
                                {!["super-admin", "super_admin", "party-command", "mp", "manager", "data-analyst", "eci-observer"].includes(roleKey) && (
                                    <p className="text-sm text-white/30 mb-2">
                                        Don't have an account?{" "}
                                        <Link href={`/auth/signup?role=${roleKey}`} className="font-medium text-accent-gold hover:text-white transition-colors">
                                            Sign Up
                                        </Link>
                                    </p>
                                )}
                                <p className="text-sm text-white/30">
                                    Not an elected official?{" "}
                                    <Link href="/auth?role=admin" className="font-medium text-accent-gold hover:text-white transition-colors">
                                        Admin Login
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Bottom Decorative Bar */}
                <div className={`h-1.5 w-full ${roleKey === 'citizen' ? 'bg-[#198754]' : 'bg-gradient-to-r from-background-dark via-primary to-background-dark opacity-50'}`} />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-dark flex items-center justify-center text-white font-mono text-sm">Loading System...</div>}>
            <LoginForm />
        </Suspense>
    );
}
