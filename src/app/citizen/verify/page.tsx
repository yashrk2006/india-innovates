"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
    const router = useRouter();
    const [aadhaar, setAadhaar] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handleVerify = () => {
        // Mock verification logic & set cookie
        document.cookie = "citizen_token=true; path=/; max-age=86400"; // 24 hours
        router.push("/citizen");
    };

    return (
        <div className="flex flex-col w-full max-w-md animate-fade-in p-6">
            <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Step 1</span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Identity Verification</h3>
            </div>

            {/* Verification Card */}
            <div className="relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card overflow-hidden">
                {/* Top Green Border */}
                <div className="h-2 w-full bg-primary"></div>
                <div className="p-8 flex flex-col gap-6">
                    <div className="text-center">
                        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                            <span className="material-symbols-outlined text-4xl">fingerprint</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-800 mb-2">Aadhaar Verification</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg leading-snug">Enter your details to securely access grievance services.</p>
                    </div>

                    {/* Aadhaar Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-600 uppercase tracking-wide">Aadhaar Number</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">badge</span>
                            <input
                                className="w-full pl-12 pr-4 py-4 bg-background-light dark:bg-white border border-slate-200 dark:border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-lg tracking-widest font-medium placeholder:tracking-normal placeholder:text-slate-400 transition-all text-slate-900"
                                placeholder="XXXX XXXX XXXX"
                                type="text"
                                value={aadhaar}
                                onChange={(e) => setAadhaar(e.target.value)}
                            />
                            {aadhaar.length >= 12 && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined icon-filled">check_circle</span>
                            )}
                        </div>
                    </div>

                    {/* OTP Section (Mocked always visible for demo as per design) */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-600 uppercase tracking-wide">Enter OTP</label>
                            <span className="text-sm text-secondary font-semibold cursor-pointer hover:underline">Resend in 24s</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sent to mobile ending in <span className="font-bold text-slate-900 dark:text-slate-700">****89</span></p>
                        <div className="flex gap-2 justify-between mt-2">
                            {otp.map((d, i) => (
                                <input
                                    key={i}
                                    className={`w-12 h-14 text-center text-2xl font-bold bg-white border rounded-lg focus:outline-none focus:ring-0 transition-all text-slate-900 ${d ? 'border-primary text-primary shadow-[0_0_15px_rgba(21,127,60,0.3)]' : 'border-slate-300'}`}
                                    maxLength={1}
                                    type="text"
                                    value={d}
                                    onChange={(e) => {
                                        const newOtp = [...otp];
                                        newOtp[i] = e.target.value;
                                        setOtp(newOtp);
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleVerify}
                        className="w-full bg-primary hover:bg-green-800 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                    >
                        <span>Verify & Proceed</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>

                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                        <span className="material-symbols-outlined text-base">lock</span>
                        <span>256-bit Secure Encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
