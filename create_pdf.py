from fpdf import FPDF
import os

def create_pdf_from_text(input_file, output_file):
    # Read text file
    with open(input_file, 'r', encoding='utf-8') as file:
        content = file.readlines()

    # Create PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Add each line to PDF
    for line in content:
        # Encode to prevent encoding issues
        try:
            pdf.cell(0, 10, txt=line.strip(), ln=True)
        except:
            continue

    # Save PDF
    pdf.output(output_file)

if __name__ == "__main__":
    input_file = "resumes/sample_resume.txt"
    output_file = "resumes/john_doe_resume.pdf"
    
    # Create resumes directory if it doesn't exist
    os.makedirs("resumes", exist_ok=True)
    
    create_pdf_from_text(input_file, output_file)
    print(f"PDF created successfully: {output_file}") 