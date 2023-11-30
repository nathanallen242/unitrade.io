# controllers.py
import os
import joblib

# Construct an absolute path to the model and vectorizer
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'spam_classifier.joblib')
vectorizer_path = os.path.join(current_dir, 'vectorizer.joblib')

# Load the model and vectorizer
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

def is_spam(post_text):
    # Vectorize the input text
    text_vec = vectorizer.transform([post_text])

    # Predict
    prediction = model.predict(text_vec)
    return prediction[0] == 'spam'
