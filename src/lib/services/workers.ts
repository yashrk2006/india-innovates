import { supabase } from "../supabase";

// ── WORKER SERVICE ───────────────────────────────────────────────

export interface WorkerProfile {
    id: string;  // UUID
    name: string;
    role: string;
    status: string;
    jurisdiction_id: number | null;
    last_login: string | null;
    created_at: string;
}

export interface WorkerWithStats extends WorkerProfile {
    booth?: { id: number; booth_number: string; name: string | null } | null;
    task_count?: number;
    completed_tasks?: number;
    activity_count?: number;
}

export interface WorkerTask {
    id: number;
    assigned_to: string;
    assigned_by: string;
    booth_id: number | null;
    title: string;
    description: string | null;
    due_date: string | null;
    priority: "low" | "medium" | "high" | "urgent";
    status: "pending" | "in_progress" | "completed" | "overdue";
    completed_at: string | null;
    created_at: string;
}

export interface WorkerActivity {
    id: number;
    worker_id: string;
    activity_type: string;
    reference_id: number | null;
    notes: string | null;
    created_at: string;
}

/**
 * List all workers (profiles with role = 'booth_worker').
 */
export async function getWorkers(boothId?: number): Promise<WorkerProfile[]> {
    let query = supabase
        .from("profiles")
        .select("*")
        .eq("role", "booth_worker")
        .order("name", { ascending: true });

    if (boothId) {
        query = query.eq("jurisdiction_id", boothId);
    }

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching workers:", error.message);
        return [];
    }
    return (data || []) as WorkerProfile[];
}

/**
 * Get worker stats summary.
 */
export async function getWorkerStats() {
    const workers = await getWorkers();
    const total = workers.length;
    const active = workers.filter(w => w.status === "active").length;
    const pending = workers.filter(w => w.status === "pending").length;

    return { total, active, pending, suspended: total - active - pending };
}

/**
 * List tasks for a worker, or all tasks if no workerId.
 */
export async function getWorkerTasks(workerId?: string, status?: string): Promise<WorkerTask[]> {
    let query = supabase
        .from("worker_tasks")
        .select("*")
        .order("created_at", { ascending: false });

    if (workerId) query = query.eq("assigned_to", workerId);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching worker tasks:", error.message);
        return [];
    }
    return (data || []) as WorkerTask[];
}

/**
 * Create a new task for a worker.
 */
export async function createWorkerTask(task: {
    assigned_to: string;
    assigned_by: string;
    booth_id?: number;
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high" | "urgent";
}): Promise<WorkerTask | null> {
    const { data, error } = await supabase
        .from("worker_tasks")
        .insert({
            assigned_to: task.assigned_to,
            assigned_by: task.assigned_by,
            booth_id: task.booth_id || null,
            title: task.title,
            description: task.description || null,
            due_date: task.due_date || null,
            priority: task.priority || "medium",
            status: "pending",
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating task:", error.message);
        return null;
    }
    return data as WorkerTask;
}

/**
 * Update task status.
 */
export async function updateTaskStatus(
    taskId: number,
    status: "pending" | "in_progress" | "completed" | "overdue"
): Promise<WorkerTask | null> {
    const updates: Record<string, unknown> = { status };
    if (status === "completed") {
        updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from("worker_tasks")
        .update(updates)
        .eq("id", taskId)
        .select()
        .single();

    if (error) {
        console.error("Error updating task:", error.message);
        return null;
    }
    return data as WorkerTask;
}

/**
 * Log a worker activity.
 */
export async function logWorkerActivity(activity: {
    worker_id: string;
    activity_type: string;
    reference_id?: number;
    notes?: string;
}): Promise<WorkerActivity | null> {
    const { data, error } = await supabase
        .from("worker_activity_log")
        .insert({
            worker_id: activity.worker_id,
            activity_type: activity.activity_type,
            reference_id: activity.reference_id || null,
            notes: activity.notes || null,
        })
        .select()
        .single();

    if (error) {
        console.error("Error logging activity:", error.message);
        return null;
    }
    return data as WorkerActivity;
}

/**
 * Get recent activity log entries.
 */
export async function getActivityLog(workerId?: string, limit = 50): Promise<WorkerActivity[]> {
    let query = supabase
        .from("worker_activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (workerId) query = query.eq("worker_id", workerId);

    const { data, error } = await query;
    if (error) {
        console.error("Error fetching activity log:", error.message);
        return [];
    }
    return (data || []) as WorkerActivity[];
}
