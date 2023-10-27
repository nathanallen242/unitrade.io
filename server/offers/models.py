from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .. import db  # Ensure this import is correct based on your project structure

class Offer(db.Model):
    __tablename__ = 'offers'

    post_id = Column(Integer, ForeignKey('posts.post_id', ondelete="CASCADE"), primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete="CASCADE"), primary_key=True)
    offer_date = Column(DateTime, default=datetime.utcnow)
    completed = Column(Boolean, default=False)

    # Relationships
    user = relationship('User', backref='offers', cascade="all, delete-orphan")
    post = relationship('Post', backref='offers', cascade="all, delete-orphan")

    def toDict(self):
        return {
            'post_id': self.post_id,
            'user_id': self.user_id,
            'offer_date': self.offer_date.strftime('%Y-%m-%d %H:%M:%S'),
            'completed': self.completed
        }
