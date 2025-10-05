import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import re

# Load environment variables
load_dotenv()

# Fetch keys and input data from .env
api_key = os.getenv("GEMINI_API_KEY")
disease = os.getenv("PLANT_DISEASE")
symptoms = os.getenv("PLANT_BEHAVIOR")

# Configure Gemini
genai.configure(api_key=api_key)

# Choose Gemini model
model = genai.GenerativeModel("gemini-2.5-flash")

# Create a structured prompt
prompt = f"""
You are an agricultural AI assistant.

The detected plant disease is "{disease}".
The observed symptoms are: {symptoms}.

Provide your answer strictly in **valid JSON format** with the following structure:

{{
  "1. Explanation": "A short explanation of what is happening to the plant.",
  "2. Preventive Actions": ["Action 1", "Action 2", "Action 3"],
  "3. Recommended Treatments": ["Treatment 1", "Treatment 2", "Treatment 3"],
  "4. Environmental and Watering Advice": ["Advice 1", "Advice 2", "Advice 3"]
}}

Avoid any text outside JSON.
"""

# Generate response
response = model.generate_content(prompt)
raw_text = response.text.strip()

# Remove markdown formatting (like ```json ... ```)
cleaned_text = re.sub(r"^```(?:json)?|```$", "", raw_text, flags=re.MULTILINE).strip()

# Parse JSON and access specific points
try:
    ai_output = json.loads(cleaned_text)
    
    # Access and print each point separately
    explanation = ai_output.get("1. Explanation", "No explanation provided.")
    preventive_actions = ai_output.get("2. Preventive Actions", [])
    recommended_treatments = ai_output.get("3. Recommended Treatments", [])
    environmental_advice = ai_output.get("4. Environmental and Watering Advice", [])

    print("\n💡 1. Explanation:\n")
    print(explanation)

    print("\n💡 2. Preventive Actions:\n")
    for idx, action in enumerate(preventive_actions, 1):
        print(f"{idx}. {action}")

    print("\n💡 3. Recommended Treatments:\n")
    for idx, treatment in enumerate(recommended_treatments, 1):
        print(f"{idx}. {treatment}")

    print("\n💡 4. Environmental and Watering Advice:\n")
    for idx, advice in enumerate(environmental_advice, 1):
        print(f"{idx}. {advice}")

except json.JSONDecodeError:
    print("\n⚠️ The model did not return valid JSON after cleaning. Raw response:\n")
    print(response.text)
