import os
import jwt
import datetime
import bcrypt
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY")
# print(SECRET_KEY) for debugging

db_client = MongoClient(MONGO_URI)
db = db_client["ai_tutor_db"]
students_collection = db["students"]
faculty_collection = db["faculty"]

auth_bp = Blueprint("auth", __name__)

def generate_token(user_id, role):
    payload = {
        "user_id": str(user_id),
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    role = data.get("role")  # 'student' or 'faculty'
    email = data.get("email")
    password = data.get("password")

    if not role or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    collection = students_collection if role == "student" else faculty_collection
    existing_user = collection.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "User already exists"}), 409
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_id = collection.insert_one({"email": email, "password": hashed_password.decode('utf-8'), "role": role}).inserted_id
    token = generate_token(user_id, role)
    
    return jsonify({"message": "User registered successfully", "token": token})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    role = data.get("role")
    email = data.get("email")
    password = data.get("password")
    
    if not role or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    collection = students_collection if role == "student" else faculty_collection
    user = collection.find_one({"email": email})
    
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
        return jsonify({"error": "Invalid credentials"}), 401
    
    token = generate_token(user["_id"], role)
    return jsonify({"message": "Login successful", "token": token})


def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload  # Contains user_id and role
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@auth_bp.route("/protected", methods=["GET"])
def protected_route():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Token missing"}), 401
    
    payload = verify_token(token.split(" ")[-1])
    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 403
    
    return jsonify({"message": "Access granted", "user": payload})
