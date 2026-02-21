// run-sql.mjs — Run seed SQL via Supabase Management API
// Reads access token from the ~/.config/supabase/access-token or env
import { readFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const PROJECT_REF = "wjkbabpvclkrjdbkxdqf";

// Try to find the access token from local config
function findAccessToken() {
    // Try common locations
    const paths = [
        join(homedir(), ".supabase", "access-token"),
        join(homedir(), ".config", "supabase", "access-token"),
        join(process.cwd(), "supabase", ".temp", "pooler-url"),
    ];
    for (const p of paths) {
        if (existsSync(p)) {
            const content = readFileSync(p, "utf8").trim();
            console.log(`Found token at: ${p}`);
            return content;
        }
    }
    // Check SUPABASE_ACCESS_TOKEN env
    if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN;
    return null;
}

// Try the .temp folder
function findPoolerUrl() {
    const tempPath = join(process.cwd(), "supabase", ".temp");
    if (existsSync(tempPath)) {
        const files = readdirSync(tempPath);
        console.log("Files in .temp:", files);
    }
}

import { readdirSync } from "fs";

async function runSQL(sql, accessToken) {
    const response = await fetch(
        `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: sql }),
        }
    );

    const text = await response.text();
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
    }
    return JSON.parse(text);
}

async function main() {
    findPoolerUrl();

    // Try to find the access token from various places
    let token = findAccessToken();

    if (!token) {
        // Try reading from Windows path
        const winPaths = [
            join(process.env.APPDATA || "", "supabase", "access-token"),
            join(process.env.LOCALAPPDATA || "", "supabase", "access-token"),
            join(homedir(), "AppData", "Roaming", "supabase", "access-token"),
        ];
        for (const p of winPaths) {
            if (existsSync(p)) {
                token = readFileSync(p, "utf8").trim();
                console.log(`Found token at: ${p}`);
                break;
            }
        }
    }

    if (!token) {
        console.error("❌ No access token found. Set SUPABASE_ACCESS_TOKEN or run 'npx supabase login' first");
        console.log("\nSearched paths:");
        console.log("  APPDATA:", process.env.APPDATA);
        console.log("  LOCALAPPDATA:", process.env.LOCALAPPDATA);
        console.log("  HOME:", homedir());
        process.exit(1);
    }

    console.log("✅ Found access token:", token.slice(0, 20) + "...");

    // Test connection
    try {
        const result = await runSQL("SELECT current_database(), version()", token);
        console.log("✅ Connected to database:", result);
    } catch (err) {
        console.error("❌ Connection failed:", err.message);
        process.exit(1);
    }
}

main().catch(console.error);
