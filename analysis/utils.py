import requests
import os
import json
import re

HF_API_KEY = os.getenv("HF_API_KEY")
HF_MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1"

headers = {
    "Authorization": f"Bearer {HF_API_KEY}",
    "Content-Type": "application/json"
}

def analyze_resume_with_huggingface(text):
    prompt = f"""
You are a resume analysis expert.

Analyze the following resume and return ONLY valid JSON with these keys:
- "ats_score": number (0-100)
- "clarity_score": number (0-100)
- "experience": e.g. "0-1 years", "2-4 years"
- "education": highest degree or qualification
- "skills": list of technical/soft skills
- "strengths": top 3 strengths (list)
- "weaknesses": top 3 weaknesses (list)

Resume:
{text}

Respond only with a valid JSON.
"""

    try:
        response = requests.post(
            f"https://api-inference.huggingface.co/models/{HF_MODEL}",
            headers=headers,
            json={"inputs": prompt},
            timeout=60
        )
        result = response.json()

        if isinstance(result, dict) and "error" in result:
            return {"error": result["error"]}

        if isinstance(result, list) and "generated_text" in result[0]:
            output_text = result[0]["generated_text"]
        elif isinstance(result, dict) and "generated_text" in result:
            output_text = result["generated_text"]
        else:
            return {"error": "No generated_text found in response."}

        # Try extracting JSON from the text
        match = re.search(r"\{.*\}", output_text, re.DOTALL)
        return json.loads(match.group()) if match else {"error": "Invalid JSON format"}

    except Exception as e:
        return {"error": str(e)}
