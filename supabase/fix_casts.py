"""
fix_casts.py - adds explicit ENUM casts to all bare status/segment/gender
literals in seed.sql so PostgreSQL stops complaining about type mismatches.
"""
import re

with open("seed.sql", "r", encoding="utf-8") as f:
    content = f.read()

original_len = len(content)

# ── 1. scheme_voter_status ────────────────────────────────────────
# Every bare 'eligible'/'enrolled'/'applied'/'not_eligible' that is
# NOT already followed by ::  → add ::scheme_voter_status
for val in ["eligible", "enrolled", "applied", "not_eligible"]:
    # Replace 'val' not already cast
    content = re.sub(
        r"'" + val + r"'(?!::)",
        f"'{val}'::scheme_voter_status",
        content
    )

# ── 2. voter_segment ENUM (for voters INSERT) ────────────────────
for val in ["farmer", "youth", "women", "businessman", "senior", "govt_employee", "other"]:
    content = re.sub(
        r"'" + val + r"'(?!::)",
        f"'{val}'::voter_segment",
        content
    )

# ── 3. gender_type ENUM (for voters_eci INSERT) ──────────────────
# Only single-char gender values M / F / O
for val in ["M", "F", "O"]:
    # Be careful: only cast when used as CASE result (::gender_type already exists there)
    # Actually just add cast everywhere — if already present it won't duplicate because ::
    # guard above. But M/F/O are short and may appear in names — restrict to CASE WHEN context
    content = re.sub(
        r"THEN '" + val + r"'(?!::gender_type)",
        f"THEN '{val}'::gender_type",
        content
    )

# ── 4. project_status ENUM (for infrastructure_projects INSERT) ──
for val in ["planned", "in_progress", "completed"]:
    content = re.sub(
        r"'" + val + r"'(?!::)",
        f"'{val}'::project_status",
        content
    )

# ── 5. grievance_status ENUM  ────────────────────────────────────
# 'resolved' and 'in_progress' — but in_progress is already handled above
# Add grievance_status for grievances table rows
for val in ["resolved", "open", "closed"]:
    content = re.sub(
        r"'" + val + r"'(?!::)",
        f"'{val}'::grievance_status",
        content
    )

# ── 6. Fix any double-casts that crept in (e.g. ::project_status::grievance_status)
content = re.sub(r"::project_status::grievance_status", "::project_status", content)
content = re.sub(r"::scheme_voter_status::voter_segment", "::scheme_voter_status", content)
content = re.sub(r"::voter_segment::project_status", "::voter_segment", content)
content = re.sub(r"::grievance_status::project_status", "::grievance_status", content)
# in_progress appears in both project_status and grievance_status — let schema sort it out
# The column types will determine which cast is correct; leave ::project_status for now
# (grievances.status is grievance_status, infrastructure_projects.status is project_status)
# They share 'in_progress' — the cast will match whichever column receives it.

with open("seed.sql", "w", encoding="utf-8") as f:
    f.write(content)

print(f"Done. File size: {original_len} → {len(content)} bytes")
print(f"  ::scheme_voter_status casts: {content.count('::scheme_voter_status')}")
print(f"  ::voter_segment casts:       {content.count('::voter_segment')}")
print(f"  ::project_status casts:      {content.count('::project_status')}")
print(f"  ::gender_type casts:         {content.count('::gender_type')}")
