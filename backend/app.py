import os
import shutil
import json
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predict_wrapper import run_prediction
from chatbot.chatbot_agent import get_plant_advice

# Pydantic model for chat input
class ChatInput(BaseModel):
    symptoms: str
    disease: str = "Unknown"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development, or specifically ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Swagger docs available at: http://127.0.0.1:8000/docs")

@app.get("/")
def read_root():
    return {"message": "Plant Disease Backend is Running! Go to /docs for API."}

@app.get("/ping")
def ping():
    return {"status": "ok"}

@app.post("/chat/")
async def chat(input_data: ChatInput):
    """
    Chatbot endpoint.
    Accepts JSON: {"symptoms": "...", "disease": "..."}
    Returns JSON advice from AI.
    """
    disease = input_data.disease
    
    # Try to load from context if disease is unknown
    if disease == "Unknown" or not disease:
        pred_file = os.path.join("temp_uploads", "prediction.json")
        if os.path.exists(pred_file):
            try:
                with open(pred_file, "r") as f:
                    data = json.load(f)
                    if "class" in data:
                        disease = data["class"]
            except:
                pass

    response = get_plant_advice(input_data.symptoms, disease)
    if "error" in response:
        # If API key is missing or generation fails
        return JSONResponse(content=response, status_code=500)
    return JSONResponse(content=response)

@app.post("/predict/")
async def predict(file: UploadFile = File(...), symptoms: str = Form(None)):
    """
    Uploads image, predicts disease, and optionally returns AI advice.
    """
    upload_dir = "temp_uploads"
    if os.path.exists(upload_dir):
        shutil.rmtree(upload_dir)
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.abspath(os.path.join(upload_dir, file.filename))

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save symptoms to a text file in temp_uploads if provided
    if symptoms:
        txt_filename = os.path.splitext(file.filename)[0] + ".txt"
        txt_path = os.path.join(upload_dir, txt_filename)
        with open(txt_path, "w") as f:
            f.write(symptoms)

    # Call wrapper to run test_model.py
    # Use forward slashes to avoid potential Windows path issues in subprocess
    result = run_prediction(file_path.replace("\\", "/"))

    # Save prediction context for chatbot
    context_path = os.path.join(upload_dir, "prediction.json")
    with open(context_path, "w") as f:
        json.dump(result, f, indent=4)

    # --- UNIFIED RESPONSE LOGIC ---
    # Retrieve the predicted class
    predicted_class = result.get("class", "Unknown")
    
    # Get AI advice
    # If no symptoms provided, we pass a generic string or None.
    # The chatbot agent handles "None" somewhat, but let's be explicit: "No symptoms provided."
    symptoms_text = symptoms if symptoms else "No symptoms provided."
    
    print(f"Triggering AI Advice for class: {predicted_class}")
    advice = get_plant_advice(symptoms_text, predicted_class)
    
    # Merge advice into the result. 
    # We add it as a nested "advice" object OR top-level. 
    # Let's do top-level for easier frontend access, but ensure no key collisions.
    # The advice keys are "1. Explanation", etc. "class" keys are "class", "confidence".
    # Should be safe to merge.
    
    combined_result = {**result, **advice}

    return JSONResponse(content=combined_result)