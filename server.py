from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json
from typing import List
import io
import os
from pathlib import Path

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the BERT model and tokenizer
model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

# Resume directory
RESUME_DIR = Path("resumes")

def get_bert_embedding(text: str) -> np.ndarray:
    """Get BERT embeddings for a text."""
    # Tokenize and prepare input
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    
    # Get model output
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Use the [CLS] token embedding as the text embedding
    embeddings = outputs.last_hidden_state[:, 0, :].numpy()
    return embeddings[0]

def extract_text_from_pdf(pdf_file: bytes) -> str:
    """Extract text from a PDF file."""
    return extract_text(io.BytesIO(pdf_file))

def calculate_similarity(text1: str, text2: str) -> float:
    """Calculate similarity between two texts using BERT embeddings."""
    emb1 = get_bert_embedding(text1)
    emb2 = get_bert_embedding(text2)
    
    # Reshape embeddings for cosine_similarity
    emb1 = emb1.reshape(1, -1)
    emb2 = emb2.reshape(1, -1)
    
    return float(cosine_similarity(emb1, emb2)[0][0])

def extract_skills(text: str, required_skills: List[str]) -> List[str]:
    """Extract matching skills from text."""
    text = text.lower()
    found_skills = []
    
    for skill in required_skills:
        if skill.lower() in text:
            found_skills.append(skill)
    
    return found_skills

@app.get("/list-resumes")
async def list_resumes():
    """List all available resumes in the resumes directory."""
    if not RESUME_DIR.exists():
        RESUME_DIR.mkdir()
        return {"resumes": []}
    
    resumes = []
    for pdf_file in RESUME_DIR.glob("*.pdf"):
        resumes.append({
            "name": pdf_file.stem,
            "file": str(pdf_file)
        })
    
    return {"resumes": resumes}

@app.post("/rank-resumes")
async def rank_resumes(
    job_title: str = Form(...),
    job_description: str = Form(...),
    required_skills: str = Form(...)
):
    try:
        results = []
        skills_list = [s.strip() for s in required_skills.split(",") if s.strip()]
        
        # Process all PDF files in the resumes directory
        for pdf_file in RESUME_DIR.glob("*.pdf"):
            # Read and process PDF
            with open(pdf_file, "rb") as f:
                pdf_content = f.read()
            
            resume_text = extract_text_from_pdf(pdf_content)
            
            # Calculate similarity score
            similarity_score = calculate_similarity(resume_text, job_description)
            
            # Extract matching skills
            matching_skills = extract_skills(resume_text, skills_list)
            
            # Calculate skill match percentage
            skill_match = len(matching_skills) / len(skills_list) if skills_list else 0
            
            # Calculate final score (weighted average)
            final_score = (similarity_score * 0.7 + skill_match * 0.3) * 100
            
            results.append({
                "name": pdf_file.stem,
                "fileName": pdf_file.name,
                "score": round(final_score, 2),
                "skills": matching_skills,
                "similarity_score": round(similarity_score * 100, 2),
                "skill_match_percentage": round(skill_match * 100, 2)
            })
        
        # Sort results by score
        results.sort(key=lambda x: x["score"], reverse=True)
        
        return {"results": results}
    
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 