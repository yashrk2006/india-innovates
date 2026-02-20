"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState, Suspense } from "react";

/* ─── Icon helper ─── */
function Icon({ name, className = "", size }: { name: string; className?: string; size?: number }) {
    return (
        <span className={`material-symbols-outlined ${className}`} style={size ? { fontSize: size } : undefined}>
            {name}
        </span>
    );
}

/* ─── Role labels ─── */
const roleLabels: Record<string, string> = {
    "super-admin": "Super Admin",
    "party-command": "Party Command",
    manager: "Campaign Manager",
    citizen: "Citizen",
    "booth-adhyaksh": "Booth Adhyaksh",
    "panna-pramukh": "Panna Pramukh",
    "data-analyst": "Data Analyst",
    "eci-observer": "ECI Observer",
};

function SignUpForm() {
    const searchParams = useSearchParams();
    const role = searchParams.get("role") || "manager";
    const roleLabel = roleLabels[role] || "User";

    const [showPassword, setShowPassword] = useState(false);

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

                <div className="relative z-20 flex flex-col h-full p-12 justify-between">
                    {/* Logo */}
                    <Link href="/auth" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-charcoal-dark group-hover:scale-105 transition-transform duration-300">
                            <Icon name="how_to_vote" size={28} />
                        </div>
                        <h1 className="text-white text-2xl font-bold tracking-tight">
                            Booth<span className="text-primary">IQ</span>
                        </h1>
                    </Link>

                    {/* Center content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7 }}
                        className="my-auto"
                    >
                        <div className="w-12 h-1 bg-primary mb-8" />
                        <h2 className="text-white font-serif italic text-3xl lg:text-4xl leading-tight opacity-90 mb-4">
                            Join the intelligence revolution.
                        </h2>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Create your secure account and gain access to India&apos;s most advanced political intelligence platform.
                        </p>

                        {/* Steps preview */}
                        <div className="mt-8 space-y-4">
                            {[
                                { icon: "person_add", text: "Create your account", step: "01" },
                                { icon: "verified_user", text: "Verify your Aadhaar identity", step: "02" },
                                { icon: "dashboard", text: "Access your War Room", step: "03" },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                                    className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/5"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-mono font-bold">
                                        {item.step}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Icon name={item.icon} size={18} className="text-primary/70" />
                                        <span className="text-white/70 text-sm">{item.text}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Bottom */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex items-center justify-center gap-2 text-white/40 text-xs font-mono bg-white/5 py-3 rounded-lg border border-white/5"
                    >
                        <Icon name="lock" size={16} />
                        <span>Secured by Aadhaar Integration</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* ─── Right Panel: Sign Up Form ─── */}
            <div className="flex-1 bg-charcoal-light relative flex flex-col h-full overflow-y-auto w-full md:w-[60%]">
                {/* Mobile header */}
                <div className="md:hidden p-6 bg-charcoal-dark border-b border-white/5 flex items-center justify-between sticky top-0 z-50">
                    <Link href="/auth" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-charcoal-dark">
                            <Icon name="how_to_vote" size={20} />
                        </div>
                        <h1 className="text-white text-xl font-bold">
                            Booth<span className="text-primary">IQ</span>
                        </h1>
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 max-w-md mx-auto w-full">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-full mb-8"
                    >
                        <Link
                            href="/auth"
                            className="inline-flex items-center gap-1.5 text-white/40 hover:text-primary text-xs font-mono mb-4 transition-colors duration-300 group"
                        >
                            <Icon name="arrow_back" className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
                            Change Role
                        </Link>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                                <span className="text-primary text-xs font-mono uppercase tracking-widest">{roleLabel}</span>
                            </div>
                        </div>

                        <h1 className="text-white text-3xl font-bold tracking-tight mt-4">
                            Request Access
                        </h1>
                        <p className="text-white/50 text-sm mt-2">
                            Create your account for intelligence platform access.
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="w-full space-y-4"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-white/70 text-xs font-mono uppercase tracking-wider mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Rajesh"
                                    className="w-full h-12 bg-[#1c1c24] border border-white/10 rounded-lg px-4 text-white text-sm placeholder-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block text-white/70 text-xs font-mono uppercase tracking-wider mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Kumar"
                                    className="w-full h-12 bg-[#1c1c24] border border-white/10 rounded-lg px-4 text-white text-sm placeholder-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-white/70 text-xs font-mono uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="rajesh@boothiq.in"
                                    className="w-full h-12 bg-[#1c1c24] border border-white/10 rounded-lg px-4 text-white text-sm placeholder-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all duration-300"
                                />
                                <Icon name="mail" size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-white/70 text-xs font-mono uppercase tracking-wider mb-2">
                                Mobile Number
                            </label>
                            <div className="relative flex gap-2">
                                <div className="w-20 h-12 bg-[#1c1c24] border border-white/10 rounded-lg flex items-center justify-center text-white/50 text-sm font-mono">
                                    +91
                                </div>
                                <input
                                    type="tel"
                                    placeholder="98765 43210"
                                    className="flex-1 h-12 bg-[#1c1c24] border border-white/10 rounded-lg px-4 text-white text-sm placeholder-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white/70 text-xs font-mono uppercase tracking-wider mb-2">
                                Create Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
                                    className="w-full h-12 bg-[#1c1c24] border border-white/10 rounded-lg px-4 text-white text-sm placeholder-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                                >
                                    <Icon name={showPassword ? "visibility_off" : "visibility"} size={18} />
                                </button>
                            </div>
                            {/* Password strength bar */}
                            <div className="flex gap-1 mt-2">
                                <div className="h-1 flex-1 bg-accent-red/50 rounded-full" />
                                <div className="h-1 flex-1 bg-white/10 rounded-full" />
                                <div className="h-1 flex-1 bg-white/10 rounded-full" />
                                <div className="h-1 flex-1 bg-white/10 rounded-full" />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <div className="w-4 h-4 mt-0.5 rounded border border-white/20 shrink-0 cursor-pointer hover:border-primary/50 transition-colors" />
                            <p className="text-white/40 text-xs leading-relaxed">
                                I agree to the{" "}
                                <span className="text-primary cursor-pointer hover:text-primary/80 transition-colors">Terms of Service</span>{" "}
                                and{" "}
                                <span className="text-primary cursor-pointer hover:text-primary/80 transition-colors">Privacy Policy</span>.
                                I understand all activity is subject to audit.
                            </p>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(201,167,74,0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-charcoal-dark font-bold rounded-lg text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(201,167,74,0.2)]"
                        >
                            <Icon name="person_add" size={18} />
                            Create Account
                        </motion.button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-1">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-white/30 text-xs font-mono">or</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        {/* Aadhaar signup */}
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02, borderColor: "rgba(201,167,74,0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-12 bg-transparent border border-white/10 text-white font-medium rounded-lg text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/5"
                        >
                            <Icon name="fingerprint" size={20} className="text-primary" />
                            Register with Aadhaar eKYC
                        </motion.button>
                    </motion.form>

                    {/* Login link */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 text-white/40 text-sm"
                    >
                        Already have an account?{" "}
                        <Link
                            href={`/auth/login?role=${role}`}
                            className="text-primary hover:text-primary/80 font-bold transition-colors duration-300"
                        >
                            Sign In
                        </Link>
                    </motion.p>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-6 w-full flex justify-between items-center border-t border-white/5 pt-6 text-xs"
                    >
                        <span className="text-white/30">© 2026 BoothIQ Intelligence</span>
                        <Link href="#" className="text-white/30 hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={
            <div className="h-screen bg-charcoal-light flex items-center justify-center">
                <div className="text-primary animate-pulse">Loading...</div>
            </div>
        }>
            <SignUpForm />
        </Suspense>
    );
}
