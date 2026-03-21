"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastCtx {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastCtx>({ toast: () => { } });

export const useToast = () => useContext(ToastContext);

const icons: Record<ToastType, string> = {
    success: "check_circle",
    error: "error",
    info: "info",
    warning: "warning",
};
const colors: Record<ToastType, string> = {
    success: "#10b981",
    error: "#ef4444",
    info: "#3b82f6",
    warning: "#f59e0b",
};

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = "success") => {
        const id = nextId++;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] space-y-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 60, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, scale: 0.9 }}
                            className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border"
                            style={{
                                background: "#ffffff",
                                borderColor: colors[t.type] + "40",
                                boxShadow: `0 8px 32px rgba(30, 41, 59, 0.08)`,
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ color: colors[t.type], fontSize: 18 }}>
                                {icons[t.type]}
                            </span>
                            <span className="text-[12px] text-slate-700 font-medium max-w-[280px]">{t.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
