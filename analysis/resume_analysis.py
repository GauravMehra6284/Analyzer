from PyPDF2 import PdfReader
import requests
import json
import re
from dotenv import load_dotenv
import os

load_dotenv()

# OpenRouter Configuration
OPENROUTER_API_KEY = os.getenv("OR_API_KEY")
OPENROUTER_MODEL = "meta-llama/llama-3-70b-instruct"

def extract_text_from_pdf(file_path):
    """Extract text from PDF with error handling"""
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text.strip()
    except Exception as e:
        print(f"💥 PDF Extraction Error: {str(e)}")
        return None

def analyze_resume_with_llm(text):
    """Analyze resume using OpenRouter's "meta-llama/llama-3-70b-instruct"with strict scoring"""
    prompt = f"""
[INST]
You are a strict resume evaluator used by ResumeWorded and top HR firms.

Act like an expert recruiter. Be brutally honest and realistic — most resumes are average or below. Only give high scores if they truly deserve it.

Scoring Guide:
- Poor resumes: 25–45
- Average: 50–65
- Good: 70–80
- Excellent: 85+ (very rare)

DO NOT return inflated scores.
DO NOT use placeholders like "e.g.", "etc.", or "null".
ONLY return valid JSON with this format:

{{
  "ats_score": 0-100,
  "clarity_score": 0-100,
  "experience": "Summarize candidate's experience and projects",
  "education": "Summarize degrees and certifications",
  "skills": {{
    "technical": ["List technical skills"],
    "soft": ["List soft skills"],
    "tools": ["List tools, IDEs, platforms"]
  }},
  "strengths": [
    "What the resume does well"
  ],
  "weaknesses": [
    "Major flaws: e.g. no metrics, no tools, no internships"
  ],
  "missing_keywords": [
    "List missing job-relevant keywords like 'Agile', 'CI/CD', etc."
  ]
}}

Evaluate using:
- ATS formatting
- Grammar, layout, consistency
- Keyword relevance
- Use of tools, metrics, and achievements
- Technical + soft skills

📄 Resume:
{text[:15000]}
[/INST]
"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "https://your-resume-analyzer.com",
        "Content-Type": "application/json"
    }

    try:
        print("🔁 Sending request to OpenRouter...")
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json={
                "model": OPENROUTER_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "response_format": "json",
                "temperature": 0,   # 🔒 Deterministic output
                "top_p": 1          # 🔒 No sampling randomness
            },
            timeout=30
        )

        print(f"🔍 Status Code: {response.status_code}")

        if response.status_code != 200:
            error_msg = response.json().get("error", {}).get("message", "Unknown error")
            print(f"❌ API Error: {error_msg}")
            return {"error": f"API Error: {error_msg}"}

        result = response.json()
        output_text = result["choices"][0]["message"]["content"]
        print(f"✅ Raw Output: {output_text}")

        # Extract JSON using regex
        json_match = re.search(r'\{.*\}', output_text, re.DOTALL)
        if not json_match:
            print("❌ No JSON found in output")
            return {"error": "Invalid LLM output format"}

        return json.loads(json_match.group())

    except json.JSONDecodeError as jde:
        print(f"❌ JSON Parsing Error: {str(jde)}")
        return {"error": "Invalid API response format"}
    except Exception as e:
        print(f"💥 Unexpected Error: {str(e)}")
        return {"error": f"Analysis failed: {str(e)}"}

# Example usage
# text = extract_text_from_pdf("resume.pdf")
# if text:
#     result = analyze_resume_with_llm(text)
#     print(json.dumps(result, indent=2))
