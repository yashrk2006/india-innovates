"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";

function Icon({ name, className = "", size }: { name: string; className?: string; size?: number }) {
    return (
        <span className={`material-symbols-outlined ${className}`} style={size ? { fontSize: size } : undefined}>
            {name}
        </span>
    );
}

export default function VerifyIDPage() {
    const [step, setStep] = useState(1);
    const [idType, setIdType] = useState<"aadhaar" | "voter">("voter");
    const [idValue, setIdValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [voterData, setVoterData] = useState<any>(null);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(0);
    const router = useRouter();
    const supabase = createClient();

    // Timer for Resend OTP
    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleIdSubmit = async () => {
        if (!idValue) {
            toast.error(`Please enter your ${idType === "aadhaar" ? "Aadhaar" : "Voter ID"} number`);
            return;
        }

        setLoading(true);
        try {
            // In a real scenario, we'd check Aadhaar via an external API.
            // Here, we check the voters_eci table.
            // For Demo: EPIC lookup uses 'epic_number', Aadhaar lookup mocks with 'phone'
            const { data, error } = await supabase
                .from("voters_eci")
                .select("*, booth:booths(name, booth_number)")
                .eq(idType === "voter" ? "epic_number" : "phone", idValue)
                .single();

            if (error || !data) {
                toast.error(`${idType === "aadhaar" ? "Aadhaar" : "Voter ID"} not found in official records.`);
                setLoading(false);
                return;
            }

            setVoterData(data);
            setStep(3); // Go to OTP step
            setTimer(30);
            toast.success("Identity linked! Sending OTP to registered mobile...");
        } catch (err) {
            toast.error("An error occurred during verification.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const fullOtp = otp.join("");
        if (fullOtp.length < 6) {
            toast.error("Please enter the 6-digit OTP");
            return;
        }

        setLoading(true);
        // Simulate OTP verification
        setTimeout(async () => {
            try {
                // Set verification cookie for middleware
                document.cookie = "is_citizen_verified=true; path=/; max-age=3600";

                // 1. Check if a 'voters' record already exists for this ECI record
                const { data: existingVoter } = await supabase
                    .from("voters")
                    .select("id, profile_id")
                    .eq("eci_voter_id", voterData.id)
                    .single();

                if (existingVoter?.profile_id) {
                    toast.success("Verification successful! Redirecting to login...");
                    router.push(`/auth/login?role=citizen&email=${voterData.phone ? voterData.phone + "@citizen.local" : ""}`);
                } else {
                    // Store voter session for pre-filling signup
                    localStorage.setItem("verified_voter", JSON.stringify(voterData));
                    toast.success("Identity Verified! Please complete your profile.");
                    router.push("/auth/signup?role=citizen");
                }
            } catch (err) {
                toast.error("Verification failed. Please try again.");
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-display antialiased">
            {/* Logo area */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center gap-2"
            >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Icon name="how_to_vote" size={28} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Booth<span className="text-primary">IQ</span>
                </h1>
            </motion.div>

            <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[480px] bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
            >
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-100 flex">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        className="h-full bg-primary"
                    />
                </div>

                <div className="p-8 md:p-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Verify Identity</h2>
                                    <p className="text-slate-500">Choose your identification method to proceed</p>
                                </div>

                                {/* --- AUTH BYPASS FOR DEMO --- */}
                                <button 
                                    onClick={() => {
                                        document.cookie = "is_citizen_verified=true; path=/; max-age=3600";
                                        router.push("/auth/login?role=citizen");
                                    }}
                                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold py-4 rounded-2xl border-2 border-primary/20 flex items-center justify-center gap-3 transition-all"
                                >
                                    <Icon name="bolt" />
                                    <span>Instant Access (Demo Mode)</span>
                                </button>

                                <div className="grid grid-cols-1 gap-4">
                                    <button 
                                        onClick={() => { setIdType("voter"); setStep(2); }}
                                        className="group p-6 rounded-2xl border-2 border-slate-100 hover:border-primary/50 hover:bg-primary/5 transition-all text-left flex items-center gap-5"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                            <Icon name="badge" size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">Voter ID (EPIC)</h4>
                                            <p className="text-sm text-slate-500">Official identification by ECI</p>
                                        </div>
                                        <Icon name="chevron_right" className="text-slate-300 group-hover:text-primary transition-colors" />
                                    </button>

                                    <button 
                                        onClick={() => { setIdType("aadhaar"); setStep(2); }}
                                        className="group p-6 rounded-2xl border-2 border-slate-100 hover:border-accent-saffron/50 hover:bg-accent-saffron/5 transition-all text-left flex items-center gap-5"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-slate-100 group-hover:bg-accent-saffron/10 flex items-center justify-center text-slate-500 group-hover:text-accent-saffron transition-colors">
                                            <Icon name="fingerprint" size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 group-hover:text-accent-saffron transition-colors">Aadhaar Card</h4>
                                            <p className="text-sm text-slate-500">Biometric-linked digital identity</p>
                                        </div>
                                        <Icon name="chevron_right" className="text-slate-300 group-hover:text-accent-saffron transition-colors" />
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-slate-100 text-center">
                                    <Link href="/auth" className="text-sm font-medium text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2">
                                        <Icon name="arrow_back" size={16} /> Back to Role Selection
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1 text-sm font-bold">
                                    <Icon name="keyboard_backspace" size={20} /> Back
                                </button>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Enter Identity</h2>
                                    <p className="text-slate-500">Verify your {idType === "aadhaar" ? "official Aadhaar" : "registered Voter ID"}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                                            {idType === "aadhaar" ? "12-Digit Aadhaar Number" : "Epic ID Number" }
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Icon name={idType === "aadhaar" ? "fingerprint" : "badge"} size={24} />
                                            </span>
                                            <input 
                                                autoFocus
                                                type="text"
                                                value={idValue}
                                                onChange={(e) => setIdValue(e.target.value.toUpperCase())}
                                                className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary text-xl font-bold text-slate-900 transition-all outline-none"
                                                placeholder={idType === "aadhaar" ? "0000 0000 0000" : "ABC1234567"}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleIdSubmit}
                                        disabled={loading}
                                        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 text-lg transition-all active:scale-[0.98]"
                                    >
                                        {loading ? <Icon name="sync" className="animate-spin text-white" /> : "Verify Identity"}
                                        {!loading && <Icon name="search" />}
                                    </button>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <Icon name="verified_user" className="mt-0.5 text-primary" size={20} />
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                        Auth data is encrypted using AES-256. We directly verify against official records without local data persistence.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-3">
                                    <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto text-green-600 mb-4 border border-green-100 shadow-inner">
                                        <Icon name="sms" size={40} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Verify Mobile</h2>
                                    <p className="text-slate-500">
                                        Enter the 6-digit OTP sent to your <br />
                                        <span className="font-bold text-slate-900">XXXX-XXXX-{voterData?.phone?.slice(-4) || "8920"}</span>
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between gap-2">
                                        {otp.map((digit, i) => (
                                            <input 
                                                key={i}
                                                id={`otp-${i}`}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !otp[i] && i > 0) {
                                                        document.getElementById(`otp-${i-1}`)?.focus();
                                                    }
                                                }}
                                                className="w-full aspect-square text-center text-3xl font-bold rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-slate-50 text-slate-900"
                                            />
                                        ))}
                                    </div>

                                    <button 
                                        onClick={handleVerifyOtp}
                                        disabled={loading}
                                        className="w-full bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-bold py-5 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 text-lg transition-all active:scale-[0.98]"
                                    >
                                        {loading ? <Icon name="sync" className="animate-spin" /> : "Verify & Continue"}
                                        {!loading && <Icon name="verified" />}
                                    </button>

                                    <div className="text-center">
                                        <button 
                                            disabled={timer > 0}
                                            onClick={() => { setTimer(30); toast.success("OTP Resent!"); }}
                                            className="text-sm font-bold text-primary disabled:text-slate-300 hover:underline transition-colors"
                                        >
                                            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                                        </button>
                                    </div>
                                </div>

                                {voterData && (
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                                        <div className="flex items-center gap-4 mb-3 border-b border-slate-200 pb-3">
                                            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                {voterData.name?.[0] || 'V'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-slate-900 text-sm truncate">{voterData.name}</h4>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Verified Persona</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Booth</p>
                                                <p className="text-xs font-bold text-slate-700 truncate">{voterData.booth?.name || "Booth #124"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Ward</p>
                                                <p className="text-xs font-bold text-slate-700">Ward No. 12</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 grayscale opacity-40">
                    <img src="https://uidai.gov.in/images/logo/logo-uidai.png" alt="UIDAI" className="h-6 object-contain" />
                    <img src="https://eci.gov.in/uploads/monthly_2018_01/logo.png.311352d49931668636b0f023f03b226e.png" alt="ECI" className="h-6 object-contain" />
                </div>
                <p className="text-slate-400 text-[10px] text-center uppercase tracking-widest font-medium">
                    Secured by E-IDENTITY PROTOTYPE V4.0
                </p>
            </div>
        </div>
    );
}
