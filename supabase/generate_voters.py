"""
generate_voters.py
Generates 500 realistic voter INSERT rows matching the MySQL dump schema
and injects them into seed.sql at the PASTE YOUR DATA HERE marker.
"""

import random
import uuid
import datetime
import os

# ── Seed for reproducibility ─────────────────────────────────────
random.seed(42)

# ── Reference data (based on patterns from the original dump) ────

FIRST_NAMES_M = [
    "Ramesh", "Suresh", "Mahesh", "Rajesh", "Dinesh", "Lokesh", "Ganesh",
    "Naresh", "Rakesh", "Mukesh", "Anil", "Sunil", "Vinil", "Ajay", "Vijay",
    "Sanjay", "Manoj", "Ravi", "Shiv", "Om", "Prem", "Hari", "Gopal", "Mohan",
    "Sohan", "Rohan", "Kiran", "Tarun", "Varun", "Arun", "Praveen", "Naveen",
    "Sandeep", "Pradeep", "Kuldeep", "Jagdish", "Kamlesh", "Brijesh", "Umesh",
    "Girish", "Yogesh", "Hitesh", "Nilesh", "Ashish", "Santosh", "Devesh",
    "Prakash", "Subhash", "Vidyashankar", "Arvind",
]

FIRST_NAMES_F = [
    "Sunita", "Anita", "Kavita", "Geeta", "Seema", "Reema", "Neema", "Meena",
    "Leena", "Heena", "Pooja", "Priya", "Puja", "Asha", "Usha", "Nisha",
    "Disha", "Rekha", "Lekha", "Shobha", "Sobha", "Radha", "Sudha", "Vidya",
    "Lalita", "Savita", "Mamta", "Saroj", "Pushpa", "Kamla", "Rama", "Gita",
    "Sita", "Rita", "Mira", "Shakuntala", "Parvati", "Durga", "Devki", "Suman",
    "Kiran", "Archana", "Vandana", "Chandana", "Shilpa", "Reena", "Deepika",
    "Sarita", "Pratima", "Renjana",
]

SURNAMES = [
    "Sharma", "Verma", "Gupta", "Mishra", "Singh", "Yadav", "Patel", "Chauhan",
    "Maurya", "Tiwari", "Pandey", "Dubey", "Tripathi", "Chaudhary", "Joshi",
    "Srivastava", "Saxena", "Agarwal", "Bhatia", "Rastogi", "Keshari", "Kushwaha",
    "Rajput", "Rawat", "Thakur", "Shukla", "Bajpai", "Dixit", "Pathak", "Lal",
    "Kumar", "Ram", "Das", "Nath", "Shah", "Soni", "Mehra", "Kapoor", "Malhotra",
    "Bose", "Sen", "Roy", "Nair",
]

STREETS_BOOTH42 = [
    "Krishnapuri Colony", "Kisan Colony", "Ram Nagar Road", "Hanuman Nagar",
    "Gali No. 3 Shivpur", "Gali No. 5 Shivpur", "Gali No. 7 Shivpur",
    "Panchayat Road", "Basant Vihar", "Ambedkar Nagar",
]

STREETS_BOOTH43 = [
    "Sarnath Main Road", "Buddha Nagar", "Dharmarajika Colony", "Ashoka Nagar",
    "Deer Park Road", "Mulagandhakuti Vihar Road", "Chaukhandi Road",
    "Sarnath Colony", "Rajghat Road", "Varanasi-Sarnath Highway",
]

OCCUPATIONS = [
    "Farmer", "Teacher", "Daily Wage Worker", "Shopkeeper", "Government Employee",
    "Auto Driver", "Vegetable Vendor", "Carpenter", "Mason", "Tailor",
    "Priest", "Homemaker", "Student", "Small Business Owner", "Trader",
    "Electrician", "Plumber", "Nurse", "Retired", "Driver",
]

EDUCATION_LEVELS = [
    "Illiterate", "Primary", "Middle", "High School", "Intermediate",
    "Graduate", "Post Graduate", "Diploma",
]

SEGMENTS = [
    "farmer", "farmer", "farmer",          # 3x weight
    "youth", "youth",
    "women", "women",
    "businessman",
    "senior",
    "govt_employee",
    "other",
]

LANGUAGES = ["Hindi", "Hindi", "Hindi", "Bhojpuri", "Bhojpuri", "Urdu"]

BOOTHS = [42, 43]

# ── Generator helpers ────────────────────────────────────────────

def random_date(start_year=1945, end_year=2006):
    start = datetime.date(start_year, 1, 1)
    end   = datetime.date(end_year, 12, 31)
    delta = (end - start).days
    return start + datetime.timedelta(days=random.randint(0, delta))

def age_from_dob(dob: datetime.date) -> int:
    today = datetime.date(2026, 2, 20)
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

def phone():
    prefix = random.choice(["6", "7", "8", "9"])
    rest   = "".join([str(random.randint(0, 9)) for _ in range(9)])
    return prefix + rest

def epic_number(idx):
    letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    return (
        random.choice(letters)
        + random.choice(letters)
        + random.choice(letters)
        + f"{(idx * 7 + 100001):07d}"
    )

def row_id(idx):
    # Simple integer IDs: 1, 2, 3...
    return idx + 1

def address(street, booth):
    area = "Shivpur" if booth == 42 else "Sarnath"
    return f"{street}, {area}, Varanasi, UP 221007"

# ── Build 500 rows ───────────────────────────────────────────────

rows = []
for i in range(500):
    gender     = random.choice(["M", "M", "F", "F", "F"])   # slight female majority
    if gender == "M":
        fname  = random.choice(FIRST_NAMES_M)
    else:
        fname  = random.choice(FIRST_NAMES_F)
    lname      = random.choice(SURNAMES)
    name       = f"{fname} {lname}"

    dob        = random_date()
    calculated_age = age_from_dob(dob)

    booth      = random.choice(BOOTHS)
    streets    = STREETS_BOOTH42 if booth == 42 else STREETS_BOOTH43
    street     = random.choice(streets)
    addr       = address(street, booth)

    seg        = random.choice(SEGMENTS)
    # For women segment, gender should lean F
    if seg == "women":
        gender = "F"
    # Senior: age 60+
    if seg == "senior":
        dob    = random_date(1940, 1966)
        calculated_age = age_from_dob(dob)
    # Youth: age 18–30
    if seg == "youth":
        dob    = random_date(1996, 2007)
        calculated_age = age_from_dob(dob)
        if calculated_age < 18:
            calculated_age = 18

    is_key       = "True" if random.random() < 0.15 else "False"
    aadhaar      = "True" if random.random() < 0.72 else "False"
    network_size = random.randint(3, 45) if is_key == "True" else random.randint(0, 10)
    family_size  = random.randint(2, 8)
    scheme_gap   = random.randint(0, 4)
    lang         = random.choice(LANGUAGES)
    occ          = random.choice(OCCUPATIONS)
    edu          = random.choice(EDUCATION_LEVELS)

    booth_id_str = f"b0{booth - 41:02d}"   # b001 or b002

    rows.append({
        "id":                 row_id(i),
        "epic_number":        epic_number(i),
        "name":               name,
        "dob":                dob.strftime("%Y-%m-%d"),
        "age":                calculated_age,
        "gender":             gender,
        "phone":              phone(),
        "address":            addr,
        "street":             street,
        "booth_id":           booth_id_str,
        "booth_number":       booth,
        "segment":            seg,
        "occupation":         occ,
        "education":          edu,
        "family_size":        family_size,
        "is_key_voter":       is_key,
        "network_size":       str(network_size),
        "aadhaar_verified":   aadhaar,
        "preferred_language": lang,
        "scheme_gap_count":   str(scheme_gap),
    })

# ── Render as PostgreSQL-compatible INSERT statements ────────────

def escape(val):
    """Escape single quotes for SQL string literals."""
    return str(val).replace("'", "''")

lines = []
for r in rows:
    line = (
        f"INSERT INTO voter_staging "
        f"(id, epic_number, name, dob, age, gender, phone, address, street, "
        f"booth_id, booth_number, segment, occupation, education, family_size, "
        f"is_key_voter, network_size, aadhaar_verified, preferred_language, scheme_gap_count) "
        f"VALUES ("
        f"'{escape(r['id'])}', "
        f"'{escape(r['epic_number'])}', "
        f"'{escape(r['name'])}', "
        f"'{escape(r['dob'])}', "
        f"{r['age']}, "
        f"'{escape(r['gender'])}', "
        f"'{escape(r['phone'])}', "
        f"'{escape(r['address'])}', "
        f"'{escape(r['street'])}', "
        f"'{escape(r['booth_id'])}', "
        f"{r['booth_number']}, "
        f"'{escape(r['segment'])}', "
        f"'{escape(r['occupation'])}', "
        f"'{escape(r['education'])}', "
        f"{r['family_size']}, "
        f"'{escape(r['is_key_voter'])}', "
        f"'{escape(r['network_size'])}', "
        f"'{escape(r['aadhaar_verified'])}', "
        f"'{escape(r['preferred_language'])}', "
        f"'{escape(r['scheme_gap_count'])}'"
        f");"
    )
    lines.append(line)

insert_block = "\n".join(lines)

# ── Inject into seed.sql ─────────────────────────────────────────

seed_path = os.path.join(os.path.dirname(__file__), "seed.sql")
marker    = "-- (paste all rows here)"

with open(seed_path, "r", encoding="utf-8") as f:
    content = f.read()

if marker not in content:
    print("ERROR: Injection marker not found in seed.sql")
    exit(1)

# Backup
backup_path = seed_path.replace(".sql", ".backup.sql")
with open(backup_path, "w", encoding="utf-8") as f:
    f.write(content)
print(f"Backup saved → seed.backup.sql")

# Inject
new_content = content.replace(marker, f"{marker}\n\n{insert_block}")
with open(seed_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"✅ Done! seed.sql now contains {len(rows)} voter INSERT rows.")
print(f"   Key voters: {sum(1 for r in rows if r['is_key_voter'] == 'True')}")
print(f"   Aadhaar verified: {sum(1 for r in rows if r['aadhaar_verified'] == 'True')}")
print(f"   Booth 42: {sum(1 for r in rows if r['booth_number'] == 42)}")
print(f"   Booth 43: {sum(1 for r in rows if r['booth_number'] == 43)}")
seg_counts = {}
for r in rows:
    seg_counts[r['segment']] = seg_counts.get(r['segment'], 0) + 1
print(f"   Segments: {seg_counts}")
