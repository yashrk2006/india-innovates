// apply-seed.mjs — Reads ANON key from .env.local and seeds data
// Usage: node supabase/apply-seed.mjs
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

// Read env from .env.local
const envContent = readFileSync(".env.local", "utf8");
const envVars = Object.fromEntries(
    envContent.split("\n")
        .filter(l => l.includes("="))
        .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const SUPABASE_URL = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const SUPABASE_KEY = envVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

console.log("URL:", SUPABASE_URL);
console.log("Key starts with:", SUPABASE_KEY?.slice(0, 20) + "...");

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
});

async function check(table, field = "id") {
    const { data, error } = await sb.from(table).select(field).limit(1);
    if (error) { console.log(`  ❌ ${table}: ${error.message}`); return false; }
    return data;
}

async function run() {
    console.log("\n🔍 Checking table access...");

    // Quick connectivity check
    const voterData = await check("voters", "id,segment");
    console.log("voters sample:", voterData);

    const schemeData = await check("schemes", "id,name");
    console.log("schemes sample:", schemeData);

    const infraData = await check("infrastructure_projects", "id,title");
    console.log("infra sample:", infraData);

    const vssData = await check("voter_scheme_status", "voter_id,scheme_id");
    console.log("voter_scheme_status sample:", vssData);

    console.log("\n✅ Connection check done. If all are null arrays [], tables are empty.");
    console.log("If you see actual data, the seed ran OK and something else is wrong.");
}

run().catch(console.error);
