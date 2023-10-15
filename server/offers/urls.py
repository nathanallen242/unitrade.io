
from . import controllers
from ..app import app

@app.route('/create_offer', methods=['POST'])
def create_offer_route():
    return controllers.create_offer()

@app.route('/offers/<int:user_id>', methods=['GET'])
def get_offers_by_user_route(user_id):
    return controllers.get_offers_by_user(user_id)

@app.route('/complete_offer', methods=['POST'])
def complete_offer_route():
    return controllers.complete_offer()
