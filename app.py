import os
import pdfplumber
import pytesseract
import gridfs
from auth import auth_bp
from flask_cors import CORS
import google.generativeai as genai
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from PIL import Image, ImageEnhance, ImageFilter
from dotenv import load_dotenv
from fpdf import FPDF
import datetime
from io import BytesIO
from bson import ObjectId

# Load environment variables
load_dotenv()

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["ai_tutor_db"]
reports_collection = db["reports"]
fs = gridfs.GridFS(db)  # GridFS instance for PDFs

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Flask App Configuration
app = Flask(__name__)
CORS(app)  # Consider restricting to specific origins

app.config["UPLOAD_FOLDER"] = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "docx"}
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Set Tesseract path (Update as needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    img = Image.open(image_path).convert("L")
    img = img.filter(ImageFilter.SHARPEN)
    img = ImageEnhance.Contrast(img).enhance(2)
    return img

def extract_text(file_path, file_ext):
    text = ""
    try:
        if file_ext == "pdf":
            with pdfplumber.open(file_path) as pdf:
                text = "\n".join([page.extract_text() or "" for page in pdf.pages])
        elif file_ext in ["png", "jpg", "jpeg"]:
            img = preprocess_image(file_path)
            text = pytesseract.image_to_string(img, config="--psm 6")
        text = " ".join(text.split()).strip()
        return text if text else None
    except Exception as e:
        return None  # Return None so we can handle errors in API response

def generate_report(subject, text):
    if not GEMINI_API_KEY:
        return ["Error: Gemini API key is missing."]
    
    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = f"""
    Analyze the following handwritten or printed text for the subject {subject} and generate a well-structured student report card.
    Extracted Text:
    {text}
    Report Card Format:
    1. Subject: {subject}
    2. Assignment/Test Type:
    3. Key Concept:
    4. Accuracy:
    5. Strengths:
    6. Areas for Improvement:
    7. Suggestions:
    8. Overall Assessment:
    """
    
    try:
        response = model.generate_content(prompt)
        print(response.text)
        return response.text.strip().split("\n") if response.text else ["No response from Gemini AI."]
    except Exception as e:
        return [f"Error generating report: {str(e)}"]

import os
from fpdf import FPDF
from io import BytesIO

def generate_pdf(report_data):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # ✅ Load a Unicode font (DejaVuSans.ttf) if available
    font_path = os.path.join(os.getcwd(), "fonts", "DejaVuSans.ttf")
    if os.path.exists(font_path):
        pdf.add_font("DejaVu", "", font_path, uni=True)
        pdf.set_font("DejaVu", "", 11)  # Use Unicode-supported font
        print("[INFO] Using DejaVuSans font.")  
    else:
        pdf.set_font("Arial", "", 11)  # Fallback
        print("[WARNING] DejaVuSans not found, using Arial.")

    pdf.cell(200, 10, "Student Report", ln=True, align='C')
    pdf.ln(10)

    pdf.set_font("DejaVu" if os.path.exists(font_path) else "Arial", "", 12)
    pdf.cell(200, 10, f"Filename: {report_data['filename']}", ln=True)
    pdf.cell(200, 10, f"Subject: {report_data['subject']}", ln=True)
    pdf.ln(5)

    pdf.set_font("DejaVu" if os.path.exists(font_path) else "Arial", "", 11)

    for line in report_data['report']:
        try:
            # ✅ No need to encode to Latin-1 if DejaVu is used
            pdf.multi_cell(0, 10, line)
        except Exception as e:
            print(f"[ERROR] Issue in line: {line}, Error: {str(e)}")

    # ✅ Save PDF to BytesIO buffer
    pdf_output = BytesIO()
    pdf.output(pdf_output, "S")  
    pdf_output.seek(0)

    return pdf_output

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files or "subject" not in request.form:
        return jsonify({"error": "File and subject are required."}), 400

    file = request.files["file"]
    subject = request.form["subject"].strip()

    if file.filename == "" or not allowed_file(file.filename) or not subject:
        return jsonify({"error": "Invalid file format or subject missing."}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    file_ext = filename.rsplit(".", 1)[1].lower()
    text = extract_text(file_path, file_ext)
    if not text:
        print("[ERROR] Text extraction failed")  # Debugging
        return jsonify({"error": "Could not extract text from file"}), 400

    report_content = generate_report(subject, text)

    report_data = {
        "filename": filename,
        "subject": subject,
        "report": report_content,
        "timestamp": datetime.datetime.now(datetime.UTC)
    }

    # Generate PDF and store in GridFS
    try:
        pdf_file = generate_pdf(report_data)
        pdf_id = fs.put(pdf_file, filename=f"{filename}.pdf")
        report_data["pdf_id"] = str(pdf_id)  # Ensure ObjectId is converted to string
    except Exception as e:
        print(f"[ERROR] Failed to generate/store PDF: {str(e)}")  # Debugging
        return jsonify({"error": f"Failed to generate/store PDF: {str(e)}"}), 500

    # Insert report data into MongoDB
    try:
        print(f"[DEBUG] Connected to MongoDB: {db.name}")
        result = reports_collection.insert_one(report_data)
        print(f"[SUCCESS] Report inserted with ID: {result.inserted_id}")  # Debugging
    except Exception as e:
        print(f"[ERROR] MongoDB insert failed: {str(e)}")  # Debugging
        return jsonify({"error": f"Database insert failed: {str(e)}"}), 500

    return jsonify({
        "message": "Report stored successfully",
        "report_id": str(result.inserted_id),  # ✅ Add this line
        "report": {
            "filename": report_data["filename"],
            "subject": report_data["subject"],
            "report": report_data["report"],
            "timestamp": report_data["timestamp"].isoformat(),
            "pdf_id": report_data.get("pdf_id", None)
        }
    })

@app.route("/reports/<report_id>", methods=["GET"])
def get_report(report_id):
    try:
        report = reports_collection.find_one({"_id": ObjectId(report_id)})
        if not report:
            return jsonify({"error": "Report not found"}), 404

        report["_id"] = str(report["_id"])  # Convert ObjectId to string
        report["pdf_id"] = str(report.get("pdf_id", ""))  # Convert pdf_id to string (if exists)
        return jsonify({"report": report})
    
    except Exception as e:
        return jsonify({"error": f"Error fetching report: {str(e)}"}), 500

@app.route("/download/<pdf_id>", methods=["GET"])
def download_pdf(pdf_id):
    try:
        pdf_file = fs.get(ObjectId(pdf_id))
        return send_file(BytesIO(pdf_file.read()), download_name="report.pdf", as_attachment=True, mimetype="application/pdf")
    except Exception as e:
        return jsonify({"error": f"Error downloading file: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)