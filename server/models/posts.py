from datetime import datetime
from . import db
from .users import User

class Post(db.Model):
    __tablename__ = 'posts'
    
    post_id = db.Column(db.Integer, primary_key=True)
    makes = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    # category_id can be added here once its details are provided
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    post_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    image_url = db.Column(db.String(500))
    Is_Traded = db.Column(db.Boolean, default=False)
    
    # Relationship with User model
    maker = db.relationship('User', backref=db.backref('posts', lazy=True))

    def __init__(self, makes, title, description=None, image_url=None, Is_Traded=False):
        self.makes = makes
        self.title = title
        self.description = description
        self.image_url = image_url
        self.Is_Traded = Is_Traded

    def __repr__(self):
        return f"<Post(post_id={self.post_id}, title={self.title}, makes={self.makes})>"
