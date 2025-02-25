import os
import pdfplumber
import pytesseract
from flask_cors import CORS
import google.generativeai as genai
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image, ImageEnhance, ImageFilter
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Configure Flask
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

app.config["UPLOAD_FOLDER"] = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "docx"}

# Ensure the upload folder exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Set Tesseract path (Windows only, update path as needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def allowed_file(filename):
    """Check if file is allowed based on extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    """Enhance image quality for better OCR accuracy."""
    img = Image.open(image_path).convert("L")  # Convert to grayscale
    img = img.filter(ImageFilter.SHARPEN)  # Sharpen the image
    img = ImageEnhance.Contrast(img).enhance(2)  # Increase contrast
    return img

def extract_text(file_path, file_ext):
    """Extracts text from PDFs, Images (OCR for Handwritten & Printed), or DOCX files"""
    text = ""

    if file_ext == "pdf":
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() or "" for page in pdf.pages])

    elif file_ext in ["png", "jpg", "jpeg"]:
        img = preprocess_image(file_path)  # Preprocess image
        text = pytesseract.image_to_string(img, config="--psm 6")  # Use Page Segmentation Mode 6

    # Remove excessive spaces, newlines, and special characters
    text = " ".join(text.split())
    return text.strip()

def generate_report(text):
    """Generates a structured, clear, and concise report using Gemini AI."""
    if not GEMINI_API_KEY:
        return "Gemini API key is missing."
    
    model = genai.GenerativeModel("gemini-pro")
    prompt = f"""
    Analyze the following handwritten or printed text and generate a clear, structured, and concise report:

    **Extracted Text:** 
    {text}

    **Report Format:** 
    - **Summary**: Provide a short summary of the extracted text.
    - **Key Points**: List the most important details found.
    - **Corrections (if needed)**: Identify and suggest improvements for unclear words or phrases.
    - **Possible Meaning**: Provide an interpretation of what the text might convey.
    - **Suggestions**: Provide recommendations to improve clarity, structure, or readability.

    Ensure the report is well-structured and easy to understand.
    """

    response = model.generate_content(prompt)
    return response.text.strip() if response.text else "No response from Gemini."

@app.route("/", methods=["GET"])
def home():
    """Simple API route for testing"""
    return jsonify({"message": "Flask backend is running!"})

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
