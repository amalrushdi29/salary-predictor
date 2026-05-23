import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

# ── 1. Load Data ──────────────────────────────────────────────
X_train = pd.read_csv("data/X_train.csv")
X_test  = pd.read_csv("data/X_test.csv")
y_train = pd.read_csv("data/y_train.csv").squeeze()
y_test  = pd.read_csv("data/y_test.csv").squeeze()

print("✅ Data loaded")
print(f"   Training samples : {len(X_train)}")
print(f"   Testing  samples : {len(X_test)}")

# ── 2. Define Categorical Columns ─────────────────────────────
categorical_cols = [
    "job_title",
    "work_models",
    "company_location",
    "company_size"
]

# ── 3. Build Preprocessor ─────────────────────────────────────
# handle_unknown="ignore" → if a new value appears during prediction,
# it won't crash — it'll just be treated as all zeros
preprocessor = ColumnTransformer(transformers=[
    ("onehot", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
], remainder="passthrough")

# ── 4. Build Pipeline (Preprocessor + Model) ──────────────────
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", RandomForestRegressor(n_estimators=100, random_state=42))
])

# ── 5. Train ──────────────────────────────────────────────────
print("\n⏳ Training model...")
pipeline.fit(X_train, y_train)
print("✅ Training complete")

# ── 6. Evaluate ───────────────────────────────────────────────
y_pred = pipeline.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
r2  = r2_score(y_test, y_pred)

print(f"\n📊 Model Evaluation")
print(f"   MAE : ${mae:,.0f}")
print(f"   R²  : {r2:.4f}")

# ── 7. Save Model ─────────────────────────────────────────────
os.makedirs("model", exist_ok=True)
joblib.dump(pipeline, "model/salary_model.pkl")
print("\n✅ Model saved → model/salary_model.pkl")