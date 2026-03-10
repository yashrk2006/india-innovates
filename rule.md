# ANTIGRAVITY — FULL DEVELOPER BRIEFING
## AI-Driven Booth Management System
### India Innovates 2026 · Bharat Mandapam · March 28–29

---

> ⚠️ READ THIS ENTIRE DOCUMENT BEFORE TOUCHING ANY CODE.
> Do NOT start building until the team lead gives you the explicit go-ahead prompt.
> Do NOT change the design even by 1px. Pixel-perfect implementation only.
> Auth is the LAST thing you build. Do not touch it until told.

---

## TABLE OF CONTENTS

1. Project Overview & Vision
2. Problem Statement (Official)
3. Complete Solution Architecture
4. Ethical Safeguards & Loopholes Addressed
5. Full Tech Stack
6. Database Architecture (PostgreSQL + Neo4j)
7. AI Models & Why Each Was Chosen
8. Role Hierarchy (8 User Types)
9. File & Folder Structure (Web + App)
10. Design System Rules — DO NOT CHANGE
11. How Designs Will Be Delivered to You
12. Page-by-Page Build Order
13. Animations & Transitions Specification
14. API Architecture
15. Scale Strategy (150 Crore Population)
16. Notification & Data Flow
17. Demo Day Strategy
18. What NOT to Build Yet (Auth)

---

---

# 1. PROJECT OVERVIEW & VISION

**What this is:**
An AI-powered political constituency management platform that transforms a static Excel voter list into a living, breathing "Knowledge Graph." It helps elected leaders (MLAs, MPs) understand every voter in their constituency at a granular level and communicate with them personally — at scale — in their own language, with verified proof of governance work.

**One line pitch:**
"We turned a static Excel voter list into a living intelligence graph. Our AI knows every voter's occupation, schemes they're enrolled in, and what development happened on their street — and delivers them a personalized, proof-backed message in their own language."

**Competition:**
India Innovates 2026 — Bharat Mandapam, New Delhi
Domain: Data Mining & Processing
Problem Statement: AI-Driven Booth Management System

**Demo date:** March 28–29, 2026
**Venue:** Bharat Mandapam, New Delhi

---

# 2. PROBLEM STATEMENT (OFFICIAL)

Develop an AI-Driven Booth Management System that transforms static voter lists into a living "Knowledge Graph." The system must enable hyper-local targeting by categorizing every voter at a booth level and delivering personalized governance updates directly to their devices.

**Key Objectives from the brief:**

**Intelligent Segmentation:** Automatically classify booth data into segments like Youth, Businessmen, Farmers, and Women to identify "Key Voters."

**Hyper-Local Content Delivery:** A precision engine to send tailored information (e.g., startup schemes for youth, subsidies for farmers) via automated, personalized channels.

**Micro-Accountability Mapping:** If a specific street (Gali) gets a new road or streetlight, the system must trigger a notification with "Before & After" proof only to the residents of that specific street.

**Beneficiary Linkage:** Track and map government scheme beneficiaries (e.g., Ayushman Bharat) within the booth to strengthen the leader-citizen bond.

---

# 3. COMPLETE SOLUTION ARCHITECTURE

The system has 12 complete modules:

## MODULE 1 — Authentication & Role System
Multi-role auth with 8 completely different user types. Each role sees a different UI, different data, different permissions. Role enforced at DB level (Supabase RLS), not just frontend. Auth is LAST — do not build until told.

## MODULE 2 — Voter Data Management
Two-layer database: ECI Source of Truth (read-only), Operational Layer (where updates happen). No direct edits — everything goes through Change Request → AI Check → Approval Queue → Write to DB.

## MODULE 3 — AI Voter Segmentation Engine
scikit-learn KMeans for bulk clustering. Llama 3.1 70B via Groq for intelligent edge-case classification. Segments: Youth (18-35), Farmers, Businessmen, Women, Senior Citizens, Government Employees, Key Voters (influencers).

## MODULE 4 — Knowledge Graph
Neo4j AuraDB (free tier) as graph database. React Flow for frontend visualization. Nodes: Voter, Booth, Street/Gali, Government Scheme, Infrastructure Project, Leader. Interactive — click any node to expand connections.

## MODULE 5 — Notification Engine
Campaign creation → AI content generation (Llama via Groq) → Content moderation filter (mDeBERTa) → Multilingual translation (Bhashini) → Delivery via SMS (Twilio), WhatsApp (WA Business API), Push (Firebase FCM).

## MODULE 6 — Before & After Proof System
Booth worker uploads Before + After photos. LLaVA vision model (via Groq) analyzes and generates description. Photo metadata verification (GPS, timestamp, reverse image check). Notification sent ONLY to residents of that specific street.

## MODULE 7 — Beneficiary Tracking & Scheme Linkage
MyScheme API integration (myscheme.gov.in — free, official). Cross-references every voter against scheme eligibility. Shows who is eligible but not enrolled. Sends outreach notifications automatically.

## MODULE 8 — Party Worker Management
Ground worker profiles, area assignments, task management, daily activity logging, performance dashboards, leaderboard, broadcast communication.

## MODULE 9 — Sentiment Analysis Engine
Sources: Twitter/X API, news RSS feeds, ground feedback, citizen grievances. mDeBERTa-v3 for multilingual sentiment classification. Constituency + booth-level heatmaps. Alert system for sudden sentiment drops.

## MODULE 10 — ECI Oversight Dashboard
Read-only. National map with activity indicators. Live campaign monitor. Full audit log. Platform Freeze button (two-step confirmation). Exportable compliance reports.

## MODULE 11 — Ethics & Security Layer (woven into every module)
Content moderation on all notifications. Immutable append-only audit log. Statistical anomaly detection. Four-eyes approval for high-risk actions. Role-based access at DB level. AES-256 encryption at rest. JWT tokens with 4-hour expiry. Rate limiting on all endpoints.

## MODULE 12 — Mobile PWA for Booth Workers
Progressive Web App. Offline capability — works without internet, syncs when connected. 5 core screens. Large buttons, high contrast, works in sunlight, budget Android phone optimized.

---

# 4. ETHICAL SAFEGUARDS & LOOPHOLES ADDRESSED

These must be visible in the UI as features — they are selling points, not footnotes.

## Problem: Data Manipulation by Workers
**Solution:** Nobody can directly edit voter records. Every change is a "Change Request" that goes through: Staging Layer → AI Integrity Check → AI Anomaly Check → AI Content Check → Approval Queue → Human Review (mandatory reason) → Four-Eyes (second approver for bulk) → Write to DB → Immutable Audit Log → Citizen SMS notification.

## Problem: Fake Before & After Photos
**Solution:** GPS metadata must match street coordinates within 100m. Timestamp must be recent. Google Vision API reverse image check (is this photo stolen from internet?). Cross-reference with government project databases (data.gov.in). If any check fails → blocked automatically.

## Problem: Targeting Opposition Voters
**Solution:** Hard-coded rule in the system — no segment can be created called "Opposition Voters." Notification content cannot mention rival political parties. Content moderation filter catches and blocks this automatically.

## Problem: False Scheme Claims
**Solution:** All scheme information is pulled live from the official MyScheme Government API. The system cannot fabricate scheme details — it only displays what the government's own API returns.

## Problem: Communal or Hate Speech in Notifications
**Solution:** mDeBERTa-v3 model runs on every notification before admin even sees it. Checks for hate speech, communal language, false claims, opposition targeting. If flagged → blocked + reason shown + sent to ECI oversight feed.

## Problem: Data Privacy (Political Data is Sensitive)
**Solution:** All voter personal data encrypted at rest (AES-256). Data is jurisdictionally sharded — a Varanasi admin cannot see UP's full voter data. Citizens can see their own record and request deletion (GDPR-style). No data leaves to OpenAI or Google — all AI runs on Groq (open source models) or local Ollama.

## Problem: Who Approves What
**Solution:** Strict four-eyes principle. Nobody approves their own requests. Bulk changes (50+ voters) require second approver. ECI oversight can see everything in real time. All approvals are permanently logged with timestamp, user ID, reason.

## Problem: Token/API Limits
**Solution:** Three-layer fallback: Claude/Groq → Llama 3.1 on Groq → Phi-3.5 Mini on local Ollama. Response caching — same campaign type generates once and reuses. Demo day: all responses pre-cached night before.

---

# 5. FULL TECH STACK

## Frontend (Web)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Charts:** Recharts
- **Graph Visualization:** React Flow (Knowledge Graph)
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **State:** Zustand
- **HTTP Client:** Axios + React Query

## Frontend (Mobile)
- **Type:** Progressive Web App (PWA) — same Next.js codebase
- **PWA Library:** next-pwa
- **Offline:** Service Workers + IndexedDB for local cache
- **Mobile-specific:** Separate mobile layout components in /app/mobile

## Backend
- **Framework:** Python + FastAPI
- **Task Queue:** Celery + Redis (background AI jobs)
- **API Validation:** Pydantic
- **CORS & Middleware:** FastAPI middleware stack
- **Testing:** Pytest

## Databases
- **Primary DB:** Supabase (PostgreSQL 15)
- **Graph DB:** Neo4j AuraDB (free tier)
- **Cache:** Redis (Upstash free tier)
- **File Storage:** Cloudflare R2 (free tier) for Before/After photos

## AI Models (All Open Source — No Data Leaves)
- **Core Intelligence:** Llama 3.1 70B via Groq API (free)
- **Voter Segmentation:** Llama 3.1 70B + scikit-learn KMeans
- **Knowledge Graph Reasoning:** Mixtral 8x7B via Groq API (free)
- **Indian Language Translation:** Bhashini API (government, free)
- **Image Analysis:** LLaVA via Groq (free)
- **Sentiment & Content Moderation:** mDeBERTa-v3 via HuggingFace (local)
- **Embeddings:** nomic-embed-text via Ollama (local)
- **Local Fallback (no internet):** Phi-3.5 Mini via Ollama

## Third-Party Services (All Free Tier)
- **SMS:** Twilio (free trial credits)
- **Push Notifications:** Firebase FCM (free)
- **WhatsApp:** WhatsApp Business API
- **Auth:** NextAuth.js + Supabase Auth
- **Deployment Frontend:** Vercel (free)
- **Deployment Backend:** Railway (free tier)
- **Government APIs:** MyScheme API (free), Bhashini (free), data.gov.in (free)

## Development Tools
- **Code:** Cursor AI
- **UI Generation:** v0.dev + Stitch
- **Version Control:** GitHub
- **Project Management:** Notion or Linear

---

# 6. DATABASE ARCHITECTURE

## PostgreSQL (Supabase) — Primary Database

### Table: constituencies
```
id (uuid, primary key)
name (text)
state (text)
total_booths (int)
total_voters (int)
mp_mla_user_id (uuid, FK → users)
created_at (timestamp)
```

### Table: booths
```
id (uuid, primary key)
constituency_id (uuid, FK → constituencies)
booth_number (text)
location_name (text)
latitude (decimal)
longitude (decimal)
total_voters (int)
worker_id (uuid, FK → users)
created_at (timestamp)
```

### Table: voters
```
id (uuid, primary key)
booth_id (uuid, FK → booths)
eci_voter_id (text, unique) ← SOURCE OF TRUTH, NEVER EDITABLE
full_name (text) ← ECI data
age (int) ← ECI data
gender (text) ← ECI data
address_street (text) ← ECI data
address_gali (text) ← operational layer
address_block (text) ← operational layer
occupation (text) ← user-submitted
income_bracket (text) ← user-submitted
phone (text) ← user-submitted, encrypted
language_preference (text)
segment (text) ← AI-assigned: youth/farmer/women/business/senior/govt
is_key_voter (boolean) ← AI-identified
scheme_ids (text[]) ← array of enrolled scheme IDs
data_source (text) ← 'eci_official' or 'user_submitted'
created_at (timestamp)
updated_at (timestamp)
```

### Table: change_requests
```
id (uuid, primary key)
voter_id (uuid, FK → voters)
requested_by (uuid, FK → users)
field_name (text) ← which field they want to change
old_value (text)
new_value (text)
reason (text)
status (text) ← pending/approved/rejected/escalated
reviewed_by (uuid, FK → users)
review_reason (text) ← MANDATORY
ai_check_passed (boolean)
ai_check_flags (jsonb) ← what AI flagged
created_at (timestamp)
reviewed_at (timestamp)
```

### Table: audit_log (APPEND ONLY — NO UPDATES, NO DELETES EVER)
```
id (bigserial, primary key)
user_id (uuid)
user_role (text)
action_type (text)
entity_type (text)
entity_id (text)
old_value (jsonb)
new_value (jsonb)
ip_address (text)
device_info (text)
approved_by (uuid[]) ← array of approver IDs
created_at (timestamp) ← IMMUTABLE
```

### Table: campaigns
```
id (uuid, primary key)
constituency_id (uuid)
created_by (uuid, FK → users)
title (text)
campaign_type (text) ← scheme_awareness/infrastructure/general/event
target_segments (text[])
target_booths (uuid[])
target_streets (text[])
content_hi (text) ← Hindi version
content_en (text) ← English version
content_ta (text) ← Tamil, etc.
ai_generated (boolean)
moderation_passed (boolean)
moderation_flags (jsonb)
status (text) ← draft/pending_approval/approved/sent/failed
approved_by (uuid)
sent_at (timestamp)
total_recipients (int)
delivered_count (int)
opened_count (int)
created_at (timestamp)
```

### Table: infrastructure_projects
```
id (uuid, primary key)
constituency_id (uuid)
booth_id (uuid)
street_name (text)
gali_name (text)
project_type (text) ← road/streetlight/drain/school/hospital/other
description (text)
before_photo_url (text)
after_photo_url (text)
before_photo_metadata (jsonb) ← GPS, timestamp, hash
after_photo_metadata (jsonb)
ai_description (text) ← LLaVA-generated description
photo_verified (boolean)
photo_verified_by (uuid)
notification_sent (boolean)
residents_notified (int)
completed_date (date)
submitted_by (uuid)
created_at (timestamp)
```

### Table: scheme_enrollments
```
id (uuid, primary key)
voter_id (uuid, FK → voters)
scheme_id (text) ← from MyScheme API
scheme_name (text)
enrolled (boolean)
enrollment_date (date)
verified (boolean)
source (text) ← 'myscheme_api' or 'booth_worker'
created_at (timestamp)
```

### Table: worker_tasks
```
id (uuid, primary key)
assigned_to (uuid, FK → users)
assigned_by (uuid, FK → users)
constituency_id (uuid)
booth_id (uuid)
title (text)
description (text)
task_type (text) ← doorstep/event/report/survey
target_street (text)
target_count (int)
completed_count (int)
status (text) ← pending/in_progress/completed
due_date (date)
completed_at (timestamp)
created_at (timestamp)
```

### Table: sentiment_feeds
```
id (uuid, primary key)
constituency_id (uuid)
booth_id (uuid, nullable)
source (text) ← twitter/news/ground_feedback/grievance
content (text)
language (text)
sentiment (text) ← positive/negative/neutral
sentiment_score (decimal) ← -1.0 to 1.0
key_issues (text[])
processed_at (timestamp)
created_at (timestamp)
```

### Table: users
```
id (uuid, primary key)
email (text, unique)
phone (text, encrypted)
full_name (text)
role (text) ← super_admin/party_central/state_admin/district_admin/constituency_admin/booth_worker/govt_employee/eci/citizen
constituency_id (uuid, nullable)
booth_id (uuid, nullable)
state (text, nullable)
district (text, nullable)
is_active (boolean)
verified (boolean)
verification_documents (jsonb) ← encrypted
aadhaar_verified (boolean)
invited_by (uuid, nullable)
last_login (timestamp)
created_at (timestamp)
```

## Neo4j AuraDB — Knowledge Graph

### Node Labels:
```
(:Voter {id, name, segment, isKeyVoter, boothId})
(:Booth {id, number, constituency})
(:Street {id, name, boothId, galiName})
(:Scheme {id, name, ministry, category})
(:Project {id, type, street, completedDate})
(:Leader {id, name, role, constituency})
(:Segment {id, name}) ← Youth, Farmer, Women etc.
```

### Relationship Types:
```
(:Voter)-[:LIVES_ON]->(:Street)
(:Voter)-[:BELONGS_TO]->(:Booth)
(:Voter)-[:ENROLLED_IN]->(:Scheme)
(:Voter)-[:CLASSIFIED_AS]->(:Segment)
(:Voter)-[:INFLUENCES]->(:Voter) ← Key Voter network
(:Street)-[:PART_OF]->(:Booth)
(:Street)-[:HAS_PROJECT]->(:Project)
(:Leader)-[:REPRESENTS]->(:Booth)
(:Scheme)-[:TARGETS]->(:Segment)
```

---

# 7. AI MODELS & WHY EACH WAS CHOSEN

| Function | Model | Provider | Reason |
|---|---|---|---|
| Core Intelligence & Notifications | Llama 3.1 70B | Groq (free) | Best open-source LLM, rivals GPT-4, 800 tokens/sec on Groq |
| Knowledge Graph Reasoning | Mixtral 8x7B | Groq (free) | Best for structured reasoning and relationship extraction |
| Indian Language Translation | IndicTrans2 + Bhashini | HuggingFace + Govt API | Best open-source Indian language model, 22 Indian languages |
| Image Analysis (Before/After) | LLaVA | Groq (free) | Best open-source vision model, runs via Groq |
| Sentiment & Content Moderation | mDeBERTa-v3 | HuggingFace local | Multilingual, excellent classification, runs on CPU |
| Embeddings | nomic-embed-text | Ollama local | Best open-source embeddings, tiny, fast |
| Local Emergency Fallback | Phi-3.5 Mini | Ollama local | Runs in 3GB RAM on any laptop, no internet needed |
| Bulk Segmentation | scikit-learn KMeans | Local Python | Fast, no AI cost, handles thousands of voters instantly |

**Hardware Note:** The developer's machine is an HP Victus 15 — Ryzen 5 5600H, 8GB RAM, RX 6500M 4GB VRAM (AMD — ROCm unreliable). Heavy models run on Groq cloud (free). Only lightweight models (Phi-3.5 Mini, nomic-embed, mDeBERTa) run locally via Ollama on CPU.

---

# 8. ROLE HIERARCHY (8 USER TYPES)

Each role has COMPLETELY DIFFERENT UI. Not just different data — different layout, color scheme, navigation, complexity. This is critical.

## Role 1: Super Admin (Platform Owner — Your Team)
- **Access:** Full system, all data, all controls
- **Cannot see:** Individual voter personal data directly
- **UI:** Dark mission control — navy + red, monospace fonts, live audit logs, system health
- **Device:** Desktop only

## Role 2: Party Central Admin (National HQ)
- **Access:** National aggregate data, campaign approval, state management
- **Cannot do:** Directly message voters, access individual voter records
- **UI:** Executive dashboard — dark navy + gold, Playfair Display, national state heatmaps
- **Device:** Desktop primary

## Role 3: State Admin
- **Access:** All constituencies in their state, district management, state campaigns
- **Cannot do:** Access other states' data
- **UI:** State-level map + sentiment trend — blue accent
- **Device:** Desktop primary, tablet secondary

## Role 4: District Admin
- **Access:** All booths in district, Before/After verification queue, worker management
- **Cannot do:** Send notifications, access state-level data
- **UI:** Verification queue + worker performance — green accent
- **Device:** Desktop + tablet

## Role 5: Constituency Admin (MLA/MP) — PRIMARY USER
- **Access:** Full constituency intelligence, Knowledge Graph, campaigns, accountability
- **Cannot do:** Access neighboring constituencies, bypass content moderation
- **UI:** Richest dashboard — 4 tabs: Intelligence/Campaigns/Accountability/Schemes — amber accent
- **Device:** Desktop + tablet + mobile (simplified mobile view)

## Role 6: Booth Worker
- **Access:** Their assigned booth only, voter update requests, photo uploads, task completion
- **Cannot do:** Send notifications, approve anything, see other booths
- **UI:** Mobile-first PWA, 5 big action buttons, purple accent, minimal text
- **Device:** Mobile ONLY (budget Android)

## Role 7: Government Employee (DM, BDO, Welfare Officer)
- **Access:** Scheme enrollment data, infrastructure completion data, governance metrics ONLY
- **Cannot see:** Political campaigns, voter segments, notification history, party data
- **UI:** COMPLETELY DIFFERENT — light theme, official government aesthetic, tricolor header, no political features visible
- **Device:** Desktop primary

## Role 8: ECI Oversight
- **Access:** Read-only view of EVERYTHING, Platform Freeze button, audit logs
- **Cannot do:** Edit anything, send anything, interfere with campaigns
- **UI:** Dark authority aesthetic — deep navy + red, constitutional feel
- **Device:** Desktop only

---

# 9. FILE & FOLDER STRUCTURE

## Complete Project Structure (Web + App Combined)

```
booth-management-system/
│
├── apps/
│   ├── web/                          ← Next.js web application
│   └── api/                          ← FastAPI backend
│
├── packages/
│   ├── ui/                           ← Shared UI components
│   └── types/                        ← Shared TypeScript types
│
└── docs/                             ← Documentation

```

## Web App Structure (apps/web/)

```
apps/web/
│
├── app/                              ← Next.js App Router
│   │
│   ├── (auth)/                       ← Auth pages (BUILD LAST)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── verify/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/                  ← All role dashboards
│   │   ├── layout.tsx                ← Shared dashboard layout
│   │   │
│   │   ├── super-admin/              ← Role: Super Admin
│   │   │   ├── page.tsx              ← Main dashboard
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── audit-log/
│   │   │   │   └── page.tsx
│   │   │   └── system-health/
│   │   │       └── page.tsx
│   │   │
│   │   ├── party-central/            ← Role: Party Central Admin
│   │   │   ├── page.tsx
│   │   │   ├── states/
│   │   │   │   └── page.tsx
│   │   │   └── campaigns/
│   │   │       └── page.tsx
│   │   │
│   │   ├── state-admin/              ← Role: State Admin
│   │   │   ├── page.tsx
│   │   │   ├── districts/
│   │   │   │   └── page.tsx
│   │   │   └── sentiment/
│   │   │       └── page.tsx
│   │   │
│   │   ├── district-admin/           ← Role: District Admin
│   │   │   ├── page.tsx
│   │   │   ├── verification/
│   │   │   │   └── page.tsx
│   │   │   └── workers/
│   │   │       └── page.tsx
│   │   │
│   │   ├── constituency/             ← Role: MLA/MP (PRIMARY)
│   │   │   ├── page.tsx              ← Main dashboard (4 tabs)
│   │   │   ├── knowledge-graph/
│   │   │   │   └── page.tsx          ← Neo4j graph visualization
│   │   │   ├── campaigns/
│   │   │   │   ├── page.tsx          ← Campaign list
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx      ← Create campaign with AI
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      ← Campaign detail + analytics
│   │   │   ├── accountability/
│   │   │   │   ├── page.tsx          ← Before/After list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── schemes/
│   │   │   │   └── page.tsx          ← Scheme coverage tracker
│   │   │   ├── voters/
│   │   │   │   ├── page.tsx          ← Voter list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      ← Individual voter profile
│   │   │   └── sentiment/
│   │   │       └── page.tsx
│   │   │
│   │   ├── govt-officer/             ← Role: Government Employee
│   │   │   ├── page.tsx
│   │   │   ├── schemes/
│   │   │   │   └── page.tsx
│   │   │   └── infrastructure/
│   │   │       └── page.tsx
│   │   │
│   │   └── eci/                      ← Role: ECI Oversight
│   │       ├── page.tsx
│   │       ├── campaigns/
│   │       │   └── page.tsx
│   │       ├── audit/
│   │       │   └── page.tsx
│   │       └── flags/
│   │           └── page.tsx
│   │
│   ├── (mobile)/                     ← Mobile PWA routes (Booth Worker)
│   │   ├── layout.tsx                ← Mobile-specific layout
│   │   ├── home/
│   │   │   └── page.tsx
│   │   ├── voter-update/
│   │   │   └── page.tsx
│   │   ├── photo-upload/
│   │   │   └── page.tsx
│   │   ├── report-issue/
│   │   │   └── page.tsx
│   │   ├── mark-contacted/
│   │   │   └── page.tsx
│   │   └── tasks/
│   │       └── page.tsx
│   │
│   ├── citizen/                      ← Citizen-facing portal
│   │   ├── page.tsx                  ← Verify via Aadhaar OTP
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── schemes/
│   │   │   └── page.tsx
│   │   └── area-updates/
│   │       └── page.tsx
│   │
│   ├── api/                          ← Next.js API routes (thin layer, proxies to FastAPI)
│   │   └── [...proxy]/
│   │       └── route.ts
│   │
│   ├── globals.css                   ← Global styles (design tokens)
│   ├── layout.tsx                    ← Root layout
│   └── page.tsx                      ← Landing / role redirect
│
├── components/                       ← Reusable components
│   │
│   ├── ui/                           ← shadcn/ui base components (DO NOT MODIFY)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ... (all shadcn components)
│   │
│   ├── charts/                       ← Chart components
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── DonutChart.tsx
│   │   ├── HeatMap.tsx
│   │   └── SentimentGauge.tsx
│   │
│   ├── graph/                        ← Knowledge Graph components
│   │   ├── KnowledgeGraph.tsx        ← Main React Flow component
│   │   ├── nodes/
│   │   │   ├── VoterNode.tsx
│   │   │   ├── BoothNode.tsx
│   │   │   ├── SchemeNode.tsx
│   │   │   ├── StreetNode.tsx
│   │   │   └── ProjectNode.tsx
│   │   └── GraphControls.tsx
│   │
│   ├── notifications/                ← Notification components
│   │   ├── CampaignCreator.tsx
│   │   ├── ContentPreview.tsx
│   │   ├── SegmentSelector.tsx
│   │   └── DeliveryAnalytics.tsx
│   │
│   ├── voters/                       ← Voter management components
│   │   ├── VoterCard.tsx
│   │   ├── ChangeRequestForm.tsx
│   │   ├── ApprovalQueue.tsx
│   │   └── SegmentBadge.tsx
│   │
│   ├── layout/                       ← Layout components
│   │   ├── Sidebar.tsx               ← Role-specific sidebar
│   │   ├── TopBar.tsx
│   │   ├── MobileSidebar.tsx
│   │   └── RoleBadge.tsx
│   │
│   └── shared/                       ← Shared across all views
│       ├── KPICard.tsx
│       ├── StatusDot.tsx
│       ├── Badge.tsx
│       ├── SectionTitle.tsx
│       ├── ProgressBar.tsx
│       ├── AuditLogRow.tsx
│       └── LoadingState.tsx
│
├── lib/                              ← Utility libraries
│   ├── supabase.ts                   ← Supabase client
│   ├── neo4j.ts                      ← Neo4j driver
│   ├── groq.ts                       ← Groq API client
│   ├── bhashini.ts                   ← Bhashini API client
│   ├── myscheme.ts                   ← MyScheme API client
│   ├── firebase.ts                   ← Firebase FCM client
│   ├── twilio.ts                     ← Twilio SMS client
│   └── redis.ts                      ← Upstash Redis client
│
├── hooks/                            ← Custom React hooks
│   ├── useVoters.ts
│   ├── useCampaigns.ts
│   ├── useSegments.ts
│   ├── useGraph.ts
│   ├── useNotifications.ts
│   └── useAuditLog.ts
│
├── store/                            ← Zustand global state
│   ├── userStore.ts
│   ├── constituencyStore.ts
│   └── notificationStore.ts
│
├── types/                            ← TypeScript interfaces
│   ├── voter.ts
│   ├── campaign.ts
│   ├── user.ts
│   ├── scheme.ts
│   └── graph.ts
│
├── config/                           ← Configuration
│   ├── roles.ts                      ← Role definitions + permissions
│   ├── segments.ts                   ← Segment definitions
│   └── routes.ts                     ← Route → role mapping
│
├── public/
│   ├── manifest.json                 ← PWA manifest
│   ├── icons/                        ← App icons (all sizes)
│   └── offline.html                  ← Offline fallback page
│
├── middleware.ts                     ← Next.js middleware (route protection by role)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Backend Structure (apps/api/)

```
apps/api/
│
├── main.py                           ← FastAPI app entry point
├── requirements.txt
│
├── routers/                          ← API route handlers
│   ├── voters.py
│   ├── campaigns.py
│   ├── segmentation.py
│   ├── knowledge_graph.py
│   ├── notifications.py
│   ├── infrastructure.py
│   ├── schemes.py
│   ├── sentiment.py
│   ├── workers.py
│   ├── audit.py
│   └── eci.py
│
├── services/                         ← Business logic
│   ├── ai/
│   │   ├── groq_client.py            ← Groq API wrapper
│   │   ├── segmentation.py           ← scikit-learn + Llama segmentation
│   │   ├── content_generator.py      ← Notification content AI
│   │   ├── content_moderator.py      ← mDeBERTa moderation
│   │   ├── image_analyzer.py         ← LLaVA photo analysis
│   │   ├── sentiment_analyzer.py     ← mDeBERTa sentiment
│   │   ├── fallback_chain.py         ← Model fallback logic
│   │   └── cache.py                  ← AI response caching
│   │
│   ├── notifications/
│   │   ├── sms.py                    ← Twilio SMS
│   │   ├── push.py                   ← Firebase FCM
│   │   ├── whatsapp.py               ← WhatsApp API
│   │   └── dispatcher.py             ← Multi-channel fallback
│   │
│   ├── graph/
│   │   ├── neo4j_client.py
│   │   ├── graph_builder.py          ← Build/update graph from voter data
│   │   └── graph_queries.py          ← Common Cypher queries
│   │
│   ├── data/
│   │   ├── voter_pipeline.py         ← Voter data ingestion
│   │   ├── scheme_sync.py            ← MyScheme API sync
│   │   ├── change_request.py         ← Change request workflow
│   │   └── anomaly_detector.py       ← Statistical anomaly detection
│   │
│   └── translation/
│       ├── bhashini.py
│       └── language_detector.py
│
├── models/                           ← Pydantic models
│   ├── voter.py
│   ├── campaign.py
│   ├── notification.py
│   └── user.py
│
├── db/                               ← Database clients
│   ├── supabase.py
│   ├── neo4j.py
│   └── redis.py
│
├── tasks/                            ← Celery background tasks
│   ├── celery_app.py
│   ├── segmentation_tasks.py
│   ├── notification_tasks.py
│   ├── sentiment_tasks.py
│   └── graph_sync_tasks.py
│
├── middleware/                       ← FastAPI middleware
│   ├── auth.py                       ← JWT validation
│   ├── rate_limiter.py
│   ├── audit_logger.py               ← Auto-log all actions
│   └── anomaly_checker.py
│
├── scripts/                          ← Utility scripts
│   ├── generate_synthetic_data.py    ← Generate 500 fake voters
│   ├── seed_database.py
│   ├── build_initial_graph.py
│   └── cache_demo_responses.py       ← Pre-cache demo night before
│
└── tests/
    ├── test_segmentation.py
    ├── test_notifications.py
    └── test_graph.py
```

---

# 10. DESIGN SYSTEM RULES — DO NOT CHANGE A SINGLE PIXEL

The design has been finalized. You must implement it exactly as given. No design decisions — only engineering decisions.

## Typography (EXACT — DO NOT SUBSTITUTE)
- **Display/Headings:** Playfair Display (Google Fonts) — weights 400, 600, 700, 900
- **Monospace/Data/Labels:** DM Mono (Google Fonts) — weights 300, 400, 500
- **Body/Reading text:** Literata (Google Fonts) — weights 300, 400, 600, italic variants
- **NEVER USE:** Inter, Roboto, Arial, system-ui, Space Grotesk, or any other font

## Color Tokens (globals.css — exact values)
```css
:root {
  --navy:     #080d1a;   /* Page background */
  --navy2:    #0d1528;   /* Card background */
  --navy3:    #111e35;   /* Elevated card */
  --gold:     #c9a84c;   /* Primary accent */
  --gold2:    #e8c56a;   /* Lighter gold */
  --gold-dim: rgba(201,168,76,0.15); /* Gold tint bg */
  --white:    #f0ece3;   /* Primary text */
  --white2:   rgba(240,236,227,0.7);  /* Secondary text */
  --white3:   rgba(240,236,227,0.25); /* Muted text */
  --white4:   rgba(240,236,227,0.08); /* Subtle bg */
  --red:      #d64045;
  --green:    #2a9d62;
  --blue:     #2563c4;
  --amber:    #d97706;
  --border:   rgba(201,168,76,0.18);  /* All borders */
}
```

## Role Accent Colors (DO NOT CHANGE)
```
Super Admin:        #c0392b (deep red)
Party Central:      #c9a84c (gold)
State Admin:        #2563c4 (blue)
District Admin:     #2a9d62 (green)
Constituency Admin: #d97706 (amber)
Booth Worker:       #7c3aed (purple)
Govt Officer:       #065f46 (dark green — light theme)
ECI:                #9f1239 (crimson)
```

## Component Rules
- All border-radius: 2px (not rounded, not pill — exactly 2px)
- All cards: background var(--white4), border 1px solid var(--border)
- All labels: DM Mono, 9px, letter-spacing 2.5px, text-transform uppercase
- All section titles: gold color, 10px DM Mono, with SVG icon left
- No emojis anywhere — only SVG icons (Lucide icon set)
- Buttons: borderRadius 2px, font DM Mono, letter-spacing 1px, uppercase
- Top accent line on role dashboards: 3px solid role_accent color

## Govt Officer Exception
This role uses a LIGHT theme only:
- Background: #f5f0e8
- Card background: #f9fafb
- Border: #e5e7eb
- Text: #1a1a1a / #374151 / #9ca3af
- Header: tricolor gradient strip (saffron/white/green)

---

# 11. HOW DESIGNS WILL BE DELIVERED TO YOU

## The Workflow:

1. Team lead generates a page design in **Stitch** (AI design tool)
2. Stitch exports the design as a **ZIP file**
3. Team lead sends you the ZIP file with a message like: "Here is the [Page Name] design"
4. You open the ZIP, look at the design
5. You implement it EXACTLY as shown — no creative decisions, no "improvements"
6. After implementing, you confirm: "Done. Ready for next page."

## ZIP File Contents (What Stitch Exports):
```
design-[page-name].zip
├── index.html          ← Visual reference (look at this to understand layout)
├── assets/
│   ├── images/         ← Any images/icons used
│   └── fonts/          ← Font files (ignore — use Google Fonts instead)
└── styles.css          ← CSS reference (use as reference, not copy-paste)
```

## How to Read a Stitch Design:
- Open index.html in browser → this is what the page should look like
- Do NOT copy the HTML/CSS directly — it will be messy
- Instead, rebuild it in Next.js + Tailwind matching the visual exactly
- Use the design as a pixel-perfect reference, not as source code

## File Naming Convention (CRITICAL — EXACT):
When team lead says "Here is the Constituency Dashboard design":
- You create: `app/(dashboard)/constituency/page.tsx`
- When they say "Here is the Knowledge Graph page design":
- You create: `app/(dashboard)/constituency/knowledge-graph/page.tsx`
- Always confirm file path after creation so team lead knows where it is

## What to Ask Before Building Each Page:
"Ready for [Page Name]. What data does this page need from the API? Should I use mock data or connect to backend?"

## Current Status Tracking:
After each page, update this section:

### Pages Received & Built:
- [ ] Constituency Dashboard (main)
- [ ] Knowledge Graph
- [ ] Campaign List
- [ ] Create Campaign
- [ ] Before & After List
- [ ] Scheme Coverage
- [ ] Voter List
- [ ] Voter Profile
- [ ] Super Admin Dashboard
- [ ] Party Central Dashboard
- [ ] State Admin Dashboard
- [ ] District Admin Dashboard
- [ ] Booth Worker Home (mobile)
- [ ] Booth Worker — Update Voter (mobile)
- [ ] Booth Worker — Photo Upload (mobile)
- [ ] Booth Worker — Tasks (mobile)
- [ ] Govt Officer Dashboard
- [ ] ECI Oversight Dashboard
- [ ] Citizen Portal
- [ ] Auth Pages (DO LAST)

---

# 12. PAGE-BY-PAGE BUILD ORDER

Build in this exact order. Do not jump ahead.

## Phase 1: Foundation (First)
1. Set up Next.js 14 project with Tailwind + shadcn/ui
2. Install all dependencies (React Flow, Recharts, Framer Motion, Zustand)
3. Set up global CSS with all design tokens
4. Create shared component library (KPICard, Badge, SectionTitle, ProgressBar, LineChart, DonutChart)
5. Create sidebar layout for each role
6. Set up Supabase client + environment variables
7. Create TypeScript types for all data models

## Phase 2: Constituency Admin (Core User — Build First)
8. Constituency main dashboard (4 tabs)
9. Knowledge Graph page
10. Campaign list page
11. Create Campaign page
12. Before & After list page
13. Scheme coverage page
14. Voter list page
15. Voter profile page

## Phase 3: Supporting Roles
16. Super Admin dashboard
17. ECI Oversight dashboard
18. District Admin dashboard
19. State Admin dashboard
20. Party Central dashboard
21. Govt Officer dashboard (light theme — completely different)

## Phase 4: Mobile PWA (Booth Worker)
22. Set up PWA configuration (next-pwa, manifest.json, service worker)
23. Booth Worker home screen
24. Update Voter form
25. Photo Upload (Before & After)
26. Report Issue
27. Mark Voter Contacted
28. Tasks screen
29. Citizen Portal

## Phase 5: Backend
30. FastAPI setup + all routers
31. Supabase schema + migrations
32. Neo4j graph schema
33. AI services (Groq, mDeBERTa, LLaVA)
34. Notification services (Twilio, FCM)
35. Bhashini translation integration
36. MyScheme API integration
37. Background tasks (Celery)
38. Synthetic data generation script

## Phase 6: Auth (DO LAST — Wait for instruction)
39. NextAuth.js setup
40. Login pages (different per role)
41. Registration flows
42. Aadhaar sandbox OTP
43. Document upload verification
44. Middleware route protection

---

# 13. ANIMATIONS & TRANSITIONS SPECIFICATION

All animations use **Framer Motion**. No CSS animations except where specified.

## Page Transitions
```tsx
// Every page wraps content in this

```

## KPI Cards — Staggered Reveal
```tsx
// Cards appear one by one with 80ms delay between each

```

## Progress Bars — Grow from Left
```tsx
// Width animates from 0 to target on mount

```

## Numbers — Count Up on Mount
```tsx
// Use a custom useCountUp hook
// Numbers animate from 0 to final value over 1.5 seconds
```

## Tab Switching
```tsx
// AnimatePresence for tab content

  
```

## Knowledge Graph Nodes
- Nodes fade in with staggered delay (50ms between each)
- Edges draw in after all nodes appear
- Hover: node scales to 1.1, shadow intensifies
- Click: node pulses, connected nodes highlight, unconnected nodes dim

## Buttons
- Hover: translateY(-1px), brightness(1.15) — CSS transition 180ms
- Active: translateY(0)
- Loading state: spinner replaces icon, text fades

## Sidebar Navigation
- Active item: gold left border (3px) slides in from left with spring animation
- Hover: background fades in at 200ms

## Status Dots (Live indicators)
- Green operational: gentle pulse glow animation (2s infinite)
- Red critical: fast pulse (1s infinite)
- Amber warning: slower pulse (3s infinite)

## Line Charts
- Line draws itself from left to right on mount (SVG stroke-dashoffset animation)
- Data points appear after line completes
- Duration: 1.5 seconds total

## Card Hover (All cards)
```tsx
// Subtle lift — do not go overboard
whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}
transition={{ duration: 0.2 }}
```

## Notification Toast
- Slides in from top-right
- Auto-dismiss after 4 seconds
- Dismiss animation: slide out right

## Shimmer Loading States
- Gold shimmer sweeping left to right on loading cards
- CSS: ::after pseudo-element with keyframe animation
- Duration: 2 seconds, infinite

## Role Switcher (Demo/Dev)
- Pill slides to active position (layoutId shared between pills)
- Content cross-fades with 200ms AnimatePresence

---

# 14. API ARCHITECTURE

## Base URLs
```
Frontend (Next.js):  https://bms.vercel.app
Backend (FastAPI):   https://bms-api.railway.app
```

## API Route Pattern
All routes follow: `/api/v1/{resource}/{action}`

## Key Endpoints

### Voters
```
GET  /api/v1/voters?booth_id=&segment=&search=
GET  /api/v1/voters/{id}
POST /api/v1/voters/change-request
GET  /api/v1/voters/change-requests?status=pending
PUT  /api/v1/voters/change-requests/{id}/approve
PUT  /api/v1/voters/change-requests/{id}/reject
```

### Campaigns
```
GET  /api/v1/campaigns?constituency_id=&status=
POST /api/v1/campaigns/generate    ← AI generates content
POST /api/v1/campaigns
PUT  /api/v1/campaigns/{id}/approve
POST /api/v1/campaigns/{id}/send
GET  /api/v1/campaigns/{id}/analytics
```

### Knowledge Graph
```
GET  /api/v1/graph/constituency/{id}    ← Full graph data
GET  /api/v1/graph/booth/{id}           ← Booth subgraph
GET  /api/v1/graph/voter/{id}           ← Voter connections
POST /api/v1/graph/rebuild              ← Trigger graph rebuild
```

### Segmentation
```
POST /api/v1/segment/run?booth_id=      ← Run AI segmentation
GET  /api/v1/segment/results/{booth_id}
GET  /api/v1/segment/key-voters/{booth_id}
```

### Infrastructure (Before/After)
```
GET  /api/v1/infrastructure?constituency_id=
POST /api/v1/infrastructure           ← Upload project
POST /api/v1/infrastructure/{id}/verify-photos
PUT  /api/v1/infrastructure/{id}/approve
POST /api/v1/infrastructure/{id}/notify ← Send street notification
```

### Schemes
```
GET  /api/v1/schemes/eligible?voter_id=     ← Check eligibility
GET  /api/v1/schemes/coverage?booth_id=     ← Coverage stats
GET  /api/v1/schemes/gaps?booth_id=         ← Unenrolled eligible voters
POST /api/v1/schemes/outreach?booth_id=     ← Send enrollment notifications
```

### Sentiment
```
GET  /api/v1/sentiment?constituency_id=&days=7
GET  /api/v1/sentiment/booth/{id}
GET  /api/v1/sentiment/issues?constituency_id=
POST /api/v1/sentiment/analyze             ← Analyze new content
```

### ECI
```
GET  /api/v1/eci/overview
GET  /api/v1/eci/campaigns?status=live
GET  /api/v1/eci/flags
GET  /api/v1/eci/audit?from=&to=&user=
POST /api/v1/eci/freeze?constituency_id=   ← FREEZE ACTION
POST /api/v1/eci/unfreeze?constituency_id=
```

---

# 15. SCALE STRATEGY (150 CRORE POPULATION)

When judges ask "how does this scale to India's entire population?" — the answer must be understood by the developer so the architecture reflects it.

## Core Principle: Jurisdictional Sharding
Data is NEVER stored as one national database. It is physically separated by constituency. A Varanasi admin only touches Varanasi data. UP's 80 constituencies never mix data. The "national view" is only aggregate numbers flowing upward.

## Database Sharding
- One Supabase project per state (or per region of states)
- Constituency data partitioned within each state DB
- National aggregates stored separately — no individual voter data
- At constituency scale (max 3L voters per constituency) — PostgreSQL handles this trivially

## Notification Scale
- Kafka message queue for notification dispatch (not direct API calls)
- Batch processing: 1,000 voters per Firebase API call, not 1 per call
- AI generates per segment (6 calls), not per voter (3L calls)
- Pre-generate and cache all campaign content before dispatch

## Caching
- Redis caches all dashboard queries (5-minute TTL)
- All AI responses cached by campaign type + constituency
- Demo day: 100% cached responses, zero live AI calls

## Fallback Chain (always in this order)
```
Groq API (Llama 3.1 70B) → Groq (Mixtral) → Local Ollama (Phi-3.5) → Static cache
```

---

# 16. NOTIFICATION & DATA FLOW

## Complete Flow: Voter Update (Change Request)

```
Booth Worker submits change → 
Staging table (NOT main DB) → 
AI: Integrity Check (contradicts ECI data?) → 
AI: Anomaly Check (too many requests from this user?) → 
AI: Content Check (malicious intent?) → 
PASS → Approval Queue for Constituency Admin → 
Admin reviews + types mandatory reason → 
High-risk (bulk 50+)? → Second approver required →
APPROVED → Write to main voters table → 
Immutable audit_log entry created →
ECI dashboard notified (if sensitive) →
Voter receives SMS: "Your profile was updated..."
```

## Complete Flow: Before & After Notification

```
Booth worker uploads Before + After photos →
System extracts GPS metadata from photos →
GPS vs street coordinates → within 100m? →
Timestamp → is it recent? →
Google Vision API → is it a stolen internet image? →
Government project DB → is this project officially recorded? →
ALL PASS → LLaVA analyzes images → generates description →
Constituency Admin approves in verification queue →
System queries voters table: address_gali = [this street] →
Notification generated per segment (Farmer version / Youth version) →
Bhashini translates to voter's language preference →
Firebase FCM + Twilio SMS dispatched to ONLY those street residents →
Delivery analytics recorded
```

## Complete Flow: AI Campaign

```
Constituency Admin clicks "Create Campaign" →
Selects: campaign type, target segments, target booths/streets →
Clicks "Generate with AI" →
FastAPI → Groq API (Llama 3.1 70B) →
6 parallel requests (one per segment) →
6 draft notification texts returned →
mDeBERTa moderation check on each → 
Any flagged? → Show to admin with reason, block send →
All pass → Admin previews all 6 versions →
Admin edits if needed → 
Submits for approval (State Admin approval if national campaign) →
Approved → Bhashini translates to all required languages →
Celery task queued for batch notification dispatch →
Firebase FCM batch (1000 per API call) + Twilio SMS fallback →
Delivery analytics update in real time
```

---

# 17. DEMO DAY STRATEGY

## Night Before (March 27):

Run this script to pre-cache all demo responses:
```
python scripts/cache_demo_responses.py
```

This generates and caches:
1. Constituency dashboard data for "Demo Constituency — Varanasi North"
2. Segmented voter breakdown (500 synthetic voters, 4 booths)
3. 3 complete notification campaigns (Farmer, Youth, Women)
4. 4 Before & After infrastructure projects with AI-generated descriptions
5. Knowledge Graph nodes and edges
6. Sentiment trend data (14 days)
7. Scheme coverage statistics
8. ECI oversight feed with sample flags

## Demo Mode Toggle:
Build a hidden keyboard shortcut (Ctrl+Shift+D) that activates Demo Mode.
In Demo Mode:
- ALL API calls return from local cache JSON files instead of live API
- Response time: <50ms (looks instant)
- Zero dependency on internet or Groq API
- Toggle shows a small "DEMO" badge in top corner

## Demo Script (What to Show Judges):

**30-second hook:** Open constituency dashboard → "Here are 10,100 voters in Varanasi North, automatically segmented by our AI into farmers, youth, women, and businessmen. Watch this." → Switch to Knowledge Graph → The web of connections appears. "Every voter connected 