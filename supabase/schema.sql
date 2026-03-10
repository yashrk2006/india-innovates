-- =============================================================
-- BoothIQ Production Schema
-- Run this in the Supabase SQL Editor on your Supabase project.
-- Compatible with Supabase Auth (uses auth.users as base).
-- =============================================================


-- ─────────────────────────────────────────────
-- 0-A. TEARDOWN — drop everything from old seed.sql first
--      CASCADE handles dependent foreign keys automatically.
--      IF EXISTS = safe to run even on a fresh project.
-- ─────────────────────────────────────────────

-- Drop tables (reverse dependency order)
DROP TABLE IF EXISTS worker_activity_log        CASCADE;
DROP TABLE IF EXISTS worker_tasks               CASCADE;
DROP TABLE IF EXISTS audit_log                  CASCADE;
DROP TABLE IF EXISTS grievances                 CASCADE;
DROP TABLE IF EXISTS sentiment_records          CASCADE;
DROP TABLE IF EXISTS voter_scheme_status        CASCADE;
DROP TABLE IF EXISTS voter_schemes              CASCADE;   -- old name from seed.sql
DROP TABLE IF EXISTS schemes                    CASCADE;
DROP TABLE IF EXISTS proof_uploads              CASCADE;
DROP TABLE IF EXISTS infrastructure_projects    CASCADE;
DROP TABLE IF EXISTS area_updates               CASCADE;   -- old name from seed.sql
DROP TABLE IF EXISTS campaign_deliveries        CASCADE;
DROP TABLE IF EXISTS citizen_notifications      CASCADE;
DROP TABLE IF EXISTS notifications              CASCADE;   -- old name from seed.sql
DROP TABLE IF EXISTS campaign_content           CASCADE;
DROP TABLE IF EXISTS campaigns                  CASCADE;
DROP TABLE IF EXISTS voter_change_requests      CASCADE;
DROP TABLE IF EXISTS voters                     CASCADE;
DROP TABLE IF EXISTS voters_eci                 CASCADE;
DROP TABLE IF EXISTS streets                    CASCADE;
DROP TABLE IF EXISTS booths                     CASCADE;
DROP TABLE IF EXISTS constituencies             CASCADE;
DROP TABLE IF EXISTS districts                  CASCADE;
DROP TABLE IF EXISTS states                     CASCADE;
DROP TABLE IF EXISTS invitations                CASCADE;
DROP TABLE IF EXISTS profiles                   CASCADE;

-- Drop custom ENUM types (IF EXISTS = safe on fresh project)
DROP TYPE IF EXISTS user_role           CASCADE;
DROP TYPE IF EXISTS user_status         CASCADE;
DROP TYPE IF EXISTS jurisdiction_type   CASCADE;
DROP TYPE IF EXISTS gender_type         CASCADE;
DROP TYPE IF EXISTS voter_segment       CASCADE;
DROP TYPE IF EXISTS change_status       CASCADE;
DROP TYPE IF EXISTS campaign_target     CASCADE;
DROP TYPE IF EXISTS campaign_type       CASCADE;
DROP TYPE IF EXISTS campaign_status     CASCADE;
DROP TYPE IF EXISTS moderation_status   CASCADE;
DROP TYPE IF EXISTS delivery_channel    CASCADE;
DROP TYPE IF EXISTS delivery_status     CASCADE;
DROP TYPE IF EXISTS constituency_type   CASCADE;
DROP TYPE IF EXISTS project_type        CASCADE;
DROP TYPE IF EXISTS project_status      CASCADE;
DROP TYPE IF EXISTS photo_type          CASCADE;
DROP TYPE IF EXISTS upload_status       CASCADE;
DROP TYPE IF EXISTS scheme_voter_status CASCADE;
DROP TYPE IF EXISTS sentiment_source    CASCADE;
DROP TYPE IF EXISTS grievance_category  CASCADE;
DROP TYPE IF EXISTS grievance_status    CASCADE;
DROP TYPE IF EXISTS task_priority       CASCADE;
DROP TYPE IF EXISTS task_status         CASCADE;
DROP TYPE IF EXISTS activity_type       CASCADE;

-- Drop triggers and functions if they exist
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;


-- ─────────────────────────────────────────────
-- 0. ENUM TYPES (must be created before tables)
-- ─────────────────────────────────────────────

CREATE TYPE user_role AS ENUM (
    'super_admin', 'party_central', 'state_admin',
    'district_admin', 'constituency_admin',
    'booth_worker', 'govt_officer', 'eci',
    'candidate', 'citizen'
);

CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending');

CREATE TYPE jurisdiction_type AS ENUM (
    'national', 'state', 'district', 'constituency', 'booth'
);

CREATE TYPE gender_type AS ENUM ('M', 'F', 'O');

CREATE TYPE voter_segment AS ENUM (
    'farmer', 'youth', 'women', 'businessman',
    'senior', 'govt_employee', 'other'
);

CREATE TYPE change_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE campaign_target AS ENUM (
    'all', 'segment', 'key_voters', 'custom'
);

CREATE TYPE campaign_type AS ENUM (
    'scheme_awareness', 'infrastructure_proof',
    'governance', 'event', 'emergency'
);

CREATE TYPE campaign_status AS ENUM (
    'draft', 'pending_approval', 'approved',
    'scheduled', 'live', 'paused', 'flagged', 'archived'
);

CREATE TYPE moderation_status AS ENUM ('pending', 'pass', 'flagged');

CREATE TYPE delivery_channel AS ENUM ('sms', 'whatsapp', 'push');

CREATE TYPE delivery_status AS ENUM (
    'queued', 'sent', 'delivered', 'opened', 'failed', 'opted_out'
);

CREATE TYPE constituency_type AS ENUM ('lok_sabha', 'vidhan_sabha');

CREATE TYPE project_type AS ENUM (
    'road', 'water', 'electricity', 'drainage',
    'school', 'health', 'other'
);

CREATE TYPE project_status AS ENUM ('planned', 'in_progress', 'completed');

CREATE TYPE photo_type AS ENUM ('before', 'after');

CREATE TYPE upload_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TYPE scheme_voter_status AS ENUM (
    'eligible', 'enrolled', 'not_eligible', 'applied'
);

CREATE TYPE sentiment_source AS ENUM (
    'twitter', 'news', 'ground', 'survey'
);

CREATE TYPE grievance_category AS ENUM (
    'road', 'water', 'electricity', 'sanitation',
    'healthcare', 'education', 'other'
);

CREATE TYPE grievance_status AS ENUM (
    'submitted', 'assigned', 'in_progress', 'resolved'
);

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE task_status AS ENUM (
    'pending', 'in_progress', 'completed', 'overdue'
);

CREATE TYPE activity_type AS ENUM (
    'voter_contacted', 'photo_uploaded', 'task_completed',
    'change_request', 'grievance_logged', 'login', 'logout'
);


-- ─────────────────────────────────────────────
-- 1. AUTH — extends Supabase auth.users
--    (No separate sessions table — Supabase JWT handles that)
-- ─────────────────────────────────────────────

CREATE TABLE profiles (
    -- Links 1:1 with the Supabase auth user
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    role            user_role NOT NULL,
    status          user_status DEFAULT 'pending',
    aadhaar_verified BOOLEAN DEFAULT false,
    jurisdiction_id BIGINT,           -- FK set after geography tables are created
    jurisdiction_type jurisdiction_type,
    invited_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Invite system — no public self-registration
CREATE TABLE invitations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token           VARCHAR(64) UNIQUE NOT NULL,
    phone           VARCHAR(10) NOT NULL,
    role            user_role NOT NULL,
    jurisdiction_id BIGINT,
    invited_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    used            BOOLEAN DEFAULT false,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 2. GEOGRAPHY HIERARCHY
-- ─────────────────────────────────────────────

CREATE TABLE states (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(5) UNIQUE NOT NULL,   -- 'UP', 'MH'
    total_booths    INTEGER,
    total_voters    INTEGER,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE districts (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    state_id        BIGINT NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(10),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE constituencies (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    district_id     BIGINT NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    type            constituency_type NOT NULL,
    eci_code        VARCHAR(20) UNIQUE,
    assigned_leader UUID REFERENCES profiles(id) ON DELETE SET NULL,
    total_booths    INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE booths (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    constituency_id BIGINT NOT NULL REFERENCES constituencies(id) ON DELETE CASCADE,
    booth_number    VARCHAR(20) NOT NULL,
    name            VARCHAR(255),
    address         TEXT,
    lat             DECIMAL(10,8),
    lng             DECIMAL(11,8),
    total_voters    INTEGER DEFAULT 0,
    assigned_worker UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE streets (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    booth_id        BIGINT NOT NULL REFERENCES booths(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    ward            VARCHAR(100),
    voter_count     INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Now that booths exist, add the jurisdiction FK on profiles
ALTER TABLE profiles
    ADD CONSTRAINT fk_profiles_jurisdiction_booth
    FOREIGN KEY (jurisdiction_id) REFERENCES booths(id) ON DELETE SET NULL
    NOT VALID;   -- NOT VALID = don't scan existing rows, future inserts are checked


-- ─────────────────────────────────────────────
-- 3. VOTERS
-- ─────────────────────────────────────────────

-- ECI source of truth — READ ONLY — never directly edited by workers
CREATE TABLE voters_eci (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    epic_number     VARCHAR(20) UNIQUE NOT NULL,
    name            VARCHAR(255) NOT NULL,
    name_local      VARCHAR(255),           -- regional language
    dob             DATE,
    gender          gender_type,
    phone           VARCHAR(10),
    address         TEXT,
    booth_id        BIGINT REFERENCES booths(id) ON DELETE SET NULL,
    street_id       BIGINT REFERENCES streets(id) ON DELETE SET NULL,
    eci_part_number VARCHAR(20),
    serial_number   INTEGER,
    imported_at     TIMESTAMPTZ DEFAULT now(),
    eci_updated_at  TIMESTAMPTZ
);

-- Operational layer — AI segmentation + enrichment
CREATE TABLE voters (
    id                    BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    eci_voter_id          BIGINT UNIQUE REFERENCES voters_eci(id) ON DELETE CASCADE,
    profile_id            UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL, -- Link for citizen portal login

    -- AI segmentation
    segment               voter_segment,
    is_key_voter          BOOLEAN DEFAULT false,
    key_voter_reason      TEXT,

    -- Enrichment
    occupation            VARCHAR(255),
    education             VARCHAR(100),
    family_size           INTEGER,
    languages             TEXT[],         -- ['hindi','bhojpuri']

    -- Notification preferences
    notif_sms             BOOLEAN DEFAULT true,
    notif_whatsapp        BOOLEAN DEFAULT false,
    notif_push            BOOLEAN DEFAULT false,
    opted_out             BOOLEAN DEFAULT false,
    opted_out_at          TIMESTAMPTZ,
    preferred_language    VARCHAR(20) DEFAULT 'hi',

    -- Status
    aadhaar_verified      BOOLEAN DEFAULT false,
    citizen_portal_active BOOLEAN DEFAULT false,

    created_at            TIMESTAMPTZ DEFAULT now(),
    updated_at            TIMESTAMPTZ DEFAULT now()
);

-- All field changes go through requests — never direct edits
CREATE TABLE voter_change_requests (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    voter_id        BIGINT NOT NULL REFERENCES voters(id) ON DELETE CASCADE,
    requested_by    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    field_name      VARCHAR(100) NOT NULL,
    old_value       TEXT,
    new_value       TEXT NOT NULL,
    reason          TEXT,
    status          change_status DEFAULT 'pending',
    reviewed_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMPTZ,
    ai_anomaly_flag BOOLEAN DEFAULT false,
    ai_confidence   DECIMAL(5,2),
    created_at      TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 4. CAMPAIGNS & NOTIFICATIONS
-- ─────────────────────────────────────────────

CREATE TABLE campaigns (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name            VARCHAR(255) NOT NULL,
    created_by      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    constituency_id BIGINT REFERENCES constituencies(id) ON DELETE SET NULL,

    -- Targeting
    segments        TEXT[],             -- ['farmer','youth']
    target_type     campaign_target,
    estimated_reach INTEGER,

    -- Content
    type            campaign_type,
    theme           TEXT,               -- national theme from party central

    -- Status & Approval
    status          campaign_status DEFAULT 'draft',
    flagged_reason  TEXT,
    approved_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at     TIMESTAMPTZ,
    scheduled_at    TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- One content record per segment per campaign
CREATE TABLE campaign_content (
    id                  BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    campaign_id         BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    segment             VARCHAR(50),
    language            VARCHAR(20) NOT NULL,
    body_text           TEXT NOT NULL,
    ai_generated        BOOLEAN DEFAULT true,
    moderation_status   moderation_status DEFAULT 'pending',
    moderation_reason   TEXT,
    created_at          TIMESTAMPTZ DEFAULT now()
);

-- Individual delivery records (renamed from 'notifications' to avoid clash with citizen alerts)
CREATE TABLE campaign_deliveries (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    campaign_id     BIGINT REFERENCES campaigns(id) ON DELETE SET NULL,
    voter_id        BIGINT REFERENCES voters(id) ON DELETE CASCADE,
    channel         delivery_channel,
    language        VARCHAR(20),
    status          delivery_status DEFAULT 'queued',
    sent_at         TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    opened_at       TIMESTAMPTZ,
    failure_reason  TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Citizen-facing real-time alerts (retained from citizen portal)
CREATE TABLE citizen_notifications (
    id          BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    voter_id    BIGINT NOT NULL REFERENCES voters(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    body        TEXT NOT NULL,
    icon        VARCHAR(100) DEFAULT 'notifications',
    is_read     BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 5. BEFORE & AFTER PROOF SYSTEM
-- ─────────────────────────────────────────────

CREATE TABLE infrastructure_projects (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    constituency_id BIGINT REFERENCES constituencies(id) ON DELETE SET NULL,
    street_id       BIGINT REFERENCES streets(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    type            project_type,
    description     TEXT,
    govt_project_id VARCHAR(100),       -- cross-reference with govt DB
    status          project_status DEFAULT 'planned',

    -- Citizen portal fields (compatible with area_updates)
    icon            VARCHAR(100) DEFAULT 'construction',
    icon_bg         VARCHAR(100) DEFAULT 'bg-stone-100',
    progress        INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    before_image_url TEXT,
    after_image_url  TEXT,
    likes_count     INTEGER DEFAULT 0,
    comments_count  INTEGER DEFAULT 0,
    booth_number    INTEGER,

    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE proof_uploads (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    project_id      BIGINT NOT NULL REFERENCES infrastructure_projects(id) ON DELETE CASCADE,
    uploaded_by     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    photo_type      photo_type NOT NULL,

    -- File
    storage_url     TEXT NOT NULL,
    file_size       INTEGER,

    -- GPS metadata
    gps_lat         DECIMAL(10,8),
    gps_lng         DECIMAL(11,8),
    gps_accuracy    DECIMAL(8,2),
    captured_at     TIMESTAMPTZ,
    device_info     JSONB,

    -- AI analysis
    ai_description  TEXT,
    ai_verified     BOOLEAN DEFAULT false,
    gps_match       BOOLEAN,
    reverse_search_flag BOOLEAN DEFAULT false,  -- copied image detection

    -- Approval
    status          upload_status DEFAULT 'pending',
    verified_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at     TIMESTAMPTZ,
    rejection_reason TEXT,

    -- Notification tracking
    notification_sent    BOOLEAN DEFAULT false,
    notification_sent_at TIMESTAMPTZ,
    voters_notified      INTEGER DEFAULT 0,

    created_at      TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 6. GOVERNMENT SCHEMES
-- ─────────────────────────────────────────────

CREATE TABLE schemes (
    id                  BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    myscheme_id         VARCHAR(100) UNIQUE,    -- from MyScheme API
    name                VARCHAR(255) NOT NULL,
    ministry            VARCHAR(255),
    description         TEXT,
    eligibility_criteria JSONB,
    benefit_amount      VARCHAR(255),
    apply_url           TEXT,
    helpline            VARCHAR(20),

    -- Citizen portal display fields
    icon                VARCHAR(100) DEFAULT 'description',
    program             VARCHAR(255),

    active              BOOLEAN DEFAULT true,
    last_synced         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE voter_scheme_status (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    voter_id        BIGINT NOT NULL REFERENCES voters(id) ON DELETE CASCADE,
    scheme_id       BIGINT NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    status          scheme_voter_status DEFAULT 'eligible',
    enrolled_at     TIMESTAMPTZ,
    outreach_sent   BOOLEAN DEFAULT false,
    outreach_sent_at TIMESTAMPTZ,
    converted       BOOLEAN DEFAULT false,    -- enrolled after outreach
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(voter_id, scheme_id)
);


-- ─────────────────────────────────────────────
-- 7. SENTIMENT & GRIEVANCES
-- ─────────────────────────────────────────────

CREATE TABLE sentiment_records (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    constituency_id BIGINT REFERENCES constituencies(id) ON DELETE SET NULL,
    source          sentiment_source,
    score           DECIMAL(5,2) CHECK (score BETWEEN 0 AND 100),
    dominant_issue  VARCHAR(255),
    issues          JSONB,          -- { "roads": 0.4, "water": 0.2 }
    raw_count       INTEGER,
    recorded_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE grievances (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    voter_id        BIGINT REFERENCES voters(id) ON DELETE SET NULL,
    booth_id        BIGINT REFERENCES booths(id) ON DELETE SET NULL,
    category        grievance_category DEFAULT 'other',
    title           VARCHAR(255),
    description     TEXT NOT NULL,
    location        TEXT,
    photo_url       TEXT,
    status          grievance_status DEFAULT 'submitted',
    assigned_to     UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolved_at     TIMESTAMPTZ,
    resolution_note TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 8. WORKER MANAGEMENT
-- ─────────────────────────────────────────────

CREATE TABLE worker_tasks (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    assigned_to     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_by     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    booth_id        BIGINT REFERENCES booths(id) ON DELETE SET NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    due_date        DATE,
    priority        task_priority DEFAULT 'medium',
    status          task_status DEFAULT 'pending',
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE worker_activity_log (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    worker_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_type   activity_type NOT NULL,
    reference_id    BIGINT,               -- ID of the related record (any table)
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);


-- ─────────────────────────────────────────────
-- 9. AUDIT LOG (Immutable — enforce via RLS)
-- ─────────────────────────────────────────────

CREATE TABLE audit_log (
    id              BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_role       user_role,
    action          VARCHAR(100) NOT NULL,
    resource_type   VARCHAR(100),
    resource_id     BIGINT,
    old_value       JSONB,
    new_value       JSONB,
    ip_address      INET,
    risk_score      DECIMAL(5,2),
    tamper_hash     VARCHAR(64),        -- SHA-256 of entire row for integrity
    created_at      TIMESTAMPTZ DEFAULT now()
);
-- Enforce immutability: no one can UPDATE or DELETE audit rows
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_insert_only_update ON audit_log FOR UPDATE USING (false);
CREATE POLICY audit_insert_only_delete ON audit_log FOR DELETE USING (false);


-- ─────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

-- Voters: booth workers see only their assigned booth
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters_eci ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Demo (Allowing 'anon' to read data for development)
------------------------------------------------------------------

-- Voters
CREATE POLICY voters_public_read ON voters FOR SELECT USING (true);
CREATE POLICY voters_eci_public_read ON voters_eci FOR SELECT USING (true);

-- Schemes
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY schemes_public_read ON schemes FOR SELECT USING (true);

ALTER TABLE voter_scheme_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY voter_scheme_status_public_read ON voter_scheme_status FOR SELECT USING (true);
CREATE POLICY voter_scheme_status_public_update ON voter_scheme_status FOR UPDATE USING (true);

-- Projects
ALTER TABLE infrastructure_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY infrastructure_projects_public_read ON infrastructure_projects FOR SELECT USING (true);
CREATE POLICY infrastructure_projects_public_update ON infrastructure_projects FOR UPDATE USING (true);

-- Grievances
CREATE POLICY grievances_public_read ON grievances FOR SELECT USING (true);
CREATE POLICY grievances_public_insert ON grievances FOR INSERT WITH CHECK (true);

-- Notifications
CREATE POLICY citizen_notifications_public_read ON citizen_notifications FOR SELECT USING (true);
CREATE POLICY citizen_notifications_public_update ON citizen_notifications FOR UPDATE USING (true);


-- (Keep existing specific policies below for future reference)
CREATE POLICY voters_eci_booth_worker ON voters_eci
    FOR SELECT USING (
        booth_id IN (
            SELECT id FROM booths WHERE assigned_worker = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin','party_central','state_admin',
                         'district_admin','constituency_admin','eci')
        )
    );

CREATE POLICY voters_citizen_own ON voters
    FOR ALL USING (
        profile_id = auth.uid()
    );

CREATE POLICY voters_booth_worker ON voters
    FOR SELECT USING (
        eci_voter_id IN (
            SELECT id FROM voters_eci
            WHERE booth_id IN (
                SELECT id FROM booths WHERE assigned_worker = auth.uid()
            )
        )
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin','party_central','state_admin',
                         'district_admin','constituency_admin','eci')
        )
    );

-- Citizens see only their own notifications
CREATE POLICY citizen_notifications_own ON citizen_notifications
    FOR ALL USING (
        voter_id IN (
            SELECT id FROM voters
            WHERE profile_id = auth.uid()
        )
    );

-- Grievances: citizens see their own; workers see their booth's
CREATE POLICY grievances_access ON grievances
    FOR SELECT USING (
        booth_id IN (
            SELECT id FROM booths WHERE assigned_worker = auth.uid()
        )
        OR voter_id IN (
            SELECT id FROM voters
            WHERE citizen_portal_active = true
        )
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin','district_admin','constituency_admin','eci')
        )
    );


-- ─────────────────────────────────────────────
-- 11. PERFORMANCE INDEXES
-- ─────────────────────────────────────────────

CREATE INDEX idx_voters_eci_booth      ON voters_eci(booth_id);
CREATE INDEX idx_voters_eci_segment    ON voters(segment);
CREATE INDEX idx_voters_opted_out      ON voters(opted_out);
CREATE INDEX idx_voters_key            ON voters(is_key_voter);
CREATE INDEX idx_deliveries_status     ON campaign_deliveries(status);
CREATE INDEX idx_deliveries_campaign   ON campaign_deliveries(campaign_id);
CREATE INDEX idx_audit_user            ON audit_log(user_id);
CREATE INDEX idx_audit_created         ON audit_log(created_at DESC);
CREATE INDEX idx_campaigns_status      ON campaigns(status);
CREATE INDEX idx_grievances_status     ON grievances(status);
CREATE INDEX idx_grievances_booth      ON grievances(booth_id);
CREATE INDEX idx_sentiment_const       ON sentiment_records(constituency_id, recorded_at DESC);
CREATE INDEX idx_projects_constituency ON infrastructure_projects(constituency_id);
CREATE INDEX idx_projects_booth_number ON infrastructure_projects(booth_number);
CREATE INDEX idx_profiles_role         ON profiles(role);


-- ─────────────────────────────────────────────
-- 12. HELPER: auto-update `updated_at`
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER voters_updated_at
    BEFORE UPDATE ON voters
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER grievances_updated_at
    BEFORE UPDATE ON grievances
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ─────────────────────────────────────────────
-- 13. STORAGE BUCKETS (run separately or via Supabase Dashboard)
-- ─────────────────────────────────────────────
-- INSERT INTO storage.buckets (id, name, public) VALUES ('proof-photos', 'proof-photos', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('grievance-photos', 'grievance-photos', true);
