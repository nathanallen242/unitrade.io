from flask import request, jsonify
import uuid

from .. import db
from .models import User

# ----------------------------------------------- #

def list_all_users_controller():
    users = User.query.all()
    response = [user.toDict() for user in users]
    return jsonify(response)

def create_user_controller():
    request_form = request.form.to_dict()

    new_user = User(
                    username         = request_form['username'],
                    email            = request_form['email'],
                    password_hash    = request_form['password_hash'],
                    profile_img_url  = request_form.get('profile_img_url', None),
                    isAdmin          = request_form.get('isAdmin', False)
                    )
    db.session.add(new_user)
    db.session.commit()

    user_id_after_insert = new_user.user_id
    response = User.query.get(user_id_after_insert).toDict()
    return jsonify(response)

def retrieve_user_controller(user_id):
    response = User.query.get(user_id).toDict()
    return jsonify(response)

def update_user_controller(user_id):
    request_form = request.form.to_dict()
    user = User.query.get(user_id)

    user.username        = request_form['username']
    user.email           = request_form['email']
    user.password_hash   = request_form['password_hash']
    user.profile_img_url = request_form.get('profile_img_url', user.profile_img_url)
    user.isAdmin         = request_form.get('isAdmin', user.isAdmin)
    db.session.commit()

    response = User.query.get(user_id).toDict()
    return jsonify(response)

def delete_user_controller(user_id):
    User.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return ('User with Id "{}" deleted successfully!').format(user_id)