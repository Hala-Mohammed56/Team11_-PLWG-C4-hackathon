import random
from fpdf import FPDF
import os
from datetime import datetime, timedelta

# Data for random generation
first_names = [
    "James", "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Isabella", "William", "Sophia",
    "Ethan", "Mia", "Lucas", "Charlotte", "Mason", "Amelia", "Logan", "Harper", "Sebastian", "Evelyn",
    "Chen", "Wei", "Ming", "Yuki", "Hiroshi", "Akiko", "Jin", "Mei", "Raj", "Priya",
    "Mohammed", "Fatima", "Ali", "Aisha", "Omar", "Zara", "Ahmad", "Sofia", "Hassan", "Leila"
]

last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Wang", "Li", "Zhang", "Liu", "Chen", "Yang", "Huang", "Zhao", "Wu", "Zhou",
    "Patel", "Kumar", "Singh", "Shah", "Sharma", "Verma", "Rao", "Reddy", "Kapoor", "Malhotra",
    "Kim", "Lee", "Park", "Choi", "Jung", "Kang", "Yoon", "Sato", "Suzuki", "Tanaka"
]

majors = [
    "Computer Science", "Software Engineering", "Data Science", "Information Technology",
    "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering",
    "Business Administration", "Finance", "Marketing", "Economics", "Accounting",
    "Psychology", "Biology", "Chemistry", "Physics", "Mathematics",
    "Graphic Design", "Industrial Design", "Architecture", "Interior Design",
    "Medicine", "Nursing", "Pharmacy", "Public Health",
    "Law", "Political Science", "International Relations",
    "Environmental Science", "Renewable Energy"
]

companies = [
    "TechCorp Solutions", "InnovateNow Inc.", "Digital Dynamics", "FutureTech Systems",
    "Global Software Ltd.", "DataFlow Analytics", "CloudScale Technologies", "SmartSys Solutions",
    "Quantum Computing Co.", "AI Innovations", "CyberSec Solutions", "BlockChain Ventures",
    "Green Energy Solutions", "BioTech Innovations", "HealthTech Systems", "MediCare Solutions",
    "FinTech Dynamics", "Investment Solutions", "Marketing Pioneers", "Creative Designs Inc."
]

technical_skills = {
    "Programming Languages": [
        "Python", "JavaScript", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go",
        "TypeScript", "Rust", "Scala", "R", "MATLAB", "Perl", "Shell Scripting", "SQL"
    ],
    "Web Technologies": [
        "HTML5", "CSS3", "React", "Angular", "Vue.js", "Node.js", "Django", "Flask",
        "FastAPI", "Spring Boot", "ASP.NET", "Express.js", "jQuery", "Bootstrap",
        "Tailwind CSS", "WebSocket", "GraphQL", "REST APIs"
    ],
    "Databases": [
        "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Oracle",
        "SQL Server", "SQLite", "Firebase", "DynamoDB", "Neo4j", "Elasticsearch"
    ],
    "Cloud & DevOps": [
        "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins",
        "GitLab CI", "Travis CI", "Terraform", "Ansible", "Puppet", "Chef",
        "ELK Stack", "Prometheus", "Grafana", "New Relic"
    ],
    "Tools & Platforms": [
        "Git", "GitHub", "BitBucket", "JIRA", "Confluence", "Trello",
        "Slack", "VS Code", "IntelliJ IDEA", "Eclipse", "Postman",
        "Swagger", "Linux", "Unix", "Windows Server"
    ]
}

non_technical_skills = [
    "Project Management", "Team Leadership", "Agile Methodologies", "Scrum",
    "Problem Solving", "Critical Thinking", "Communication", "Presentation",
    "Time Management", "Conflict Resolution", "Negotiation", "Customer Service",
    "Strategic Planning", "Business Analysis", "Requirements Gathering",
    "Documentation", "Training & Mentoring", "Cross-functional Collaboration"
]

def generate_phone():
    return f"({random.randint(100,999)}) {random.randint(100,999)}-{random.randint(1000,9999)}"

def generate_email(first_name, last_name):
    domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]
    return f"{first_name.lower()}.{last_name.lower()}@{random.choice(domains)}"

def generate_experience_years():
    return random.randint(1, 15)

def generate_skills():
    skills = []
    # Add random technical skills from each category
    for category, category_skills in technical_skills.items():
        num_skills = random.randint(2, min(5, len(category_skills)))
        skills.extend(random.sample(category_skills, num_skills))
    
    # Add random non-technical skills
    num_soft_skills = random.randint(3, 6)
    skills.extend(random.sample(non_technical_skills, num_soft_skills))
    
    return skills

def generate_resume():
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    major = random.choice(majors)
    years_experience = generate_experience_years()
    current_year = datetime.now().year
    
    resume = f"{first_name.upper()} {last_name.upper()}\n"
    resume += f"{major} Professional\n"
    resume += f"{generate_email(first_name, last_name)} | {generate_phone()}\n\n"
    
    resume += "SUMMARY\n"
    resume += f"Experienced {major} professional with {years_experience}+ years of expertise in "
    resume += f"developing and implementing solutions. Strong background in project management "
    resume += f"and team leadership.\n\n"
    
    resume += "SKILLS\n"
    skills = generate_skills()
    skills_grouped = [skills[i:i+3] for i in range(0, len(skills), 3)]
    for skill_group in skills_grouped:
        resume += "• " + ", ".join(skill_group) + "\n"
    resume += "\n"
    
    resume += "EXPERIENCE\n\n"
    num_positions = min(years_experience, random.randint(1, 3))
    current_year = datetime.now().year
    year = current_year
    
    for i in range(num_positions):
        company = random.choice(companies)
        duration = random.randint(1, 4)
        position = f"Senior {major} " if i == 0 else f"{major} "
        position += random.choice(["Specialist", "Professional", "Consultant", "Expert"])
        
        resume += f"{position} | {company} | {year-duration}-"
        resume += "Present\n" if i == 0 else f"{year}\n"
        
        # Generate 3-5 responsibilities
        responsibilities = [
            "Led cross-functional teams in developing innovative solutions",
            f"Managed complex {major.lower()} projects from conception to delivery",
            "Collaborated with stakeholders to define project requirements",
            "Implemented best practices and standard operating procedures",
            "Mentored junior team members and conducted knowledge sharing sessions"
        ]
        for _ in range(3):
            resume += f"- {random.choice(responsibilities)}\n"
        resume += "\n"
        year -= duration
    
    resume += "EDUCATION\n"
    grad_year = current_year - years_experience - random.randint(0, 2)
    university = random.choice([
        "University of Technology", "State University", "National Institute of Technology",
        "Technical University", "International University", "Institute of Science"
    ])
    resume += f"Bachelor of Science in {major}\n"
    resume += f"{university} | {grad_year-4}-{grad_year}\n\n"
    
    resume += "CERTIFICATIONS\n"
    certifications = [
        f"{random.choice(['Advanced', 'Professional', 'Expert'])} {major} Certification",
        f"{random.choice(technical_skills['Programming Languages'])} Developer Certification",
        f"{random.choice(technical_skills['Cloud & DevOps'])} Professional"
    ]
    for cert in certifications:
        resume += f"- {cert}\n"
    
    return resume, f"{first_name}_{last_name}_resume"

def create_pdf(content, filename):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Split content into lines and add to PDF
    for line in content.split('\n'):
        try:
            # Convert Unicode characters to ASCII approximations
            encoded_line = line.encode('ascii', 'replace').decode('ascii')
            pdf.cell(0, 10, txt=encoded_line.strip(), ln=True)
        except Exception as e:
            print(f"Warning: Could not add line to PDF: {e}")
            continue
    
    # Save PDF
    try:
        pdf.output(filename)
    except Exception as e:
        print(f"Warning: Could not save PDF {filename}: {e}")
        # Try alternative filename if there's an issue
        alt_filename = "".join(c for c in filename if c.isalnum() or c in "._- /")
        try:
            pdf.output(alt_filename)
            print(f"Saved with alternative filename: {alt_filename}")
        except Exception as e:
            print(f"Error: Could not save PDF with alternative filename: {e}")

# Create resumes directory if it doesn't exist
os.makedirs("resumes", exist_ok=True)

# Generate 100 resumes
for i in range(100):
    resume_content, resume_name = generate_resume()
    pdf_path = f"resumes/{resume_name}.pdf"
    create_pdf(resume_content, pdf_path)
    print(f"Generated resume {i+1}/100: {pdf_path}")

print("\nAll resumes generated successfully!") 