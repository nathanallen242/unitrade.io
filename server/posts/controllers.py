from flask import request, jsonify
from .. import db
from .models import Post, CategoryEnum

# ----------------------------------------------- #

def list_all_posts_controller():
    posts = Post.query.all()
    response = [post.to_dict() for post in posts]
    return jsonify(response)

def create_post_controller():
    data = request.json
    
    new_post = Post(
                    makes=data['makes'],
                    title=data['title'],
                    description=data.get('description', None),
                    image_url=data.get('image_url', None),
                    Is_Traded=data.get('Is_Traded', False),
                    category_id=CategoryEnum(data['category_id'])
                    )
    db.session.add(new_post)
    db.session.commit()
    
    response_data = {
        "message": "Post created successfully!",
        "status": 201
    }

    return jsonify(response_data), 201

def retrieve_post_controller(post_id):
    response = Post.query.get(post_id).to_dict()
    return jsonify(response)

def update_post_controller(post_id):
    data = request.json
    post = Post.query.get(post_id)

    post.title       = data['title']
    post.description = data.get('description', post.description)
    post.image_url   = data.get('image_url', post.image_url)
    post.Is_Traded   = data.get('Is_Traded', post.Is_Traded)
    post.category_id = CategoryEnum(data['category_id'])
    db.session.commit()

    response = post.to_dict()
    return jsonify(response)

def delete_post_controller(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"message": "Post not found!"}), 404
    
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted successfully!"})