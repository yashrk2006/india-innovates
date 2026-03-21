import { createClient } from "@/utils/supabase/client";
import type { Scheme, VoterSchemeStatus } from "../types";

// ── SCHEME SERVICE ───────────────────────────────────────────────

/**
 * Get all active government schemes.
 */
export async function getSchemes(): Promise<Scheme[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("schemes")
        .select("*")
        .eq("active", true)
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching schemes:", error.message);
        return [];
    }
    return (data || []) as Scheme[];
}

/**
 * Get scheme enrollment gaps — enrolled vs eligible per scheme.
 */
export async function getSchemeGaps() {
    const supabase = createClient();
    // Get all schemes
    const schemes = await getSchemes();

    // Get all voter_scheme_status grouped by scheme
    const { data: statusData, error } = await supabase
        .from("voter_scheme_status")
        .select("scheme_id, status");

    if (error) {
        console.error("Error fetching scheme status:", error.message);
        return schemes.map(s => ({
            scheme: s,
            eligible: 0,
            enrolled: 0,
            applied: 0,
            gap: 0,
            gapPct: 0,
        }));
    }

    // Aggregate per scheme
    const schemeStats: Record<number, { eligible: number; enrolled: number; applied: number }> = {};
    for (const row of statusData || []) {
        if (!schemeStats[row.scheme_id]) {
            schemeStats[row.scheme_id] = { eligible: 0, enrolled: 0, applied: 0 };
        }
        const s = schemeStats[row.scheme_id];
        if (row.status === "eligible") s.eligible++;
        else if (row.status === "enrolled") s.enrolled++;
        else if (row.status === "applied") s.applied++;
        // Count all as eligible total
        s.eligible++; // total who are in the system for this scheme
    }

    return schemes.map(scheme => {
        const stats = schemeStats[scheme.id] || { eligible: 0, enrolled: 0, applied: 0 };
        const totalEligible = stats.eligible || 1;
        const gap = totalEligible - stats.enrolled - stats.applied;
        return {
            scheme,
            eligible: totalEligible,
            enrolled: stats.enrolled,
            applied: stats.applied,
            gap: Math.max(gap, 0),
            gapPct: Math.round((Math.max(gap, 0) / totalEligible) * 100),
        };
    });
}

/**
 * Enroll a voter in a scheme (update status from eligible to enrolled).
 */
export async function enrollVoterInScheme(voterId: number, schemeId: number): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
        .from("voter_scheme_status")
        .update({
            status: "enrolled",
            enrolled_at: new Date().toISOString(),
            converted: true,
        })
        .eq("voter_id", voterId)
        .eq("scheme_id", schemeId);

    if (error) {
        console.error("Error enrolling voter:", error.message);
        return false;
    }
    return true;
}

/**
 * Send a scheme to a voter (mark them as eligible/notified).
 */
export async function sendSchemeToVoter(voterId: number, schemeId: number): Promise<boolean> {
    const supabase = createClient();
    console.log(`[sendSchemeToVoter] Attempting upsert for Voter: ${voterId}, Scheme: ${schemeId}`);
    
    const { error } = await supabase
        .from("voter_scheme_status")
        .upsert({
            voter_id: voterId,
            scheme_id: schemeId,
            status: "eligible",
            outreach_sent: true,
            outreach_sent_at: new Date().toISOString(),
        }, { onConflict: "voter_id,scheme_id" });

    if (error) {
        console.error("[sendSchemeToVoter] Upsert error:", error.message, error);
        return false;
    }
    
    console.log(`[sendSchemeToVoter] Success for Voter: ${voterId}`);
    return true;
}

/**
 * Get voter scheme statuses for a specific voter.
 */
export async function getVoterSchemes(voterId: number): Promise<VoterSchemeStatus[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("voter_scheme_status")
        .select("*, scheme:schemes(*)")
        .eq("voter_id", voterId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching voter schemes:", error.message);
        return [];
    }
    return (data || []) as VoterSchemeStatus[];
}
