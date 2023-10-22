
from . import controllers
from ..app import app
from flask_jwt_extended import jwt_required


@app.route('/add_favorite', methods=['POST'])
@jwt_required()
def add_favorite():
    return controllers.add_favorite()


@app.route('/favorite/<int:user_id>', methods=['GET'])
@jwt_required()
def get_favorites_by_user(user_id):
    return controllers.get_favorites_by_user(user_id)


@app.route('/delete_favorite', methods=['POST'])
@jwt_required()
def delete_favorite_route():
    return controllers.delete_favorite()
