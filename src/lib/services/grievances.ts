import { createClient } from "@/utils/supabase/client";
import type { Grievance } from "../types";

// ── GRIEVANCE SERVICE ────────────────────────────────────────────

/**
 * Get grievances, optionally filtered by booth or status.
 */
export async function getGrievances(filters?: {
    boothId?: number;
    voterId?: number;
    status?: string;
    category?: string;
    limit?: number;
}): Promise<Grievance[]> {
    const supabase = createClient();
    let query = supabase
        .from("grievances")
        .select("*")
        .order("created_at", { ascending: false });

    if (filters?.boothId) query = query.eq("booth_id", filters.boothId);
    if (filters?.voterId) query = query.eq("voter_id", filters.voterId);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching grievances:", error.message);
        return [];
    }
    return (data || []) as Grievance[];
}

/**
 * Get grievance stats — counts by category and status.
 */
export async function getGrievanceStats(boothId?: number) {
    const supabase = createClient();
    let query = supabase.from("grievances").select("category, status");
    if (boothId) query = query.eq("booth_id", boothId);

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching grievance stats:", error.message);
        return { total: 0, byCategory: {}, byStatus: {} };
    }

    const rows = data || [];
    const byCategory: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const row of rows) {
        byCategory[row.category] = (byCategory[row.category] || 0) + 1;
        byStatus[row.status] = (byStatus[row.status] || 0) + 1;
    }

    return { total: rows.length, byCategory, byStatus };
}

/**
 * Create a new grievance.
 */
export async function createGrievance(grievance: {
    voter_id?: number;
    booth_id?: number;
    category: string;
    title?: string;
    description: string;
    location?: string;
    photo_url?: string;
}): Promise<Grievance | null> {
    const supabase = createClient();
    const insertData: any = {
        category: grievance.category,
        description: grievance.description,
        status: "submitted",
    };

    if (grievance.voter_id) insertData.voter_id = grievance.voter_id;
    if (grievance.booth_id) insertData.booth_id = grievance.booth_id;
    if (grievance.title) insertData.title = grievance.title;
    if (grievance.location) insertData.location = grievance.location;
    if (grievance.photo_url) insertData.photo_url = grievance.photo_url;

    console.log("[createGrievance] Payload:", insertData);

    const { data, error } = await supabase
        .from("grievances")
        .insert(insertData)
        .select();

    if (error) {
        console.error("Supabase Error [createGrievance]:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
        });
        return null;
    }
    
    // Return the first inserted row
    return data && data.length > 0 ? (data[0] as Grievance) : null;
}

/**
 * Update grievance status (assign, resolve, etc.).
 */
export async function updateGrievanceStatus(
    id: number,
    updates: {
        status: "submitted" | "assigned" | "in_progress" | "resolved";
        assigned_to?: string;
        resolution_note?: string;
    }
): Promise<Grievance | null> {
    const supabase = createClient();
    const updateData: Record<string, unknown> = { status: updates.status };
    if (updates.assigned_to) updateData.assigned_to = updates.assigned_to;
    if (updates.resolution_note) updateData.resolution_note = updates.resolution_note;
    if (updates.status === "resolved") updateData.resolved_at = new Date().toISOString();

    const { data, error } = await supabase
        .from("grievances")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating grievance:", error.message);
        return null;
    }
    return data as Grievance;
}

/**
 * Upload a grievance photo to Supabase Storage.
 */
export async function uploadGrievancePhoto(file: File): Promise<string | null> {
    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;
    console.log(`[Storage] Attempting upload: ${fileName} to 'grievance-photos'`);
    
    try {
        const { data, error } = await supabase.storage
            .from("grievance-photos")
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("[Storage] Supabase Upload Error:", {
                message: error.message,
                name: error.name,
                status: (error as any).status,
                details: error
            });
            return null;
        }

        console.log("[Storage] Upload success:", data);

        const { data: urlData } = supabase.storage
            .from("grievance-photos")
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    } catch (err) {
        console.error("[Storage] Unexpected error during upload:", err);
        return null;
    }
}
