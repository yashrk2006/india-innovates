import { supabase } from "../supabase";

// ── REPORTS & STATS SERVICE ──────────────────────────────────────

/**
 * Get role-based dashboard KPIs / stats.
 */
export async function getDashboardStats(filters?: { role?: string; voterId?: string | number; boothId?: number }) {
    // Queries for KPI data with optional filtering
    let grievanceQuery = supabase.from("grievances").select("id, status", { count: "exact" });
    let schemeQuery = supabase.from("voter_scheme_status").select("id", { count: "exact" });
    let campaignQuery = supabase.from("campaigns").select("id", { count: "exact" });

    if (filters?.voterId) {
        grievanceQuery = grievanceQuery.eq("voter_id", filters.voterId);
        schemeQuery = schemeQuery.eq("voter_id", filters.voterId);
    }

    if (filters?.boothId) {
        // If we want booth specific stats, we filter accordingly
        // For simple citizen dashboard, we might want their specific stats
    }

    const [boothRes, voterRes, workerRes, grievanceRes, schemeRes, campaignRes] = await Promise.all([
        supabase.from("booths").select("id", { count: "exact" }),
        supabase.from("voters").select("id", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }).eq("role", "booth_worker"),
        grievanceQuery,
        schemeQuery,
        campaignQuery,
    ]);

    // Grievance breakdown
    const grievances = grievanceRes.data || [];
    const unresolvedGrievances = grievances.filter((g: any) => g.status !== "resolved").length;
    const activeGrievances = grievances.filter((g: any) => g.status === "open" || g.status === "pending").length;

    return {
        totalBooths: boothRes.count || 0,
        totalVoters: voterRes.count || 0,
        totalWorkers: workerRes.count || 0,
        totalGrievances: grievanceRes.count || 0,
        unresolvedGrievances,
        activeGrievances,
        activeSchemes: schemeRes.count || 0,
        totalSchemeEnrollments: schemeRes.count || 0,
        totalCampaigns: campaignRes.count || 0,
        totalUpdates: campaignRes.count || 0,
    };
}

/**
 * Get audit log entries.
 */
export async function getAuditLog(filters?: {
    userId?: string;
    action?: string;
    resourceType?: string;
    limit?: number;
}) {
    let query = supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(filters?.limit || 100);

    if (filters?.userId) query = query.eq("user_id", filters.userId);
    if (filters?.action) query = query.eq("action", filters.action);
    if (filters?.resourceType) query = query.eq("resource_type", filters.resourceType);

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching audit log:", error.message);
        return [];
    }
    return data || [];
}

/**
 * Insert an audit log entry.
 */
export async function logAuditEvent(event: {
    user_id?: string;
    user_role?: string;
    action: string;
    resource_type?: string;
    resource_id?: number;
    old_value?: Record<string, unknown>;
    new_value?: Record<string, unknown>;
}) {
    const { error } = await supabase
        .from("audit_log")
        .insert({
            user_id: event.user_id || null,
            user_role: event.user_role || null,
            action: event.action,
            resource_type: event.resource_type || null,
            resource_id: event.resource_id || null,
            old_value: event.old_value || null,
            new_value: event.new_value || null,
        });

    if (error) {
        console.error("Error logging audit event:", error.message);
    }
}

/**
 * Get activity summary for a date range.
 */
export async function getActivitySummary(days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
        .from("worker_activity_log")
        .select("activity_type, created_at")
        .gte("created_at", since.toISOString());

    if (error) {
        console.error("Error fetching activity summary:", error.message);
        return { total: 0, byType: {}, byDay: {} };
    }

    const rows = data || [];
    const byType: Record<string, number> = {};
    const byDay: Record<string, number> = {};

    for (const row of rows) {
        byType[row.activity_type] = (byType[row.activity_type] || 0) + 1;
        const day = new Date(row.created_at).toISOString().slice(0, 10);
        byDay[day] = (byDay[day] || 0) + 1;
    }

    return { total: rows.length, byType, byDay };
}
