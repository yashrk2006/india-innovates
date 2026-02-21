import { supabase } from "./supabase";
import type {
    Voter,
    VoterSchemeStatus,
    Grievance,
    InfrastructureProject,
    CitizenNotification,
} from "./types";

// ─── Demo voter ID (voters.id — replace with auth.uid() later) ──
const DEMO_VOTER_ID = 1;

// ─── VOTER PROFILE ───────────────────────────────────────────────
// Joins voters + voters_eci to get both operational + personal data
export async function getVoterProfile(): Promise<Voter | null> {
    const { data, error } = await supabase
        .from("voters")
        .select("*, eci:voters_eci(*)")
        .eq("id", DEMO_VOTER_ID)
        .single();

    if (error) {
        console.error("Error fetching voter profile:", error.message);
        return null;
    }
    return data as Voter;
}

// ─── SCHEMES ─────────────────────────────────────────────────────

export async function getVoterSchemes(): Promise<VoterSchemeStatus[]> {
    const { data, error } = await supabase
        .from("voter_scheme_status")
        .select("*, scheme:schemes(*)")
        .eq("voter_id", DEMO_VOTER_ID)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching voter schemes:", error.message);
        return [];
    }
    return (data || []) as VoterSchemeStatus[];
}

export async function applyToScheme(schemeId: number): Promise<boolean> {
    const { error } = await supabase
        .from("voter_scheme_status")
        .update({ status: "applied", enrolled_at: new Date().toISOString() })
        .eq("voter_id", DEMO_VOTER_ID)
        .eq("scheme_id", schemeId);

    if (error) {
        console.error("Error applying to scheme:", error.message);
        return false;
    }
    return true;
}

// ─── GRIEVANCES ──────────────────────────────────────────────────

export async function getGrievances(): Promise<Grievance[]> {
    const { data, error } = await supabase
        .from("grievances")
        .select("*")
        .eq("voter_id", DEMO_VOTER_ID)
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
    const { data, error } = await supabase
        .from("grievances")
        .insert({
            voter_id: DEMO_VOTER_ID,
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

export async function getInfrastructureProjects(
    boothNumber = 42
): Promise<InfrastructureProject[]> {
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
    const { data, error } = await supabase
        .from("citizen_notifications")
        .select("*")
        .eq("voter_id", DEMO_VOTER_ID)
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
    const { error } = await supabase
        .from("citizen_notifications")
        .update({ is_read: true })
        .eq("voter_id", DEMO_VOTER_ID)
        .eq("is_read", false);

    if (error) {
        console.error("Error marking all read:", error.message);
        return false;
    }
    return true;
}

// ─── REALTIME ────────────────────────────────────────────────────

export function subscribeToNotifications(
    callback: (notification: CitizenNotification) => void
) {
    const channel = supabase
        .channel("citizen-notifications-realtime")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "citizen_notifications",
                filter: `voter_id=eq.${DEMO_VOTER_ID}`,
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
    const [grievancesRes, schemesRes, updatesRes] = await Promise.all([
        supabase
            .from("grievances")
            .select("id", { count: "exact" })
            .eq("voter_id", DEMO_VOTER_ID)
            .neq("status", "resolved"),
        supabase
            .from("voter_scheme_status")
            .select("id", { count: "exact" })
            .eq("voter_id", DEMO_VOTER_ID),
        supabase
            .from("infrastructure_projects")
            .select("id", { count: "exact" })
            .eq("booth_number", 42),
    ]);

    return {
        activeGrievances: grievancesRes.count || 0,
        activeSchemes: schemesRes.count || 0,
        totalUpdates: updatesRes.count || 0,
    };
}
