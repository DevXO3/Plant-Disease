import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import re

# Load environment variables
load_dotenv()

def get_plant_advice(symptoms: str, disease: str = "Unknown"):
    """
    Generates agricultural advice based on symptoms and disease name using Gemini.
    Returns a dictionary (JSON) with the advice.
    """
    
    # Fetch API key
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "GEMINI_API_KEY not found in environment variables."}

    # Configure Gemini
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
    except Exception as e:
        return {"error": f"Failed to configure Gemini: {str(e)}"}

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

    try:
        # Generate response
        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        # Remove markdown formatting (like ```json ... ```)
        cleaned_text = re.sub(r"^```(?:json)?|```$", "", raw_text, flags=re.MULTILINE).strip()

        # Parse JSON
        ai_output = json.loads(cleaned_text)
        return ai_output

    except json.JSONDecodeError:
        return {
            "error": "The model did not return valid JSON.",
            "raw_response": raw_text
        }
    except Exception as e:
        return {"error": f"An error occurred during generation: {str(e)}"}

if __name__ == "__main__":
    # Test run
    test_disease = "Tomato Early Blight"
    test_symptoms = "Yellow spots on leaves"
    print(json.dumps(get_plant_advice(test_symptoms, test_disease), indent=2))
