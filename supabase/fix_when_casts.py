"""fix_when_casts.py — strips ::voter_segment from WHEN clause conditions only"""
import re

with open("seed.sql", "r", encoding="utf-8") as f:
    content = f.read()

# Remove ::voter_segment from  WHEN '...'::voter_segment  patterns
# (these should be plain varchar comparisons against s.segment)
fixed = re.sub(r"(WHEN\s+'[^']+')::voter_segment", r"\1", content)

bad_remaining = len(re.findall(r"WHEN\s+'[^']+'::", fixed))
total_vs = fixed.count("::voter_segment")

with open("seed.sql", "w", encoding="utf-8") as f:
    f.write(fixed)

print(f"Bad WHEN casts remaining : {bad_remaining}")
print(f"::voter_segment remaining: {total_vs}")
