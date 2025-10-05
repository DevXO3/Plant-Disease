# predict_wrapper.py
import runpy
import tempfile
import io
import sys
import re
import os
import json

def run_prediction(img_path: str):
    """
    Create a temporary copy of test_model.py with img_path injected,
    run it, capture stdout, parse predicted class + confidence, return dict.
    This DOES NOT modify the original test_model.py file.
    """
    orig = "test_model.py"
    if not os.path.exists(orig):
        raise FileNotFoundError(f"{orig} not found in current directory")

    with open(orig, "r", encoding="utf-8") as f:
        content = f.read()

    # Create a safe Python string literal for the path
    injected = f"img_path = {json.dumps(img_path)}"

    # If test_model.py defines img_path, replace the first definition.
    if re.search(r'^\s*img_path\s*=', content, flags=re.MULTILINE):
        new_content = re.sub(r'^\s*img_path\s*=.*$', injected, content, flags=re.MULTILINE, count=1)
    else:
        # Otherwise prepend the injected variable at top
        new_content = injected + "\n" + content

    # Write to a temporary file and run it
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".py", mode="w", encoding="utf-8")
    try:
        tmp.write(new_content)
        tmp.flush()
        tmp.close()

        # Capture stdout produced by the script
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        try:
            runpy.run_path(tmp.name, run_name="__main__")
            output = sys.stdout.getvalue()
        finally:
            sys.stdout = old_stdout

    finally:
        try:
            os.remove(tmp.name)
        except OSError:
            pass

    # Parse output lines for "Predicted class:" and "Confidence:"
    parsed = {"class": None, "confidence": None, "raw_output": output}
    for line in output.splitlines():
        if "Predicted class" in line:
            parsed["class"] = line.split(":", 1)[1].strip()
        elif "Confidence" in line:
            # remove trailing % if present and convert to float when possible
            c = line.split(":", 1)[1].strip().rstrip("%").strip()
            try:
                parsed["confidence"] = float(c)
            except:
                parsed["confidence"] = c

    return parsed