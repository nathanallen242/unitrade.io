from flask import request, jsonify
from .models import Chat  # Import the Chat model from your models module
from ..users.models import User  # Import the User model from your users module
from .. import db  # Import the SQLAlchemy db instance
from datetime import datetime
from sqlalchemy import or_

def create_chat_controller():
    # Extract data from the request

    data = request.get_json()
    from_user_id = data.get('from_user_id')
    to_user_id = data.get('to_user_id')

    #check if chat already exists
    chatid_str= str(from_user_id) + str(to_user_id) if str(from_user_id) > str(to_user_id) else str(to_user_id) + str(from_user_id) #uniquely indetifies a chat between two users

    exists = Chat.query.filter_by(chat_id_str=chatid_str).first()

    if exists:
        # If the chat already exists, return a response indicating that
        return jsonify({'message': 'Chat already exists'}, 400)
    else:
        # Create a new chat instance 
        chat = Chat(
            from_user_id=from_user_id,
            to_user_id=to_user_id,
            chat_id_str=chatid_str
        )

        # Add the chat to the database session
        db.session.add(chat)

        try:
            # Commit the changes to the database
            db.session.commit()
            return jsonify({'message': 'Chat created successfully'}, 201)
        except Exception as e:
            # Handle any exceptions or errors
            db.session.rollback()
            print(str(e))
            return jsonify({'message': 'Error creating chat'}, 500)


def get_chats_controller(id):
    # Extract the query parameters from the request
    user_id = id

    print(user_id)

    # Query the database for chats that match the query parameters
    chats = Chat.query.filter(
        (Chat.from_user_id == user_id) | (Chat.to_user_id == user_id)
    ).all()
    print(chats)

    # Create a list of chats
    chats_list = []

    for chat in chats:
        # Fetch user details for the from_user_id
        from_user = User.query.get(chat.from_user_id)
        from_user_info = {
            'user_id': from_user.user_id,
            'username': from_user.username,
            'email': from_user.email,
            # Add any other user details you want to include
        }

        # Fetch user details for the to_user_id
        to_user = User.query.get(chat.to_user_id)
        to_user_info = {
            'user_id': to_user.user_id,
            'username': to_user.username,
            'email': to_user.email,
            # Add any other user details you want to include
        }

        chats_list.append({
            'from_user': from_user_info,
            'to_user': to_user_info,
            'create_date': chat.created_at.isoformat(),
            'chat_id': chat.chat_id
        })

    # Return a JSON response containing the list of chats with user information
    return jsonify({'chats': chats_list, 'status': 200})