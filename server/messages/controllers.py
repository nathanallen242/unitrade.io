from flask import request, jsonify
from .models import Message
from ..chats.models import Chat
from ..users.models import User
from .. import db

def add_message_controller():
    try:
        # Extract data from the JSON request
        data = request.get_json()
        chat_id = data.get('chat_id')
        text = data.get('text')
        sender_id = data.get('sender_id')

        if not chat_id or not text or not sender_id:
            return jsonify({"error": "Missing required data"}), 400

        # Retrieve instances of Chat and User models based on the provided IDs
        chat = Chat.query.get(chat_id)
        sender = User.query.get(sender_id)

        # Check if the chat and sender exist
        if not chat or not sender:
            return jsonify({"error": "Invalid chat_id or sender_id"}), 400

        # Create a new message
        new_message = Message(
            chat=chat,
            text=text,
            sender=sender
        )

        db.session.add(new_message)
        db.session.commit()

        return jsonify({"message": "successfuly created new message"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500




def get_messages_by_chat_id():
    data = request.get_json()
    try:
        # Query the database for messages with the specified chat_id
        messages = Message.query.filter_by(chat_id=data.get("chat_id")).all()

        # Convert the messages to a list of dictionaries
        message_list = []
        for message in messages:
            message_data = {
                'message_id': message.message_id,
                'chat_id': message.chat_id,
                'text': message.text,
                'sender_id': message.sender_id
                # Add more fields as needed
            }
            message_list.append(message_data)

        return jsonify({"messages": message_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500