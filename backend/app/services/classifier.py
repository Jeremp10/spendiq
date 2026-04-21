import os
import joblib

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


MODEL_PATH = "transaction_classifier.pkl"



#small starter training set
training_data = [
    ("starbucks", "Food & Dining"),
    ("mcdonalds", "Food & Dining"),
    ("uber", "Transport"),
    ("shell gas", "Transport"),
    ("netflix", "Entertainment"),
    ("amazon", "Shopping"),
    ("walmart", "Groceries"),
    ("uber eats", "Food & Dining"),
    ("restaurant", "Food & Dining"),
    ("lyft", "Transport"),
    ("parking", "Transport"),
    ("spotify", "Entertainment"),
    ("cinema", "Entertainment"),
    ("pharmacy", "Health"),
    ("gym", "Health"),
    ("electricity bill", "Utilities"),
    ("internet", "Utilities"),

]

descriptions = [item[0] for item in training_data]
categories = [item[1] for item in training_data]

def train_model():
    model = Pipeline([
        ("tfidf", TfidfVectorizer()),
        ("classifier", LogisticRegression())
    ])

    model.fit(descriptions, categories)

    joblib.dump(model, MODEL_PATH)

    return model

def load_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)

    return train_model()


model = load_model()


def predict_category(description: str):
    prediction = model.predict([description.lower()])
    return prediction[0]
