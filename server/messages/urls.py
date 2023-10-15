from .controllers import ( get_messages_by_chat_id, add_message )

# Endpoint to add a new message
@app.route('/messages/add', methods=['POST'])
def add_message():
    return add_message_controller()


# Endpoint to get all messages by chat ID
@app.route('/messages/<int:chat_id>', methods=['GET'])
def get_messages(chat_id):
    return get_messages_by_chat_id(chat_id)
    