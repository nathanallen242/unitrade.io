from datetime import datetime
from .chat import Chat
from config import db

class Message(db.Model):
    __tablename__ = 'messages'

    message_id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, nullable=False)
    user2_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.String(500), nullable=False)
    sent_date = db.Column(db.DateTime, default=datetime.utcnow)

    # Here's the composite foreign key
    __table_args__ = (
        db.ForeignKeyConstraint([user1_id, user2_id], [Chat.user1_id, Chat.user2_id]),
    )

    