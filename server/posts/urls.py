from flask import request
from ..app import app
from .controllers import ( list_all_posts_controller, create_post_controller, retrieve_post_controller, update_post_controller, delete_post_controller )
from flask_jwt_extended import jwt_required

# ----------------------------------------------- #
@app.route('/posts', methods=['GET'])
def list_posts():
    return list_all_posts_controller()

@app.route('/posts', methods=['POST'])
@jwt_required()
def create_posts():
    return create_post_controller()

@app.route('/posts/<post_id>', methods=['GET', 'PUT', 'DELETE'])
def retrieve_update_delete_posts(post_id):
    if request.method == 'GET':
        return retrieve_post_controller(post_id)
    elif request.method == 'PUT':
        return update_post_controller(post_id)
    elif request.method == 'DELETE':
        return delete_post_controller(post_id)
    else:
        return 'Method not allowed'


@app.route('/posts/<post_id>', methods=['GET'])
def retrieve_posts(post_id):
    return retrieve_post_controller(post_id)


@app.route('/posts/<post_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def update_posts(post_id):
    if request.method == 'PUT':
        return update_post_controller(post_id)
    elif request.method == 'DELETE':
        return delete_post_controller(post_id)
    else:
        return 'Method not allowed'
