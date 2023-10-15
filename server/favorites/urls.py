
from . import controllers
from ..app import app

@app.route('/add_favorite', methods=['POST'])
def add_favorite():
    return controllers.add_favorite()

@app.route('/favorite/<int:user_id>', methods=['GET'])
def get_favorites_by_user(user_id):
    return controllers.get_favorites_by_user(user_id)

@app.route('/delete_favorite', methods=['POST'])
def delete_favorite_route():
    return controllers.delete_favorite()
