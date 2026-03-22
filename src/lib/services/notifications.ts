import { createClient } from "@/utils/supabase/client";
import type { CitizenNotification } from "../types";

// ── NOTIFICATION SERVICE ─────────────────────────────────────────

/**
 * Get notifications for a voter.
 */
export async function getNotifications(voterId: number): Promise<CitizenNotification[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("citizen_notifications")
        .select("*")
        .eq("voter_id", voterId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching notifications:", error.message);
        return [];
    }
    return (data || []) as CitizenNotification[];
}

/**
 * Mark a notification as read.
 */
export async function markNotificationRead(notificationId: number): Promise<boolean> {
    const supabase = createClient();
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

/**
 * Mark all notifications as read for a voter.
 */
export async function markAllNotificationsRead(voterId: number): Promise<boolean> {
    const supabase = createClient();
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

/**
 * Subscribe to realtime notifications.
 */
export async function subscribeToNotifications(
    voterId: number,
    callback: (notification: CitizenNotification) => void
) {
    const supabase = createClient();
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
