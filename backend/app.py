import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from predict_wrapper import run_prediction

app = FastAPI()

@app.get("/ping")
def ping():
    return {"status": "ok"}

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    upload_dir = "temp_uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Call wrapper to run test_model.py
    result = run_prediction(file_path)

    # Clean up file
    os.remove(file_path)

    return JSONResponse(content=result)