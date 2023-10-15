@app.route('/chats', methods=['POST'])
def create_chat():
    return create_chat_controller()

# Path: server/chats/urls.py