from ..app import app
from flask_jwt_extended import jwt_required
from .controllers import (list_users as list_users_ctrl, list_posts as list_posts_ctrl, list_offers as list_offers_ctrl, retrieve_update_delete_users as rud_users, retrieve_update_delete_posts as rud_posts)

@app.route('/admin/users', methods=['GET'])
@jwt_required()
def list_users_route():
    return list_users_ctrl()

@app.route('/admin/posts', methods=['GET'])
@jwt_required()
def list_posts_route():
    return list_posts_ctrl()

@app.route('/admin/offers', methods=['GET'])
@jwt_required()
def list_offers_route():
    return list_offers_ctrl()

@app.route('/admin/users/<user_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def retrieve_update_delete_users_route(user_id):
    return rud_users(user_id)

@app.route('/admin/posts/<post_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def retrieve_update_delete_posts_route(post_id):
    return rud_posts(post_id)
