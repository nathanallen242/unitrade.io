from ..app import bcrypt
from flask import request, jsonify
from .. import db
from .models import User

# ----------------------------------------------- #

def list_all_users_controller():
    users = User.query.all()
    response = [user.toDict() for user in users]
    return jsonify(response)


def create_user_controller():
    request_form = request.form.to_dict()
    
    # Check if a user with the provided username or email already exists
    existing_user_by_username = User.query.filter_by(username=request_form['username']).first()
    existing_user_by_email = User.query.filter_by(email=request_form['email']).first()
    
    if existing_user_by_username:
        return jsonify({"error": "A user with this username already exists!"}), 400
    
    if existing_user_by_email:
        return jsonify({"error": "A user with this email already exists!"}), 400
    
    # If no existing user, then proceed to create a new user
    new_user = User(
                    username         = request_form['username'],
                    email            = request_form['email'],
                    password_hash    = bcrypt.generate_password_hash(request_form['password_hash']).decode('utf-8'),
                    profile_img_url  = request_form.get('profile_img_url', None),
                    isAdmin          = request_form.get('isAdmin', False)
                    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully!"}), 201



def retrieve_user_controller(user_id):
    response = User.query.get(user_id).toDict()
    return jsonify(response)


def update_user_controller(user_id):
    request_form = request.form.to_dict()
    user = User.query.get(user_id)

    user.username        = request_form['username']
    user.email           = request_form['email']
    user.password_hash   = bcrypt.generate_password_hash(request_form['password_hash']).decode('utf-8')
    user.profile_img_url = request_form.get('profile_img_url', user.profile_img_url)
    user.isAdmin         = request_form.get('isAdmin', user.isAdmin)
    db.session.commit()

    response = User.query.get(user_id).toDict()
    return jsonify(response)


def delete_user_controller(user_id):
    User.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    # Return a JSON response with a message and status code
    return jsonify({'message': f'User with ID "{user_id}" deleted successfully!', 'status': 200}), 200