from flask import Blueprint, request, jsonify

tutor_bp = Blueprint("tutor", __name__)

@tutor_bp.route("/ask", methods=["POST"])
def ask_tutor():
    data = request.get_json()
    question = data.get("question", "")
    response = {"message": f"AI response for: {question}"}
    return jsonify(response)
