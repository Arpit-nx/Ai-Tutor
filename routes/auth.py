from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database import db
from models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(username=data["username"], email=data["email"], password=data["password"])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if user and user.check_password(data["password"]):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token})
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({"username": user.username, "email": user.email})
