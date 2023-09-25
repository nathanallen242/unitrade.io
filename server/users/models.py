from sqlalchemy import inspect
from datetime import datetime
from sqlalchemy.orm import validates
from marshmallow import validate as m_validate
from .. import db

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    join_date = db.Column(db.Date, default=datetime.utcnow)
    profile_img_url = db.Column(db.String(500))
    isAdmin = db.Column(db.Boolean, default=False)
    
    # Relationship with Post model
    posts = db.relationship('Post', back_populates='maker')

    def __init__(self, username, email, password_hash, profile_img_url=None, isAdmin=False):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.profile_img_url = profile_img_url
        self.isAdmin = isAdmin
    
    @validates('title')
    def validate_title(self, key, title):
        validator = m_validate.Length(min=1, max=255, error="Title must be between 1 and 255 characters.")
        validator(title)
        return title

    @validates('description')
    def validate_description(self, key, description):
        if not description:  # Allowing description to be optional
            return description
        validator = m_validate.Length(min=1, error="Description must be at least 1 character long.")
        validator(description)
        return description

    def toDict(self):
        return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }

    def __repr__(self):
        return f"<User(user_id={self.user_id}, username={self.username}, email={self.email})>"