import { supabase } from "../supabase";
import type { Voter, VoterECI } from "../types";

// ── VOTER SERVICE ────────────────────────────────────────────────

/**
 * Get voters for a booth (joins operational + ECI data).
 */
export async function getVotersByBooth(boothId: number): Promise<Voter[]> {
    const { data, error } = await supabase
        .from("voters")
        .select("*, eci:voters_eci(*)")
        .eq("eci.booth_id", boothId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching voters:", error.message);
        // Fallback: query voters_eci first, then join
        const { data: eciData } = await supabase
            .from("voters_eci")
            .select("id")
            .eq("booth_id", boothId);

        if (eciData && eciData.length > 0) {
            const eciIds = eciData.map(e => e.id);
            const { data: voterData } = await supabase
                .from("voters")
                .select("*, eci:voters_eci(*)")
                .in("eci_voter_id", eciIds);
            return (voterData || []) as Voter[];
        }
        return [];
    }
    return (data || []) as Voter[];
}

/**
 * Get key voters for a booth or constituency.
 */
export async function getKeyVoters(boothId?: number): Promise<Voter[]> {
    let query = supabase
        .from("voters")
        .select("*, eci:voters_eci(*)")
        .eq("is_key_voter", true)
        .order("created_at", { ascending: false });

    // If boothId is provided, we need to filter through voters_eci
    const { data, error } = await query;
    if (error) {
        console.error("Error fetching key voters:", error.message);
        return [];
    }

    if (boothId && data) {
        return data.filter((v: any) => v.eci?.booth_id === boothId) as Voter[];
    }
    return (data || []) as Voter[];
}

/**
 * Get voter demographic breakdown (segments count).
 */
export async function getVoterDemographics(constituencyId?: number) {
    const { data, error } = await supabase
        .from("voters")
        .select("segment, is_key_voter, eci:voters_eci(gender, booth_id)");

    if (error) {
        console.error("Error fetching demographics:", error.message);
        return { segments: {}, genderSplit: {}, total: 0, keyVoters: 0 };
    }

    const voters = data || [];
    const segments: Record<string, number> = {};
    const genderSplit: Record<string, number> = { M: 0, F: 0, O: 0 };
    let keyVoters = 0;

    for (const v of voters as any[]) {
        const seg = v.segment || "other";
        segments[seg] = (segments[seg] || 0) + 1;
        if (v.is_key_voter) keyVoters++;
        const gender = v.eci?.gender || "O";
        genderSplit[gender] = (genderSplit[gender] || 0) + 1;
    }

    return {
        segments,
        genderSplit,
        total: voters.length,
        keyVoters,
    };
}

/**
 * Get sentiment records for a constituency.
 */
export async function getVoterSentiment(constituencyId?: number) {
    let query = supabase
        .from("sentiment_records")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(50);

    if (constituencyId) {
        query = query.eq("constituency_id", constituencyId);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching sentiment:", error.message);
        return [];
    }
    return data || [];
}

/**
 * Get voter count by booth.
 */
export async function getVoterCountByBooth() {
    const { data, error } = await supabase
        .from("voters_eci")
        .select("booth_id");

    if (error) {
        console.error("Error fetching voter counts:", error.message);
        return {};
    }

    const counts: Record<number, number> = {};
    for (const row of data || []) {
        if (row.booth_id) {
            counts[row.booth_id] = (counts[row.booth_id] || 0) + 1;
        }
    }
    return counts;
}

/**
 * Get full voter details joined with ECI, Booth, and Constituency data.
 */
export async function getFullVoterDetails(profileId: string) {
    // 1. Get the voter record using profile_id
    const { data: voter, error: vError } = await supabase
        .from("voters")
        .select(`
            *,
            eci:voters_eci(
                *,
                booth:booths(
                    *,
                    constituency:constituencies(*)
                )
            )
        `)
        .eq("profile_id", profileId)
        .single();

    if (vError) {
        console.error("Error fetching full voter details:", vError.message);
        return null;
    }

    return voter as any;
}

/**
 * Get the currently logged in voter's profile.
 */
export async function getVoterProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return getFullVoterDetails(user.id);
}
