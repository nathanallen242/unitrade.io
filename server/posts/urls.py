from flask import request
from ..app import app
from .controllers import ( get_posts_by_user, list_all_posts_controller, create_post_controller, retrieve_post_controller, update_post_controller, delete_post_controller )
from flask_jwt_extended import jwt_required

# ----------------------------------------------- #
@app.route('/posts', methods=['GET'])
def list_posts():
    return list_all_posts_controller()

@app.route('/posts', methods=['POST'])
@jwt_required()
def create_posts():
    return create_post_controller()


@app.route('/posts/<post_id>', methods=['GET'])
def retrieve_posts(post_id):
    return retrieve_post_controller(post_id)

@app.route('/posts/user/<int:user_id>', methods=['GET'])
def get_user_posts(user_id):
    return get_posts_by_user(user_id)


@app.route('/posts/<post_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def update_posts(post_id):
    if request.method == 'PUT':
        return update_post_controller(post_id)
    elif request.method == 'DELETE':
        return delete_post_controller(post_id)
    else:
        return 'Method not allowed'
