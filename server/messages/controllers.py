from flask import request, jsonify
from .models import Message
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

        # Create a new message
        new_message = Message(
            chat_id=chat_id,
            text=text,
            sender_id=sender_id
        )

        db.session.add(new_message)
        db.session.commit()

        return jsonify({"message": "Message added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500



def get_messages_by_chat_id(chat_id):
    try:
        # Query the database for messages with the specified chat_id
        messages = Message.query.filter_by(chat_id=chat_id).all()

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