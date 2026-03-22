import { supabase } from "../supabase";

// ── GEOGRAPHY SERVICE ────────────────────────────────────────────

export interface State {
    id: number;
    name: string;
    code: string;
    total_booths: number | null;
    total_voters: number | null;
    created_at: string;
}

export interface District {
    id: number;
    state_id: number;
    name: string;
    code: string | null;
    created_at: string;
}

export interface Constituency {
    id: number;
    district_id: number;
    name: string;
    type: "lok_sabha" | "vidhan_sabha";
    eci_code: string | null;
    assigned_leader: string | null;
    total_booths: number;
    created_at: string;
}

/**
 * Get all states.
 */
export async function getStates(): Promise<State[]> {
    const { data, error } = await supabase
        .from("states")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching states:", error.message);
        return [];
    }
    return (data || []) as State[];
}

/**
 * Get districts for a state.
 */
export async function getDistricts(stateId: number): Promise<District[]> {
    const { data, error } = await supabase
        .from("districts")
        .select("*")
        .eq("state_id", stateId)
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching districts:", error.message);
        return [];
    }
    return (data || []) as District[];
}

/**
 * Get constituencies for a district.
 */
export async function getConstituencies(districtId: number): Promise<Constituency[]> {
    const { data, error } = await supabase
        .from("constituencies")
        .select("*")
        .eq("district_id", districtId)
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching constituencies:", error.message);
        return [];
    }
    return (data || []) as Constituency[];
}

/**
 * Get all constituencies (flat list).
 */
export async function getAllConstituencies(): Promise<Constituency[]> {
    const { data, error } = await supabase
        .from("constituencies")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching all constituencies:", error.message);
        return [];
    }
    return (data || []) as Constituency[];
}

/**
 * Get full geography hierarchy for a constituency.
 */
export async function getGeographyChain(constituencyId: number) {
    const { data: constituency, error: cError } = await supabase
        .from("constituencies")
        .select("*, district:districts(*, state:states(*))")
        .eq("id", constituencyId)
        .single();

    if (cError) {
        console.error("Error fetching geography chain:", cError.message);
        return null;
    }
    return constituency;
}

/**
 * Get the profile assigned as leader for a constituency.
 */
export async function getConstituencyLeader(constituencyId: number) {
    const { data: constituency, error: cError } = await supabase
        .from("constituencies")
        .select("assigned_leader")
        .eq("id", constituencyId)
        .single();

    if (cError || !constituency?.assigned_leader) {
        return null;
    }

    const { data: profile, error: pError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", constituency.assigned_leader)
        .single();

    if (pError) {
        console.error("Error fetching constituency leader profile:", pError.message);
        return null;
    }

    return profile;
}
