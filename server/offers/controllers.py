from flask import request, jsonify
from .. import db
from ..users.models import User
from ..posts.models import Post
from .models import Offer

def create_offer():
    user_id = request.form.get('user_id')
    post_id = request.form.get('post_id')

    # Check if user and post exist
    user = User.query.get(user_id)
    post = Post.query.get(post_id)
    if not user or not post:
        return jsonify({'error': 'User or Post not found'}), 404

    # Check if offer already exists
    existing_offer = Offer.query.filter_by(user_id=user_id, post_id=post_id).first()
    if existing_offer:
        return jsonify({'error': 'Offer already exists'}), 400

    # Create and save new offer
    new_offer = Offer(user_id=user_id, post_id=post_id)
    db.session.add(new_offer)
    db.session.commit()

    return jsonify(new_offer.toDict()), 201

def get_offers_by_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    offers = [offer.toDict() for offer in user.offers]
    return jsonify(offers), 200

def complete_offer():
    user_id = request.form.get('user_id')
    post_id = request.form.get('post_id')

    # Check if user and post exist
    user = User.query.get(user_id)
    post = Post.query.get(post_id)
    if not user or not post:
        return jsonify({'error': 'User or Post not found'}), 404

    # Check if offer exists
    offer_to_complete = Offer.query.filter_by(user_id=user_id, post_id=post_id).first()
    if not offer_to_complete:
        return jsonify({'error': 'Offer does not exist'}), 400

    # Mark the offer as completed
    offer_to_complete.completed = True
    db.session.commit()

    return jsonify({'message': 'Offer successfully marked as completed'}), 200

