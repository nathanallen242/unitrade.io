from sqlalchemy import inspect
from datetime import datetime
from sqlalchemy.orm import validates
from marshmallow import validate as m_validate
from .. import db

class Chat(db.Model):
    __tablename__ = 'chats'

    chat_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    chat_id_str = db.Column(db.String, unique=True, nullable=False)
    from_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_message = db.Column(db.Text, nullable=False)
    read_by = db.Column(db.String, nullable=True)


    # Relationship with User model
    from_user = db.relationship('User', backref='sent_chats', foreign_keys=from_user_id, cascade="all, delete")
    to_user = db.relationship('User', backref='received_chats', foreign_keys=to_user_id, cascade="all, delete")


    # Relationship with Message model
    messages = db.relationship('Message', back_populates='chat', cascade="all, delete")     

    def __init__(self, from_user_id, to_user_id, chat_id_str,last_message="new chat", read_by=None):
        self.from_user_id = from_user_id
        self.to_user_id = to_user_id
        self.last_message = last_message
        self.read_by = read_by
        self.chat_id_str = chat_id_str

    def __repr__ (self):
        return f"<Chat(from_user_id={self.from_user_id}, to_user_id={self.to_user_id},create_date={self.created_at})>"


    def to_dict(self):
        return {
            "from_user_id": self.from_user_id,
            "to_user_id": self.to_user_id,
            "create_date": self.created_at.isoformat()
        }