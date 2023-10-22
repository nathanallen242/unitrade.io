from ..app import app
from .controllers import create_chat_controller
from flask_jwt_extended import jwt_required


@app.route('/chats', methods=['POST'])
@jwt_required()
def create_chat():
    return create_chat_controller()

# Path: server/chats/urls.py