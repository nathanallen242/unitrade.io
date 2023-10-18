from datetime import datetime
from datetime import datetime
from .. import db

class Message(db.Model):
    __tablename__ = 'messages'

    message_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chats.chat_id'), nullable=False)
    text = db.Column(db.String, nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Define a relationship to the Chat model
    chat = db.relationship('Chat', back_populates='messages')

    # Define a relationship to the User model (sender)
    sender = db.relationship('User', back_populates='sent_messages')


    def __init__(self, chat, text, sender):
        self.chat = chat
        self.text = text
        self.sender = sender

    def __repr__(self):
        return f"<Message(message_id={self.message_id}, chat_id={self.chat_id}, text={self.text}, sender_id={self.sender_id}, timestamp={self.timestamp})>"