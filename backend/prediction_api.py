# prediction_api.py
import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from predict_wrapper import run_prediction

router = APIRouter()
UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/predict/")
async def predict(file: UploadFile = File(...), esc: str = Form(None)):
    # Save uploaded file to temp_uploads with unique name
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    tmp_name = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, tmp_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Run the wrapper which runs test_model.py on that image
        result = run_prediction(file_path)
    except Exception as e:
        # cleanup and return error
        if os.path.exists(file_path):
            os.remove(file_path)
        return JSONResponse(content={"error": str(e)}, status_code=500)

    # cleanup uploaded file
    if os.path.exists(file_path):
        os.remove(file_path)

    # include esc back if frontend provided it (they said they send image + esc)
    if esc is not None:
        result["esc"] = esc

    return JSONResponse(content=result)