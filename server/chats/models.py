from sqlalchemy import inspect, Enum
from datetime import datetime
from sqlalchemy.orm import validates
from marshmallow import validate as m_validate
from .. import db


    

class Chat(db.Model):
    __tablename__ = 'chats'

    chat_id = Column(Integer, primary_key=True, autoincrement=True)
    chat_id_str = Column(String, unique=True, nullable=False)
    from_user_id = db.Column(Integer, ForeignKey('users.user_id'), nullable=False)
    to_user_id = db.Column(Integer, ForeignKey('users.user_id'), nullable=False)
    last_message = Column(String, default="new chat")
    read_by = Column(ARRAY(Integer), default=[])
    create_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    

    def __init__(self, from_user_id, to_user_id, last_message, read_by, create_date):
        self.from_user_id = from_user_id
        self.to_user_id = to_user_id
        self.last_message = last_message
        self.read_by = read_by
        self.create_date = create_date

    def __repr__ (self):
        return f"<Chat(from_user_id={self.from_user_id}, to_user_id={self.to_user_id}, last_message={self.last_message},read_by={self.read_by}, create_date={self.create_date})>"


    def to_dict(self):
        return {
            "from_user_id": self.from_user_id,
            "to_user_id": self.to_user_id,
            "last_message": self.last_message,
            "read_by": self.read_by,
            "create_date": self.create_date.isoformat()
        }