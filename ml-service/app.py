from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# ── Load the trained model ────────────────────────────────────
model = joblib.load("model/salary_model.pkl")
print("✅ Model loaded")

# ── Health check endpoint ─────────────────────────────────────
@app.route("/", methods=["GET"])
def home():
    return jsonify({ "status": "ML service is running" })

# ── Prediction endpoint ───────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        experience_map = { "EN": 1, "MI": 2, "SE": 3, "EX": 4 }
        
        job_title         = data["job_title"]
        experience_level  = experience_map[data["experience_level"]]
        work_models       = data["work_models"]
        company_location  = data["company_location"]
        company_size      = data["company_size"]

        # Build a DataFrame — same structure as X_train
        import pandas as pd
        input_df = pd.DataFrame([{
            "job_title":        job_title,
            "experience_level": experience_level,
            "work_models":      work_models,
            "company_location": company_location,
            "company_size":     company_size
        }])

        # Predict
        prediction = model.predict(input_df)[0]

        return jsonify({
            "success":          True,
            "predicted_salary": round(float(prediction), 2)
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error":   str(e)
        }), 400

# ── Run the server ────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5003))
    app.run(debug=True, port=port)