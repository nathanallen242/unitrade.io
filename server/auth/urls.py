import json
import os
from ..app import app
from ..users.models import User
from flask import Flask, request, jsonify
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route('/login', methods=["POST"])
def create_token():
    username = request.json.get("username", None)
    email = request.json.get("email", None)
    password = request.json.get("password_hash", None)

    # Check if all necessary credentials are provided
    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400
    
    # Check if user exists
    user = User.query.filter_by(email=email).first()  # Assuming you have a User model

    # If user doesn't exist or password is incorrect, return an error
    if not user:
        return jsonify({"msg": "User does not exist"}), 401

    if not user.check_password(password):
        return jsonify({"msg": "Incorrect password"}), 401


    access_token = create_access_token(identity=email)
    response = {"access_token":access_token}
    return response


@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response