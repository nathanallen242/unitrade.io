from ..app import app
from .controllers import ( get_messages_by_chat_id, add_message_controller )
from flask_jwt_extended import jwt_required


# Endpoint to add a new message
@app.route('/messages', methods=['POST'])
@jwt_required()
def add_message():
    return add_message_controller()


# Endpoint to get all messages by chat ID
@app.route('/messages/<int:id>', methods=['GET'])
@jwt_required()
def get_messages(id):
    return get_messages_by_chat_id(id)
    