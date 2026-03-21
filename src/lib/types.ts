// Database types matching production schema (schema.sql)

// ── ECI source of truth — personal data ──────────────────
export interface VoterECI {
    id: number;
    epic_number: string;
    name: string;
    name_local: string | null;
    dob: string | null;
    gender: "M" | "F" | "O" | null;
    phone: string | null;
    address: string | null;
    booth_id: number | null;
    street_id: number | null;
    eci_part_number: string | null;
    serial_number: number | null;
    imported_at: string;
    eci_updated_at: string | null;
}

// ── Operational voter — AI segmentation + preferences ────
export interface Voter {
    id: number;
    eci_voter_id: number | null;
    segment: "farmer" | "youth" | "women" | "businessman" | "senior" | "govt_employee" | "other" | null;
    is_key_voter: boolean;
    key_voter_reason: string | null;
    occupation: string | null;
    education: string | null;
    family_size: number | null;
    languages: string[] | null;
    notif_sms: boolean;
    notif_whatsapp: boolean;
    notif_push: boolean;
    opted_out: boolean;
    opted_out_at: string | null;
    preferred_language: string;
    aadhaar_verified: boolean;
    citizen_portal_active: boolean;
    created_at: string;
    updated_at: string;
    // Joined from voters_eci
    eci?: VoterECI;
}

// ── Schemes ───────────────────────────────────────────────
export interface Scheme {
    id: number;
    name: string;
    program: string | null;
    ministry: string | null;
    description: string | null;
    icon: string;
    benefit_amount: string | null;
    eligibility_criteria: Record<string, unknown> | null;
    apply_url: string | null;
    helpline: string | null;
    active: boolean;
    created_at: string;
}

export interface VoterSchemeStatus {
    id: number;
    voter_id: number;
    scheme_id: number;
    status: "eligible" | "enrolled" | "not_eligible" | "applied";
    enrolled_at: string | null;
    outreach_sent: boolean;
    converted: boolean;
    created_at: string;
    // Joined
    scheme?: Scheme;
}

// ── Grievances ────────────────────────────────────────────
export interface Grievance {
    id: number;
    voter_id: number | null;
    booth_id: number | null;
    category: string;
    title: string | null;
    description: string;
    location: string | null;
    photo_url: string | null;
    status: "submitted" | "assigned" | "in_progress" | "resolved";
    assigned_to: string | null;
    resolved_at: string | null;
    resolution_note: string | null;
    created_at: string;
    updated_at: string;
}

// ── Infrastructure Projects (replaces AreaUpdate) ─────────
export interface InfrastructureProject {
    id: number;
    constituency_id: number | null;
    street_id: number | null;
    type: string | null;           // 'road', 'water', 'electricity', 'drainage', 'health'
    title: string;
    description: string | null;
    govt_project_id: string | null;
    status: "planned" | "in_progress" | "completed";
    icon: string;
    icon_bg: string;
    progress: number;
    before_image_url: string | null;
    after_image_url: string | null;
    likes_count: number;
    comments_count: number;
    booth_number: number | null;
    lat: number | null;
    lng: number | null;
    created_at: string;
}

// ── Citizen Notifications (replaces Notification) ─────────
export interface CitizenNotification {
    id: number;
    voter_id: number;
    title: string;
    body: string;
    icon: string;
    is_read: boolean;
    created_at: string;
}

export type UserRole =
    | 'super_admin'
    | 'party_central'
    | 'state_admin'
    | 'district_admin'
    | 'constituency_admin'
    | 'booth_worker'
    | 'govt_officer'
    | 'eci'
    | 'candidate'
    | 'citizen'
    | 'manager'
    | 'booth-adhyaksh'
    | 'panna-pramukh'
    | 'eci-observer'
    | 'data-analyst'
    | 'party-command';

