from flask import request, jsonify
from .. import db
from ..users.models import User
from ..posts.models import Post
from .models import Favorite

def add_favorite():
    user_id = request.form.get('user_id')
    post_id = request.form.get('post_id')

    # Check if user and post exist
    user = User.query.get(user_id)
    post = Post.query.get(post_id)
    if not user or not post:
        return jsonify({'error': 'User or Post not found'}), 404

    # Check if favorite already exists
    existing_favorite = Favorite.query.filter_by(user_id=user_id, post_id=post_id).first()
    if existing_favorite:
        return jsonify({'error': 'Favorite already exists'}), 400

    # Create and save new favorite
    new_favorite = Favorite(user_id=user_id, post_id=post_id)
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify(new_favorite.toDict()), 201  

def get_favorites_by_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    favorites = [fav.toDict() for fav in user.favorites]  
    return jsonify(favorites), 200



def delete_favorite():
    user_id = request.form.get('user_id')
    post_id = request.form.get('post_id')

    # Check if user and post exist
    user = User.query.get(user_id)
    post = Post.query.get(post_id)
    if not user or not post:
        return jsonify({'error': 'User or Post not found'}), 404

    # Check if favorite exists
    favorite_to_delete = Favorite.query.filter_by(user_id=user_id, post_id=post_id).first()
    if not favorite_to_delete:
        return jsonify({'error': 'Favorite does not exist'}), 400

    # Delete the favorite
    db.session.delete(favorite_to_delete)
    db.session.commit()

    return jsonify({'message': 'Favorite successfully deleted'}), 200
