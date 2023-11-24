import os
from . import create_app # from __init__ file
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# App Initialization
app = create_app(os.getenv("CONFIG_MODE"))
bcrypt = Bcrypt(app)
CORS(app)


# ----------------------------------------------- #

# Hello World!
@app.route('/')
def hello():
    return "Hello World!"

# ----------------------------------------------- #
from .auth import urls as auth_urls
from .users import urls as users_urls
from .posts import urls as posts_urls
from .favorites import urls as favorite_urls
from .offers import urls as offers_urls
from .chats import urls as chats_urls
from .messages import urls as messages_urls
from .admin import urls as admin_urls
from .classifier import urls as classifier_urls

# ----------------------------------------------- #

if __name__ == "__main__":
    app.run()
