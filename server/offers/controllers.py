from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from .. import db
from ..users.models import User
from ..posts.models import Post
from .models import Offer

def create_offer():
    data = request.get_json()  # Get data from JSON body
    user_id = data.get('user_id')
    post_id = data.get('post_id')
    
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
    # Query offers where the user_id matches
    offers = Offer.query.filter_by(user_id=user_id).all()

    # return empty list if no offers found
    if not offers:
        return jsonify([]), 200
    
    # Convert the offer objects to dictionaries if needed (assuming toDict is a method to serialize the object)
    offers_dict = [offer.toDict() for offer in offers]

    print(offers_dict)
    return jsonify(offers_dict), 200


def get_offers_by_post(post_id):
    # Query offers where the user_id matches
    offers = Offer.query.filter_by(post_id=post_id).all()

    # return empty list if no offers found
    if not offers:
        return jsonify([]), 200
    
    # Convert the offer objects to dictionaries if needed (assuming toDict is a method to serialize the object)
    offers_dict = [offer.toDict() for offer in offers]

    print(offers_dict)
    return jsonify(offers_dict), 200

def remove_offer():
    data = request.json
    user_id = data.get('user_id')  # ID of the user who made the offer
    post_id = data.get('post_id')

    # Validate input
    if not user_id or not post_id:
        return jsonify({'error': 'Invalid data provided'}), 400

    # Check if post exists
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    # Fetch the specific offer made by user_id on post_id
    offer_to_remove = Offer.query.filter_by(user_id=user_id, post_id=post_id).delete()
    if not offer_to_remove:
        return jsonify({'error': 'Offer does not exist'}), 400

    db.session.commit()

    return jsonify({'message': 'Offer successfully removed!', 'status': 200}), 200

def complete_offer():
    data = request.json
    user_id = data.get('user_id')  # ID of the user who made the offer
    post_id = data.get('post_id')

    # Validate input
    if not user_id or not post_id:
        return jsonify({'error': 'Invalid data provided'}), 400

    # Check if post exists
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    # Get the logged-in user (the post creator)
    logged_in_user_email = get_jwt_identity()
    logged_in_user = User.query.filter_by(email=logged_in_user_email).one_or_none()

    if not logged_in_user or post.makes != logged_in_user.user_id:
        return jsonify({'error': 'You do not have permission to accept this offer'}), 403

    # Fetch the specific offer made by user_id on post_id
    offer_to_complete = Offer.query.filter_by(user_id=user_id, post_id=post_id).first()
    if not offer_to_complete:
        return jsonify({'error': 'Offer does not exist'}), 400

    # Mark the offer as completed
    offer_to_complete.completed = True
    db.session.commit()

    return jsonify({'message': 'Offer successfully marked as completed'}), 200

