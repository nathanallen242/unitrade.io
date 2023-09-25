from flask import request
from ..app import app
from .controllers import ( list_all_users_controller, create_user_controller, retrieve_user_controller, update_user_controller, delete_user_controller )

# ----------------------------------------------- #
@app.route('/users', methods=['GET', 'POST'])
def list_create_users():
    if request.method == 'GET':
        return list_all_users_controller()
    elif request.method == 'POST':
        return create_user_controller()
    else:
        return 'Method not allowed'

@app.route('/users/<user_id>', methods=['GET', 'PUT', 'DELETE'])
def retrieve_update_delete_users(user_id):
    if request.method == 'GET':
        return retrieve_user_controller(user_id)
    elif request.method == 'PUT':
        return update_user_controller(user_id)
    elif request.method == 'DELETE':
        return delete_user_controller(user_id)
    else:
        return 'Method not allowed'