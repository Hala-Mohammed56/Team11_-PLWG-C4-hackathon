import requests
import os

def test_resume_ranking(resume_folder, job_title, job_description, required_skills):
    # Server endpoint
    url = "http://localhost:8000/rank-resumes"
    
    # Prepare the files
    files = []
    for filename in os.listdir(resume_folder):
        if filename.endswith('.pdf'):
            file_path = os.path.join(resume_folder, filename)
            files.append(
                ('files', (filename, open(file_path, 'rb'), 'application/pdf'))
            )
    
    # Prepare form data
    data = {
        'job_title': job_title,
        'job_description': job_description,
        'required_skills': required_skills
    }
    
    try:
        # Send request
        response = requests.post(url, files=files, data=data)
        
        # Close all opened files
        for file_tuple in files:
            file_tuple[1][1].close()
        
        if response.status_code == 200:
            results = response.json()
            print("\n=== Resume Ranking Results ===")
            for idx, result in enumerate(results['results'], 1):
                print(f"\n{idx}. {result['name']}")
                print(f"   Overall Score: {result['score']}%")
                print(f"   Similarity Score: {result['similarity_score']}%")
                print(f"   Skill Match: {result['skill_match_percentage']}%")
                print(f"   Matching Skills: {', '.join(result['skills'])}")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"Error: {str(e)}")
