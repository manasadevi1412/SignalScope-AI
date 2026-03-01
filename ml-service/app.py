from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    location = data.get("location")
    network = data.get("network")

    # 🔥 Simulate signal strength
    strength = random.randint(-110, -60)

    if strength > -75:
        signal = "Excellent"
    elif strength > -90:
        signal = "Good"
    else:
        signal = "Poor"

    return jsonify({
        "location": location,
        "network": network,
        "signal": signal,
        "strength": strength
    })

if __name__ == "__main__":
    app.run(port=7000, debug=True)