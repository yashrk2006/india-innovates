"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        // Check for user role in cookies
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(";").shift();
        };

        const role = getCookie("user_role");

        if (role === "admin" || role === "super-admin") {
            router.push("/dashboard/super-admin");
        } else if (role === "mp" || role === "party") {
            router.push("/dashboard/party-central");
        } else {
            // Default to Party Central if no specific role or unknown
            router.push("/dashboard/party-central");
        }
    }, [router]);

    return (
        <div className="h-screen w-full flex items-center justify-center bg-background-dark text-white font-mono text-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p>Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
