from ..app import app
from .image import classifyImage
from flask import request

@app.route('/classify', methods=['POST'])
def classify():
    if 'image' in request.files:
        file = request.files['image']
        tags = classifyImage(file)
        print(tags)
        return {'tags': tags}
