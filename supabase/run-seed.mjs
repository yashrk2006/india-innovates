// run-seed.mjs — Seeds schemes + projects into remote Supabase
// Usage: node supabase/run-seed.mjs
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wjkbabpvclkrjdbkxdqf.supabase.co";
// Replace with your SERVICE ROLE key from Supabase Dashboard > Settings > API
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";

if (!SUPABASE_SERVICE_KEY) {
    console.error("❌ Set SUPABASE_SERVICE_KEY env var (service_role key from dashboard)");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
});

async function run() {
    console.log("🌱 Starting seed...\n");

    // ── 1. Check if voters table has data ──────────────────────────
    const { count: voterCount } = await supabase
        .from("voters")
        .select("id", { count: "exact", head: true });
    console.log(`👥 voters table has ${voterCount} rows`);

    // ── 2. Check schemes ──────────────────────────────────────────
    const { count: schemeCount } = await supabase
        .from("schemes")
        .select("id", { count: "exact", head: true });
    console.log(`📜 schemes table has ${schemeCount} rows`);

    // ── 3. Check voter_scheme_status ─────────────────────────────
    const { count: vssCount } = await supabase
        .from("voter_scheme_status")
        .select("id", { count: "exact", head: true });
    console.log(`🔗 voter_scheme_status table has ${vssCount} rows`);

    // ── 4. Check infrastructure_projects ─────────────────────────
    const { count: projCount } = await supabase
        .from("infrastructure_projects")
        .select("id", { count: "exact", head: true });
    console.log(`🏗️  infrastructure_projects table has ${projCount} rows\n`);

    // ── 5. Seed infrastructure_projects if empty ──────────────────
    if (projCount === 0) {
        console.log("🏗️  Seeding infrastructure_projects...");
        const { error } = await supabase.from("infrastructure_projects").upsert([
            { id: 1, constituency_id: 1, title: "Shivpur Main Road Resurfacing", type: "road", description: "Complete resurfacing of 1.2 km stretch from Gali 1 junction to Kisan Colony.", status: "in_progress", icon: "construction", icon_bg: "bg-amber-100", progress: 65, likes_count: 142, comments_count: 18, booth_number: 42 },
            { id: 2, constituency_id: 1, title: "Kisan Colony Drinking Water Supply", type: "water", description: "Installation of 3 new hand pumps and one elevated water tank.", status: "completed", icon: "water_drop", icon_bg: "bg-blue-100", progress: 100, likes_count: 89, comments_count: 5, booth_number: 42 },
            { id: 3, constituency_id: 1, title: "Hanuman Nagar LED Streetlights", type: "electricity", description: "Installation of 48 LED streetlights across all 8 lanes.", status: "planned", icon: "lightbulb", icon_bg: "bg-yellow-100", progress: 0, likes_count: 34, comments_count: 3, booth_number: 42 },
            { id: 4, constituency_id: 1, title: "Ram Nagar Road Drainage Channel", type: "drainage", description: "Construction of a 0.6 km covered drainage channel.", status: "in_progress", icon: "water", icon_bg: "bg-teal-100", progress: 45, likes_count: 56, comments_count: 7, booth_number: 42 },
            { id: 5, constituency_id: 1, title: "Sarnath Heritage Road Beautification", type: "road", description: "Widening and landscaping of 0.8 km road from Deer Park.", status: "in_progress", icon: "construction", icon_bg: "bg-orange-100", progress: 40, likes_count: 67, comments_count: 11, booth_number: 43 },
            { id: 6, constituency_id: 1, title: "Buddha Nagar Underground Drainage", type: "drainage", description: "Underground stormwater drainage connecting Buddha Nagar.", status: "completed", icon: "water", icon_bg: "bg-cyan-100", progress: 100, likes_count: 203, comments_count: 24, booth_number: 43 },
            { id: 7, constituency_id: 1, title: "Ashoka Nagar Primary Health Centre", type: "health", description: "New PHC building with OPD, maternity ward and pharmacy.", status: "in_progress", icon: "local_hospital", icon_bg: "bg-red-100", progress: 55, likes_count: 118, comments_count: 14, booth_number: 43 },
            { id: 8, constituency_id: 1, title: "Sarnath Main Road Solar Pumps", type: "water", description: "Installation of 5 solar-powered water pumps.", status: "planned", icon: "solar_power", icon_bg: "bg-green-100", progress: 0, likes_count: 29, comments_count: 2, booth_number: 43 },
        ], { onConflict: "id" });
        if (error) console.error("  ❌ Error:", error.message);
        else console.log("  ✅ Seeded 8 infrastructure projects");
    } else {
        console.log("  ✅ infrastructure_projects already has data, skipping");
    }

    // ── 6. Seed voter_scheme_status for voter 1 if empty ─────────
    const { count: voter1Schemes } = await supabase
        .from("voter_scheme_status")
        .select("id", { count: "exact", head: true })
        .eq("voter_id", 1);

    if (voter1Schemes === 0) {
        console.log("\n📜 Seeding voter_scheme_status for demo voter (id=1)...");

        // Get voter 1's segment
        const { data: voter1 } = await supabase
            .from("voters")
            .select("segment")
            .eq("id", 1)
            .single();

        if (!voter1) {
            console.error("  ❌ Voter with id=1 not found! Run the full seed first.");
            process.exit(1);
        }
        console.log(`  Demo voter segment: ${voter1.segment}`);

        // Seed PM-KISAN (id=1) always
        const schemeRows = [
            { voter_id: 1, scheme_id: 1, status: "eligible", outreach_sent: false },
            { voter_id: 1, scheme_id: 6, status: "enrolled", outreach_sent: true, converted: true },
        ];

        // Add segment-specific schemes
        if (voter1.segment === "farmer") {
            schemeRows.push({ voter_id: 1, scheme_id: 4, status: "eligible", outreach_sent: false });
        }
        if (voter1.segment === "women") {
            schemeRows.push({ voter_id: 1, scheme_id: 3, status: "eligible", outreach_sent: false });
            schemeRows.push({ voter_id: 1, scheme_id: 7, status: "eligible", outreach_sent: false });
        }
        if (voter1.segment === "senior") {
            schemeRows.push({ voter_id: 1, scheme_id: 5, status: "enrolled", outreach_sent: true, converted: true });
        }
        // Always add PM Awas
        schemeRows.push({ voter_id: 1, scheme_id: 2, status: "applied", outreach_sent: true });

        const { error } = await supabase.from("voter_scheme_status").upsert(schemeRows, { onConflict: "voter_id,scheme_id" });
        if (error) console.error("  ❌ Error:", error.message);
        else console.log(`  ✅ Seeded ${schemeRows.length} scheme statuses for demo voter`);
    } else {
        console.log(`\n  ✅ voter_scheme_status already has ${voter1Schemes} rows for voter 1, skipping`);
    }

    // ── 7. Final counts ───────────────────────────────────────────
    console.log("\n📊 Final counts:");
    for (const table of ["voters", "schemes", "voter_scheme_status", "infrastructure_projects", "citizen_notifications"]) {
        const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
        console.log(`  ${table}: ${count}`);
    }
    console.log("\n✅ Done!");
}

run().catch(console.error);
