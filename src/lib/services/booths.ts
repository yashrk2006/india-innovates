import { supabase } from "../supabase";

// ── BOOTH SERVICE ────────────────────────────────────────────────

export interface BoothRow {
    id: number;
    constituency_id: number;
    booth_number: string;
    name: string | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
    total_voters: number;
    assigned_worker: string | null;
    created_at: string;
}

export interface BoothWithDetails extends BoothRow {
    constituency?: { id: number; name: string; district_id: number };
    worker_count?: number;
    grievance_count?: number;
}

/**
 * List all booths, optionally filtered by constituency.
 * Joins constituency name for display.
 */
export async function getBooths(constituencyId?: number): Promise<BoothWithDetails[]> {
    let query = supabase
        .from("booths")
        .select("*, constituency:constituencies(id, name, district_id)")
        .order("booth_number", { ascending: true });

    if (constituencyId) {
        query = query.eq("constituency_id", constituencyId);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching booths:", error.message);
        return [];
    }
    return (data || []) as BoothWithDetails[];
}

/**
 * Get a single booth by ID with full details.
 */
export async function getBoothById(id: number): Promise<BoothWithDetails | null> {
    const { data, error } = await supabase
        .from("booths")
        .select("*, constituency:constituencies(id, name, district_id)")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching booth:", error.message);
        return null;
    }
    return data as BoothWithDetails;
}

/**
 * Aggregate booth stats: active, stalled, offline counts.
 * We derive status from assigned_worker and total_voters.
 */
export async function getBoothStats(constituencyId?: number) {
    const booths = await getBooths(constituencyId);
    const total = booths.length;
    const withWorker = booths.filter(b => b.assigned_worker).length;
    const withoutWorker = total - withWorker;

    return {
        total,
        active: withWorker,
        offline: withoutWorker,
        totalVoters: booths.reduce((sum, b) => sum + (b.total_voters || 0), 0),
    };
}

/**
 * Update booth details (name, address, assigned_worker).
 */
export async function updateBooth(id: number, updates: Partial<Pick<BoothRow, "name" | "address" | "assigned_worker">>) {
    const { data, error } = await supabase
        .from("booths")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating booth:", error.message);
        return null;
    }
    return data;
}
