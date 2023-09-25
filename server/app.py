import os

# App Initialization
from . import create_app # from __init__ file
app = create_app(os.getenv("CONFIG_MODE"))

# ----------------------------------------------- #

# Hello World!
@app.route('/')
def hello():
    return "Hello World!"

from .users import urls as users_urls
from .posts import urls as posts_urls

# ----------------------------------------------- #

if __name__ == "__main__":
    app.run()