from sqlalchemy import inspect
from datetime import datetime
from sqlalchemy.orm import validates
from marshmallow import validate as m_validate, ValidationError
import re
from ..app import bcrypt
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

    # Relationship with Message model
    sent_messages = db.relationship('Message', back_populates='sender')

    @validates('username')
    def validate_username(self, key, username):
        validator = m_validate.Length(min=3, max=50, error="Username must be between 3 and 50 characters.")
        validator(username)
        
        if not re.match("^[a-zA-Z0-9_]*$", username):
            raise ValidationError("Username can only contain letters, numbers, and underscores.")
        return username
    

    def __init__(self, username, email, password_hash, profile_img_url=None, isAdmin=False):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.profile_img_url = profile_img_url
        self.isAdmin = isAdmin

    def toDict(self):
        return { c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs }
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User(user_id={self.user_id}, username={self.username}, email={self.email})>"