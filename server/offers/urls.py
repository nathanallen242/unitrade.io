from . import controllers
from ..app import app
from flask_jwt_extended import jwt_required


@app.route('/create_offer', methods=['POST'])
@jwt_required()
def create_offer_route():
    return controllers.create_offer()

@app.route('/offers/<int:post_id>', methods=['GET'])
@jwt_required()
def get_offers_by_post_route(post_id):
    return controllers.get_offers_by_post(post_id)

@app.route('/offers/<int:user_id>', methods=['GET'])
@jwt_required()
def get_offers_by_user_route(user_id):
    return controllers.get_offers_by_user(user_id)


@app.route('/complete_offer', methods=['POST'])
@jwt_required()
def complete_offer_route():
    return controllers.complete_offer()
