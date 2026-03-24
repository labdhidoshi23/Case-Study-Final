import json
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

with open("intents.json") as f:
    data = json.load(f)

X, y = [], []
for intent in data["intents"]:
    if intent["tag"] == "fallback":
        continue
    for pattern in intent["patterns"]:
        X.append(pattern.lower())
        y.append(intent["tag"])

model = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2), analyzer="word")),
    ("clf", LogisticRegression(max_iter=500, C=5)),
])
model.fit(X, y)

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print(f"Model trained on {len(X)} samples across {len(set(y))} intents.")
print("Saved to model.pkl")
