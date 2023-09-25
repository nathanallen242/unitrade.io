from flask import request
from ..app import app
from .controllers import ( list_all_posts_controller, create_post_controller, retrieve_post_controller, update_post_controller, delete_post_controller )

# ----------------------------------------------- #
@app.route('/posts', methods=['GET', 'POST'])
def list_create_posts():
    if request.method == 'GET':
        return list_all_posts_controller()
    elif request.method == 'POST':
        return create_post_controller()
    else:
        return 'Method not allowed'

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