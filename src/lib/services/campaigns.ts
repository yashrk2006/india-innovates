import { supabase } from "../supabase";

// ── CAMPAIGN SERVICE ─────────────────────────────────────────────

export interface Campaign {
    id: number;
    name: string;
    created_by: string;
    constituency_id: number | null;
    segments: string[] | null;
    target_type: string | null;
    estimated_reach: number | null;
    type: string | null;
    theme: string | null;
    status: string;
    flagged_reason: string | null;
    approved_by: string | null;
    approved_at: string | null;
    scheduled_at: string | null;
    sent_at: string | null;
    created_at: string;
}

/**
 * List campaigns, optionally filtered by status.
 */
export async function getCampaigns(status?: string): Promise<Campaign[]> {
    let query = supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching campaigns:", error.message);
        return [];
    }
    return (data || []) as Campaign[];
}

/**
 * Create a new campaign.
 */
export async function createCampaign(campaign: {
    name: string;
    created_by: string;
    constituency_id?: number;
    segments?: string[];
    target_type?: string;
    estimated_reach?: number;
    type?: string;
    theme?: string;
    scheduled_at?: string;
}): Promise<Campaign | null> {
    const { data, error } = await supabase
        .from("campaigns")
        .insert({
            name: campaign.name,
            created_by: campaign.created_by,
            constituency_id: campaign.constituency_id || null,
            segments: campaign.segments || null,
            target_type: campaign.target_type || "all",
            estimated_reach: campaign.estimated_reach || null,
            type: campaign.type || "event",
            theme: campaign.theme || null,
            status: "draft",
            scheduled_at: campaign.scheduled_at || null,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating campaign:", error.message);
        return null;
    }
    return data as Campaign;
}

/**
 * Update campaign status (approve, schedule, pause, etc.).
 */
export async function updateCampaignStatus(
    id: number,
    status: string,
    extras?: { approved_by?: string; flagged_reason?: string }
): Promise<Campaign | null> {
    const updates: Record<string, unknown> = { status };
    if (status === "approved" && extras?.approved_by) {
        updates.approved_by = extras.approved_by;
        updates.approved_at = new Date().toISOString();
    }
    if (status === "flagged" && extras?.flagged_reason) {
        updates.flagged_reason = extras.flagged_reason;
    }
    if (status === "live") {
        updates.sent_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from("campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating campaign:", error.message);
        return null;
    }
    return data as Campaign;
}

/**
 * Get campaign delivery stats.
 */
export async function getCampaignDeliveryStats(campaignId: number) {
    const { data, error } = await supabase
        .from("campaign_deliveries")
        .select("status")
        .eq("campaign_id", campaignId);

    if (error) {
        console.error("Error fetching delivery stats:", error.message);
        return { total: 0, sent: 0, delivered: 0, opened: 0, failed: 0 };
    }

    const rows = data || [];
    return {
        total: rows.length,
        sent: rows.filter(r => r.status === "sent").length,
        delivered: rows.filter(r => r.status === "delivered").length,
        opened: rows.filter(r => r.status === "opened").length,
        failed: rows.filter(r => r.status === "failed").length,
    };
}

/**
 * Get infrastructure projects for a constituency.
 */
export async function getInfrastructureProjects(constituencyId: number) {
    const { data, error } = await supabase
        .from("infrastructure_projects")
        .select("*")
        .eq("constituency_id", constituencyId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching infrastructure projects:", error.message);
        return [];
    }
    return data;
}

/**
 * Toggle like for an infrastructure project.
 */
export async function toggleLikeProject(projectId: number, voterId: number): Promise<boolean> {
    const { data, error } = await supabase.rpc("toggle_project_like", {
        p_project_id: projectId,
        p_voter_id: voterId
    });

    if (error) {
        console.error("Error toggling project like:", error.message);
        return false;
    }
    return !!data;
}

/**
 * Get comments for an infrastructure project.
 */
export async function getProjectComments(projectId: number) {
    const { data, error } = await supabase
        .from("infrastructure_project_comments")
        .select(`
            *,
            voter:voters(
                id,
                eci:voters_eci(name)
            )
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching project comments:", error.message);
        return [];
    }
    return data;
}

/**
 * Add a comment to an infrastructure project.
 */
export async function addProjectComment(projectId: number, voterId: number, text: string) {
    const { data, error } = await supabase
        .from("infrastructure_project_comments")
        .insert({
            project_id: projectId,
            voter_id: voterId,
            comment_text: text
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding project comment:", error.message);
        return null;
    }
    return data;
}

/**
 * Create a new infrastructure project (Manifesto Item).
 */
export async function createInfrastructureProject(project: {
    title: string;
    description: string;
    type: string;
    constituency_id: number;
    booth_number?: number;
    status?: string;
    progress?: number;
    icon?: string;
    icon_bg?: string;
    before_image_url?: string;
    after_image_url?: string;
}) {
    const { data, error } = await supabase
        .from("infrastructure_projects")
        .insert([project])
        .select()
        .single();

    if (error) {
        console.error("Error creating infrastructure project:", error.message);
        return null;
    }
    return data;
}

