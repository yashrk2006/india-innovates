import { createClient } from "@/utils/supabase/client";
import type {
    Voter,
    VoterSchemeStatus,
    Grievance,
    InfrastructureProject,
    CitizenNotification,
} from "./types";

const supabase = createClient();

// ─── HELPER: GET CURRENT VOTER ID ────────────────────────────────
async function getCurrentVoterId(): Promise<number | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Auth bypass fallback for demo citizen portal
    if (!user) {
        console.warn("No authenticated user found. Using demo voter ID 1.");
        return 1; // Fallback to a demo voter ID
    }

    const { data } = await supabase
        .from("voters")
        .select("id")
        .eq("profile_id", user.id)
        .single();

    return data?.id || 1; // Fallback to 1 if no profile matches just in case
}

// ─── VOTER PROFILE ───────────────────────────────────────────────
// Joins voters + voters_eci to get both operational + personal data
export async function getVoterProfile(): Promise<Voter | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        // Auth bypass fallback: fetch default demo voter (id=1)
        const { data, error } = await supabase.from("voters").select("*, eci:voters_eci(*)").eq("id", 1).single();
        if (error) return null;
        return data as unknown as Voter;
    } else {
        const { data, error } = await supabase.from("voters").select("*, eci:voters_eci(*)").eq("profile_id", user.id).single();
        if (error) {
            console.error("Error fetching voter profile:", error.message);
            return null;
        }
        return data as unknown as Voter;
    }
}

// ─── SCHEMES ─────────────────────────────────────────────────────

export async function getVoterSchemes(): Promise<VoterSchemeStatus[]> {
    const voterId = await getCurrentVoterId();
    if (!voterId) return [];

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

export async function applyToScheme(schemeId: number): Promise<boolean> {
    const voterId = await getCurrentVoterId();
    if (!voterId) return false;

    const { data: existing } = await supabase
        .from("voter_scheme_status")
        .select("id")
        .eq("voter_id", voterId)
        .eq("scheme_id", schemeId)
        .maybeSingle();

    if (existing) {
        const { error } = await supabase
            .from("voter_scheme_status")
            .update({ status: "applied", enrolled_at: new Date().toISOString() })
            .eq("id", existing.id);
            
        if (error) {
            console.error("Error updating scheme status:", error.message);
            return false;
        }
    } else {
        const { error } = await supabase
            .from("voter_scheme_status")
            .insert({
                voter_id: voterId,
                scheme_id: schemeId,
                status: "applied"
            });
            
        if (error) {
            console.error("Error inserting scheme status:", error.message);
            return false;
        }
    }

    return true;
}

// ─── GRIEVANCES ──────────────────────────────────────────────────

export async function getGrievances(): Promise<Grievance[]> {
    const voterId = await getCurrentVoterId();
    if (!voterId) return [];

    const { data, error } = await supabase
        .from("grievances")
        .select("*")
        .eq("voter_id", voterId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching grievances:", error.message);
        return [];
    }
    return data || [];
}

export async function createGrievance(grievance: {
    category: string;
    description: string;
    location?: string;
    photo_url?: string;
}): Promise<Grievance | null> {
    const voterId = await getCurrentVoterId();
    if (!voterId) return null;

    const { data, error } = await supabase
        .from("grievances")
        .insert({
            voter_id: voterId,
            category: grievance.category,
            description: grievance.description,
            location: grievance.location || null,
            photo_url: grievance.photo_url || null,
            status: "submitted",
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating grievance:", error.message);
        return null;
    }
    return data;
}

export async function uploadGrievancePhoto(file: File): Promise<string | null> {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
        .from("grievance-photos")
        .upload(fileName, file);

    if (error) {
        console.error("Error uploading photo:", error.message);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from("grievance-photos")
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

// ─── INFRASTRUCTURE PROJECTS (was area_updates) ──────────────────

export async function getInfrastructureProjects(): Promise<InfrastructureProject[]> {
    // Get voter's booth from profile
    const profile = await getVoterProfile();
    const boothNumber = profile?.eci?.eci_part_number || "42"; 

    const { data, error } = await supabase
        .from("infrastructure_projects")
        .select("*")
        .eq("booth_number", boothNumber)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching area updates:", error.message);
        return [];
    }
    return data || [];
}

export async function toggleLikeProject(
    projectId: number,
    currentLikes: number,
    isLiked: boolean
): Promise<number> {
    const newCount = isLiked ? currentLikes - 1 : currentLikes + 1;

    const { error } = await supabase
        .from("infrastructure_projects")
        .update({ likes_count: newCount })
        .eq("id", projectId);

    if (error) {
        console.error("Error toggling like:", error.message);
        return currentLikes;
    }
    return newCount;
}

// ─── CITIZEN NOTIFICATIONS ───────────────────────────────────────

export async function getNotifications(): Promise<CitizenNotification[]> {
    const voterId = await getCurrentVoterId();
    if (!voterId) return [];

    const { data, error } = await supabase
        .from("citizen_notifications")
        .select("*")
        .eq("voter_id", voterId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching notifications:", error.message);
        return [];
    }
    return data || [];
}

export async function markNotificationRead(notificationId: number): Promise<boolean> {
    const { error } = await supabase
        .from("citizen_notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

    if (error) {
        console.error("Error marking notification read:", error.message);
        return false;
    }
    return true;
}

export async function markAllNotificationsRead(): Promise<boolean> {
    const voterId = await getCurrentVoterId();
    if (!voterId) return false;

    const { error } = await supabase
        .from("citizen_notifications")
        .update({ is_read: true })
        .eq("voter_id", voterId)
        .eq("is_read", false);

    if (error) {
        console.error("Error marking all read:", error.message);
        return false;
    }
    return true;
}

// ─── REALTIME ────────────────────────────────────────────────────

export async function subscribeToNotifications(
    callback: (notification: CitizenNotification) => void
) {
    const voterId = await getCurrentVoterId();
    if (!voterId) return () => {};

    const channel = supabase
        .channel(`citizen-notifications-${voterId}`)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "citizen_notifications",
                filter: `voter_id=eq.${voterId}`,
            },
            (payload) => {
                callback(payload.new as CitizenNotification);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

// ─── DASHBOARD STATS ─────────────────────────────────────────────

export async function getDashboardStats() {
    const voterId = await getCurrentVoterId();
    if (!voterId) return { activeGrievances: 0, activeSchemes: 0, totalUpdates: 0 };

    const [grievancesRes, schemesRes, updatesRes] = await Promise.all([
        supabase
            .from("grievances")
            .select("id", { count: "exact" })
            .eq("voter_id", voterId)
            .neq("status", "resolved"),
        supabase
            .from("voter_scheme_status")
            .select("id", { count: "exact" })
            .eq("voter_id", voterId),
        supabase
            .from("infrastructure_projects")
            .select("id", { count: "exact" })
            .eq("booth_number", "42"), // Should ideally be dynamic too
    ]);

    return {
        activeGrievances: grievancesRes.count || 0,
        activeSchemes: schemesRes.count || 0,
        totalUpdates: updatesRes.count || 0,
    };
}

export async function getBoothWorkers(boothId: number) {
    const { data, error } = await supabase
        .from("profiles")
        .select("id, name, role, status")
        .eq("jurisdiction_id", boothId)
        .eq("jurisdiction_type", "booth")
        .in("role", ["panna-pramukh", "booth-adhyaksh", "manager"]);

    if (error) {
        console.error("Error fetching booth workers:", error.message);
        return [];
    }
    return data;
}

export async function getBoothAnalytics(boothId: number) {
    const { count: resolvedGrievances } = await supabase
        .from("grievances")
        .select("id", { count: "exact", head: true })
        .eq("booth_id", boothId)
        .eq("status", "resolved");

    const { count: totalGrievances } = await supabase
        .from("grievances")
        .select("id", { count: "exact", head: true })
        .eq("booth_id", boothId);

    return {
        resolvedGrievances: resolvedGrievances || 0,
        totalGrievances: totalGrievances || 0,
        resolutionRate: totalGrievances ? Math.round((resolvedGrievances! / totalGrievances!) * 100) : 0,
    };
}
