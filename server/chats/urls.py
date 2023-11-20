from ..app import app
from .controllers import create_chat_controller, get_chats_controller
from flask_jwt_extended import jwt_required
from flask import request


@app.route('/chats', methods=['POST'])
@jwt_required()
def create_chat():
    return create_chat_controller()

# Path: server/chats/urls.py

@app.route('/chats', methods=['GET'])
@jwt_required()
def get_chats():
    id = request.args.get('id')
    return get_chats_controller(id)