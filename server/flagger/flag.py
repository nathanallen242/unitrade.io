# flag.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score
import joblib  # For model serialization

def train_model():
    # Load dataset
    from dataset import load_data
    data = load_data()

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(data['text'], data['label'], test_size=0.2, random_state=42)

    # Vectorize text
    vectorizer = CountVectorizer()
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Train Naive Bayes Classifier
    model = MultinomialNB()
    model.fit(X_train_vec, y_train)

    # Save the model and vectorizer
    joblib.dump(model, 'spam_classifier.joblib')
    joblib.dump(vectorizer, 'vectorizer.joblib')

    # Evaluate model
    y_pred = model.predict(X_test_vec)
    print("Accuracy:", accuracy_score(y_test, y_pred))

if __name__ == '__main__':
    train_model()
