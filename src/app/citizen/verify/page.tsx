"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1=Aadhaar, 2=OTP, 3=Success
    const [aadhaar, setAadhaar] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Auto-format Aadhaar with spaces
    const formatAadhaar = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 12);
        return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    };

    const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAadhaar(formatAadhaar(e.target.value));
    };

    const handleSendOtp = () => {
        if (aadhaar.replace(/\s/g, "").length !== 12) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            // Start resend timer
            const timer = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) { clearInterval(timer); return 0; }
                    return prev - 1;
                });
            }, 1000);
        }, 1500);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        if (otp.some(d => !d)) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
            // Set cookie and redirect after showing success
            document.cookie = "citizen_token=true; path=/; max-age=86400";
            setTimeout(() => router.push("/citizen"), 2500);
        }, 2000);
    };

    const handleResend = () => {
        setResendTimer(30);
        setOtp(["", "", "", "", "", ""]);
        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] p-6">
            <div className="w-full max-w-md animate-fade-up">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-0 mb-8">
                    {[1, 2, 3].map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={`size-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step >= s
                                    ? "bg-primary border-primary text-white"
                                    : "bg-white border-stone-300 text-stone-400"
                                }`}>
                                {step > s ? (
                                    <span className="material-symbols-outlined text-sm">check</span>
                                ) : s}
                            </div>
                            {i < 2 && (
                                <div className={`w-12 h-0.5 mx-1 rounded transition-colors ${step > s ? "bg-primary" : "bg-stone-200"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Aadhaar Input */}
                {step === 1 && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-100 animate-fade-up">
                        <div className="h-1.5 w-full bg-primary" />
                        <div className="p-8 space-y-6">
                            <div className="text-center">
                                <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                    <span className="material-symbols-outlined text-4xl">fingerprint</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Aadhaar Verification</h2>
                                <p className="text-stone-500 leading-relaxed">Enter your 12-digit Aadhaar number to securely verify your identity.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">Aadhaar Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 material-symbols-outlined">badge</span>
                                    <input
                                        className="w-full pl-12 pr-12 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-lg tracking-[0.15em] font-medium placeholder:tracking-normal placeholder:text-stone-400 transition-all text-slate-900"
                                        placeholder="XXXX XXXX XXXX"
                                        type="text"
                                        value={aadhaar}
                                        onChange={handleAadhaarChange}
                                        maxLength={14} // 12 digits + 2 spaces
                                    />
                                    {aadhaar.replace(/\s/g, "").length === 12 && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined icon-filled animate-pop">check_circle</span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleSendOtp}
                                disabled={aadhaar.replace(/\s/g, "").length !== 12 || loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        Send OTP
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-stone-400 text-sm">
                                <span className="material-symbols-outlined text-base">lock</span>
                                <span>256-bit Secure Encryption</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-100 animate-fade-up">
                        <div className="h-1.5 w-full bg-primary" />
                        <div className="p-8 space-y-6">
                            <div className="text-center">
                                <div className="size-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                    <span className="material-symbols-outlined text-4xl">sms</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Enter OTP</h2>
                                <p className="text-stone-500">
                                    Sent to mobile ending in <span className="font-bold text-slate-900">****89</span>
                                </p>
                            </div>

                            <div className="flex gap-2 justify-center">
                                {otp.map((d, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { otpRefs.current[i] = el; }}
                                        className={`w-12 h-14 text-center text-2xl font-bold bg-white border-2 rounded-xl focus:outline-none transition-all text-slate-900 ${d ? "border-primary text-primary shadow-[0_0_15px_rgba(21,127,60,0.15)]" : "border-stone-200 focus:border-primary"
                                            }`}
                                        maxLength={1}
                                        type="text"
                                        inputMode="numeric"
                                        value={d}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    />
                                ))}
                            </div>

                            <div className="text-center">
                                {resendTimer > 0 ? (
                                    <span className="text-sm text-stone-500">Resend in <span className="font-bold text-primary">{resendTimer}s</span></span>
                                ) : (
                                    <button onClick={handleResend} className="text-sm font-bold text-primary hover:underline">
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); }}
                                    className="flex-1 py-4 border-2 border-stone-200 text-stone-600 font-bold rounded-xl hover:bg-stone-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleVerify}
                                    disabled={otp.some(d => !d) || loading}
                                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Verify</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-100 animate-fade-up text-center">
                        <div className="h-1.5 w-full bg-green-500" />
                        <div className="p-10 space-y-6">
                            <div className="size-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pop">
                                <span className="material-symbols-outlined text-green-600 text-5xl">verified</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Identity Verified!</h2>
                                <p className="text-stone-500 leading-relaxed">Your Aadhaar has been successfully verified. Redirecting to your dashboard...</p>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
                                <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                Redirecting...
                            </div>
                        </div>
                    </div>
                )}

                {/* Trust Indicators */}
                <div className="mt-6 flex items-center justify-center gap-6 text-stone-400">
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="material-symbols-outlined text-sm">shield</span>
                        <span>UIDAI Compliant</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        <span>DigiLocker Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
