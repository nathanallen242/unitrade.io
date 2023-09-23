from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost/unitrade'
db = SQLAlchemy(app)

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


# Default route
@app.route('/')
def index():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(debug=True)