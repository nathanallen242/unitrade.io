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
    print(data.get('image_url', None))
    
    new_post = Post(
                    makes=data['makes'],
                    title=data['title'],
                    description=data.get('description', None),
                    image_url=data.get('imageUrl', None),
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

def get_posts_by_user(user_id):
    try:
        # Query your database for posts where the 'makes' attribute matches 'user_id'
        posts = Post.query.filter_by(makes=user_id).all()
        # Convert the post objects to a list of dictionaries
        post_list = [post.to_dict() for post in posts]  # Assuming you have a to_dict method in your Post model
        return jsonify(post_list)
    except Exception as e:
        # Handle any exceptions, such as database errors
        return jsonify({"error": str(e)}), 500

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
    result = Post.query.filter_by(post_id=post_id).delete()
    db.session.commit()

    if result == 0:  # Check if no rows were deleted
        return jsonify({"message": "Post not found!"}), 404

    return jsonify({"message": "Post deleted successfully!"})
