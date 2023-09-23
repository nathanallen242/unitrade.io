from datetime import datetime
from config import db

class Chat(db.Model):
    __tablename__ = "chats"

    user1_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key = True, nullable = False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key = True, nullable = False)
    chat_creation_date = db.Column(db.DateTime, default=datetime.utcnow)
