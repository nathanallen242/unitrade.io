from flask import request
from ..app import app
from .controllers import ( list_all_users_controller, create_user_controller, retrieve_user_controller, update_user_controller, delete_user_controller )
from flask_jwt_extended import jwt_required, get_jwt_identity

# ----------------------------------------------- #
@app.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    print(get_jwt_identity())
    return list_all_users_controller()


@app.route('/users', methods=['POST'])
def create_users():
    return create_user_controller()


@app.route('/users/<user_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def retrieve_update_delete_users(user_id):
    if request.method == 'GET':
        return retrieve_user_controller(user_id)
    elif request.method == 'PUT':
        return update_user_controller(user_id)
    elif request.method == 'DELETE':
        return delete_user_controller(user_id)
    else:
        return 'Method not allowed'