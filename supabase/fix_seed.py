"""
fix_seed.py
===========
Clean rebuild of seed.sql from the backup. Avoids all the cascading cast
issues by using a single clean approach:
- WHEN values: plain string literals (no cast) → compare against s.segment VARCHAR
- THEN values: cast to ::voter_segment
- All other ENUM columns: inline explicit cast in the INSERT column list
"""
import re

# ── 1. Start from the clean backup ──────────────────────────────
with open("seed.backup.sql", "r", encoding="utf-8") as f:
    content = f.read()

# ── 2. Re-inject the 500 voter rows from the already-injected seed.sql ──
# (The backup has the marker, seed.sql has the data rows)
with open("seed.sql", "r", encoding="utf-8") as f:
    seeded = f.read()

marker = "-- (paste all rows here)"

# Extract the injected block from current seed.sql
marker_pos = seeded.find(marker)
after_marker = seeded[marker_pos + len(marker):].strip()

# Find where the injected INSERT block ends (starts with "--" section header or empty line area)
# The voter INSERTs end before the next "--" comment block
insert_lines = []
for line in after_marker.split("\n"):
    stripped = line.strip()
    if stripped.startswith("INSERT INTO voter_staging"):
        insert_lines.append(stripped)
    elif stripped.startswith("--") and insert_lines:
        break  # Stop at the next comment section

insert_block = "\n".join(insert_lines)
print(f"Recovered {len(insert_lines)} voter INSERT lines from seed.sql")

# ── 3. Inject into clean backup ──────────────────────────────────
content = content.replace(marker, f"{marker}\n\n{insert_block}")

# ── 4. Fix the CASE segment mapping block ────────────────────────
# Replace the entire CASE s.segment block with properly-typed version
old_case = """    CASE s.segment
        WHEN 'farmer'        THEN 'farmer'
        WHEN 'youth'         THEN 'youth'
        WHEN 'women'         THEN 'women'
        WHEN 'businessman'   THEN 'businessman'
        WHEN 'senior'        THEN 'senior'
        WHEN 'govt_employee' THEN 'govt_employee'
        WHEN 'trader'        THEN 'businessman'   -- closest semantic match
        WHEN 'daily_wage'    THEN 'other'         -- no direct segment; use 'other'
        ELSE                      'other'
    END::voter_segment,"""

new_case = """    CASE s.segment
        WHEN 'farmer'        THEN 'farmer'::voter_segment
        WHEN 'youth'         THEN 'youth'::voter_segment
        WHEN 'women'         THEN 'women'::voter_segment
        WHEN 'businessman'   THEN 'businessman'::voter_segment
        WHEN 'senior'        THEN 'senior'::voter_segment
        WHEN 'govt_employee' THEN 'govt_employee'::voter_segment
        WHEN 'trader'        THEN 'businessman'::voter_segment
        WHEN 'daily_wage'    THEN 'other'::voter_segment
        ELSE                      'other'::voter_segment
    END,"""

content = content.replace(old_case, new_case)
if new_case not in content:
    print("WARNING: CASE block replacement did not match exactly — doing regex fallback")
    # Regex fallback
    content = re.sub(
        r"CASE s\.segment\s+WHEN.*?END::voter_segment,",
        new_case,
        content,
        flags=re.DOTALL
    )

# ── 5. Fix the gender CASE block ─────────────────────────────────
old_gender = """    CASE s.gender
        WHEN 'M' THEN 'M'
        WHEN 'F' THEN 'F'
        ELSE 'O'
    END::gender_type,"""

new_gender = """    CASE s.gender
        WHEN 'M' THEN 'M'::gender_type
        WHEN 'F' THEN 'F'::gender_type
        ELSE          'O'::gender_type
    END,"""

content = content.replace(old_gender, new_gender)

# ── 6. Fix scheme_voter_status insertions ────────────────────────
# All 'eligible', 'enrolled', 'applied', 'not_eligible' in voter_scheme_status INSERTs
status_vals = ["eligible", "enrolled", "applied", "not_eligible"]

def add_scheme_status_cast(text):
    """Add ::scheme_voter_status only inside INSERT INTO voter_scheme_status blocks"""
    result = []
    lines = text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        if "INSERT INTO voter_scheme_status" in line or (
            i > 0 and "voter_scheme_status" in lines[max(0,i-3):i]
                and "SELECT" in line
        ):
            # This and following lines until ';' are in a vss block
            block_lines = [line]
            j = i + 1
            while j < len(lines) and ";" not in lines[j-1]:
                block_lines.append(lines[j])
                j += 1
            if j < len(lines):
                block_lines.append(lines[j])
                j += 1
            block = "\n".join(block_lines)
            for v in status_vals:
                block = re.sub(
                    r"'" + v + r"'(?!::scheme_voter_status)",
                    f"'{v}'::scheme_voter_status",
                    block
                )
            result.append(block)
            i = j
        else:
            result.append(line)
            i += 1
    return "\n".join(result)

content = add_scheme_status_cast(content)

# ── 7. Fix project_status ─────────────────────────────────────────
# In infrastructure_projects INSERT VALUES block
for v in ["planned", "in_progress", "completed"]:
    # Only in lines that are part of infrastructure_projects insert values
    # Use a simpler approach: find the block and replace within it
    pass  # These are string literals in VALUES — PostgreSQL can usually infer them from context
    # Actually PostgreSQL CANNOT infer — add explicit casts
    # But 'in_progress' also appears in grievances...
    # Use regex to only replace in infrastructure_projects context

def cast_project_status(text):
    """Cast status values inside infrastructure_projects INSERT blocks"""
    pattern = r"(INSERT INTO infrastructure_projects.*?ON CONFLICT.*?;)"
    def replacer(m):
        block = m.group(0)
        for v in ["planned", "in_progress", "completed"]:
            block = re.sub(
                r"'" + v + r"'(?!::project_status)",
                f"'{v}'::project_status",
                block
            )
        return block
    return re.sub(pattern, replacer, text, flags=re.DOTALL)

content = cast_project_status(content)

# ── 8. Fix grievance_status ───────────────────────────────────────
def cast_grievance_status(text):
    pattern = r"(INSERT INTO grievances.*?;)"
    def replacer(m):
        block = m.group(0)
        for v in ["open", "in_progress", "resolved", "closed", "escalated"]:
            block = re.sub(
                r"'" + v + r"'(?!::grievance_status|::project_status)",
                f"'{v}'::grievance_status",
                block
            )
        return block
    return re.sub(pattern, replacer, text, flags=re.DOTALL)

content = cast_grievance_status(content)

# ── 9. Write result ───────────────────────────────────────────────
with open("seed.sql", "w", encoding="utf-8") as f:
    f.write(content)

print("Done! Cast counts:")
print(f"  ::voter_segment:        {content.count('::voter_segment')}")
print(f"  ::gender_type:          {content.count('::gender_type')}")
print(f"  ::scheme_voter_status:  {content.count('::scheme_voter_status')}")
print(f"  ::project_status:       {content.count('::project_status')}")
print(f"  ::grievance_status:     {content.count('::grievance_status')}")
print(f"  voter_staging INSERTs:  {content.count('INSERT INTO voter_staging')}")
