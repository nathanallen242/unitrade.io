# urls.py
from flask import request, jsonify
from .controllers import ( is_spam )
from ..app import app
from flask_jwt_extended import jwt_required

@app.route('/check_spam', methods=['POST'])
@jwt_required()
def check_spam():
    post_data = request.json
    result = is_spam(post_data['text'])
    return jsonify({'is_spam': result})

