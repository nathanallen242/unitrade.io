from sqlalchemy import inspect, Enum
from datetime import datetime
from sqlalchemy.orm import validates
from marshmallow import validate as m_validate
from .. import db
import enum


class CategoryEnum(enum.Enum):
    ELECTRONICS = "Electronics"
    CLOTHING = "Clothing"
    HOME = "Home"
    BOOKS = "Books"
    SPORTS = "Sports"
    

class Post(db.Model):
    __tablename__ = 'posts'
    
    post_id = db.Column(db.Integer, primary_key=True)
    makes = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    category_id = db.Column(Enum(CategoryEnum), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, None)
    post_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    image_url = db.Column(db.String(500))
    Is_Traded = db.Column(db.Boolean, default=False)
    
    # Relationship with User model
    maker = db.relationship('User', back_populates='posts', cascade="all, delete")

    
    @validates('title', 'description', 'image_url')
    def validate_fields(self, key, value):
        if key == 'title' and not value:
            raise ValueError("Title cannot be empty.")
        if key == 'description' and not value:
            raise ValueError("Description cannot be empty.")
        return value

    def __init__(self, makes, category_id, title, description=None, image_url=None, Is_Traded=False):
        self.makes = makes
        self.category_id = category_id
        self.title = title
        self.description = description
        self.image_url = image_url
        self.Is_Traded = Is_Traded

    def __repr__(self):
        return f"<Post(post_id={self.post_id}, title={self.title}, makes={self.makes})>"

    def to_dict(self):
        return {
            "post_id": self.post_id,
            "makes": self.makes,
            "category_id": self.category_id.value,
            "title": self.title,
            "description": self.description,
            "post_date": self.post_date.isoformat(),
            "image_url": self.image_url,
            "Is_Traded": self.Is_Traded
        }