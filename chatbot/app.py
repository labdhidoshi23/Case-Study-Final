import json
import pickle
import random
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

with open("intents.json") as f:
    intents_data = json.load(f)

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

responses_map = {i["tag"]: i["responses"] for i in intents_data["intents"]}
fallback = responses_map.get("fallback", ["I'm not sure about that. Try asking about rooms, bookings, or payments."])

CONFIDENCE_THRESHOLD = 0.25


def get_response(message: str) -> str:
    msg = message.strip().lower()
    if not msg:
        return random.choice(fallback)

    proba = model.predict_proba([msg])[0]
    max_prob = np.max(proba)
    tag = model.classes_[np.argmax(proba)]

    if max_prob < CONFIDENCE_THRESHOLD:
        return random.choice(fallback)

    return random.choice(responses_map.get(tag, fallback))


@app.route("/chat", methods=["POST"])
def chat():
    body = request.get_json(silent=True) or {}
    message = body.get("message", "")
    reply = get_response(message)
    return jsonify({"reply": reply})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(port=5050, debug=False)
