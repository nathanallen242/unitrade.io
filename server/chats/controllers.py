from flask import request, jsonify
from .models import Chat  # Import the Chat model from your models module
from .. import db  # Import the SQLAlchemy db instance

def create_chat_controller():
    # Extract data from the request
    data = request.get_json()

    from_user_id = data.get('from_user_id')
    to_user_id = data.get('to_user_id')
    last_message = data.get('last_message', "new chat")
    read_by = data.get('read_by', [])
    create_date = datetime.utcnow()  # You can use the current datetime

    # Create a new chat instance
    chat = Chat(
        from_user_id=from_user_id,
        to_user_id=to_user_id,
        last_message=last_message,
        read_by=read_by,
        create_date=create_date
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
        return jsonify({'message': 'Error creating chat'}, 500)
