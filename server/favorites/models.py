from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .. import db  # Ensure this import is correct based on your project structure

from ..users.models import User

from ..posts.models import Post

class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    user_id = Column(Integer, ForeignKey('users.user_id'), primary_key=True)
    post_id = Column(Integer, ForeignKey('posts.post_id'), primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)  # Additional data

    # Relationships
    user = relationship('User', back_populates='favorites')
    post = relationship('Post', back_populates='favorites')
    
    def toDict(self):
        return {
            'user_id': self.user_id,
            'post_id': self.post_id,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')  # Convert datetime object to string
        }

# Update User and Post models to include the relationship with Favorite
User.favorites = relationship('Favorite', back_populates='user')
Post.favorites = relationship('Favorite', back_populates='post')