import os
import pdfplumber
import pytesseract
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
from PIL import Image
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "docx"}

# Ensure the upload folder exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text(file_path, file_ext):
    """Extracts text from PDFs, Images, or DOCX files"""
    text = ""
    if file_ext == "pdf":
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() or "" for page in pdf.pages])
    elif file_ext in ["png", "jpg", "jpeg"]:
        text = pytesseract.image_to_string(Image.open(file_path))
    return text.strip()

def generate_report(text):
    """Generates a report using Gemini AI"""
    if not GEMINI_API_KEY:
        return "Gemini API key is missing."
    
    model = genai.GenerativeModel("gemini-pro")
    prompt = f"Analyze the following text and provide a detailed report with feedback:\n\n{text}"
    
    response = model.generate_content(prompt)
    return response.text.strip() if response.text else "No response from Gemini."

@app.route("/")
def index():
    """Render the HTML upload page"""
    return render_template("index.ejs")

@app.route("/upload", methods=["POST"])
def upload_file():
    """Handles file upload and processing"""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file format"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    file_ext = filename.rsplit(".", 1)[1].lower()
    text = extract_text(file_path, file_ext)

    if not text:
        return jsonify({"error": "Could not extract text from file"}), 400

    report = generate_report(text)

    return jsonify({"filename": filename, "report": report})

if __name__ == "__main__":
    app.run(debug=True)
