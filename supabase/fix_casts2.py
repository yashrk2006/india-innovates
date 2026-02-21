"""
fix_casts2.py - fixes the grievances block where 'in_progress' was cast as
project_status instead of grievance_status, and corrects other context-specific
mismatched casts.
"""
import re

with open("seed.sql", "r", encoding="utf-8") as f:
    content = f.read()

# ── Find the INSERT INTO grievances block and fix status casts there ──
# In the grievances block, statuses should be ::grievance_status, not ::project_status
# Grievance statuses: 'open', 'in_progress', 'resolved', 'closed'
def fix_grievances_block(text):
    # Find the grievances INSERT section and replace project_status with grievance_status
    # for the status column values
    def replace_in_grievances(m):
        block = m.group(0)
        block = block.replace("'in_progress'::project_status", "'in_progress'::grievance_status")
        block = block.replace("'resolved'::grievance_status", "'resolved'::grievance_status")  # already correct
        block = block.replace("'open'::grievance_status", "'open'::grievance_status")          # already correct
        return block

    # Match the grievances INSERT block
    pattern = r"(INSERT INTO grievances.*?;)"
    return re.sub(pattern, replace_in_grievances, text, flags=re.DOTALL)

content = fix_grievances_block(content)

# ── Fix: 'pending' was NOT cast — it appears in multiple types ────
# In voter_scheme_status context, 'pending' doesn't exist (not a valid scheme_voter_status value).
# In change_status, task_status etc. it does. Leave 'pending' uncast to avoid wrong type.
# (We didn't add ::pending casts in fix_casts.py so this is fine.)

# ── Fix: 'active' in user_status shouldn't get wrong cast ─────────
# 'active' is not a scheme_voter_status value so no cast was added. Good.

# ── Verify the grievance_status cast count ─────────────────────────
gs_count = content.count("::grievance_status")
ps_count = content.count("::project_status")

with open("seed.sql", "w", encoding="utf-8") as f:
    f.write(content)

print(f"Done.")
print(f"  ::grievance_status casts: {gs_count}")
print(f"  ::project_status casts:   {ps_count}")
print(f"  ::scheme_voter_status:    {content.count('::scheme_voter_status')}")
print(f"  ::voter_segment:          {content.count('::voter_segment')}")
