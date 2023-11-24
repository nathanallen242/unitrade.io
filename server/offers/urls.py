from .controllers import ( create_offer, remove_offer, get_offers_by_post, get_offers_by_user, accept_offer )
from ..app import app
from flask_jwt_extended import jwt_required


@app.route('/create_offer', methods=['POST'])
@jwt_required()
def create_offer_route():
    return create_offer()

@app.route('/offers/post/<int:post_id>', methods=['GET'])
@jwt_required()
def get_offers_by_post_route(post_id):
    return get_offers_by_post(post_id)

@app.route('/offers/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_offers_by_user_route(user_id):
    return get_offers_by_user(user_id)


@app.route('/complete_offer', methods=['POST'])
@jwt_required()
def complete_offer_route():
    return accept_offer()


@app.route('/remove_offer', methods=['DELETE'])
@jwt_required()
def remove_offer_route():
    return remove_offer()
