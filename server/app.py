from flask import Flask
from datetime import datetime
from config import db
from models.user import User
from models.chat import Chat
from models.message import Message
from models.posts import Post

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:12345@localhost/unitrade'
db.init_app(app)

# Create the database tables
@app.cli.command("initdb")
def initdb_command():
    """Initialize the database."""
    db.create_all()
    print("Database initialized.")


# Default route
@app.route('/')
def index():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(debug=True)