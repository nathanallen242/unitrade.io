from flask import jsonify, request
from ..users.models import User
from ..posts.models import Post, CategoryEnum
from ..offers.models import Offer
from .. import db

def list_users():
    users = User.query.all()
    user_count = len(users)  # Count the number of users
    return jsonify({'users': [user.toDict() for user in users], 'count': user_count}), 200


def list_posts():
    posts = Post.query.all()
    post_count = len(posts)  # Count the number of posts
    return jsonify({'posts': [post.to_dict() for post in posts], 'count': post_count}), 200


def list_offers():
    offers = Offer.query.all()
    offer_count = len(offers)  # Count the number of offers
    return jsonify({'offers': [offer.toDict() for offer in offers], 'count': offer_count}), 200


def retrieve_update_delete_users(user_id):
    if request.method == 'GET':
        user = User.query.get(user_id)
        if user:
            return jsonify(user.to_dict()), 200
        return jsonify({'message': 'User not found'}), 404

    elif request.method == 'PUT':
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.json
        user.username = data.get('name', user.name)  # Assuming 'name' is a field
        user.email = data.get('email', user.email)  # Assuming 'email' is a field
        user.profile_img_url = data.get('profile_img_url', user.profile_img_url)  # Assuming 'profile_img_url' is a field
        user.isAdmin = data.get('is_admin', user.is_admin)  # Assuming 'is_admin' is a field

        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200

    elif request.method == 'DELETE':
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200

    else:
        return jsonify({'message': 'Method not allowed'}), 405
    

def retrieve_update_delete_posts(post_id):
    if request.method == 'GET':
        post = Post.query.get(post_id)
        if post:
            return jsonify(post.to_dict()), 200
        return jsonify({'message': 'Post not found'}), 404

    elif request.method == 'PUT':
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'message': 'Post not found'}), 404

        data = request.json
        post.title = data.get('title', post.title)
        post.description = data.get('description', post.description)
        post.image_url = data.get('image_url', post.image_url)
        post.Is_Traded = data.get('Is_Traded', post.Is_Traded)
        post.category_id = CategoryEnum(data['category_id']) if 'category_id' in data else post.category_id

        db.session.commit()
        return jsonify({'message': 'Post updated successfully', 'post': post.to_dict()}), 200

    elif request.method == 'DELETE':
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'message': 'Post not found'}), 404

        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully'}), 200

    else:
        return jsonify({'message': 'Method not allowed'}), 405
