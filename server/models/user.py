from datetime import datetime
from . import db

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    join_date = db.Column(db.Date, default=datetime.utcnow)
    profile_img_url = db.Column(db.String(500))
    isAdmin = db.Column(db.Boolean, default=False)

    def __init__(self, username, email, password_hash, profile_img_url=None, isAdmin=False):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.profile_img_url = profile_img_url
        self.isAdmin = isAdmin

    def __repr__(self):
        return f"<User(user_id={self.user_id}, username={self.username}, email={self.email})>"