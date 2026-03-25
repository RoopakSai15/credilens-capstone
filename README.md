# Credit Default XAI Dashboard

Capstone project — Explainable AI loan-officer interface.

## Prerequisites
- Python 3.10+
- Node.js 18+
- Your trained models in `backend/models/` (see notebook)

---

## 1 — Save the scaler (one-time, in your notebook)

After your `StandardScaler` fit, add:
```python
import joblib
joblib.dump(scaler, "models/scaler.pkl")
```
Copy all `models/*.pkl` files into `backend/models/`.

---

## 2 — Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at **http://localhost:8000**  
Interactive docs at **http://localhost:8000/docs**

---

## 3 — Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/features` | Feature names & labels |
| GET | `/models` | Available models |
| POST | `/predict` | Single prediction + SHAP |
| POST | `/batch_predict` | Up to 100 applicants |

### Example request body (`POST /predict`)
```json
{
  "RevolvingUtilizationOfUnsecuredLines": 0.35,
  "age": 45,
  "MonthlyIncome": 5000,
  "DebtRatio": 0.25,
  "NumberOfDependents": 2,
  "NumberOfOpenCreditLinesAndLoans": 8,
  "NumberRealEstateLoansOrLines": 1,
  "NumberOfTime30_59DaysPastDueNotWorse": 0,
  "NumberOfTime60_89DaysPastDueNotWorse": 0,
  "NumberOfTimes90DaysLate": 0,
  "model": "xgboost"
}
```

---

## Architecture

```
Credit Dataset
      │
      ▼
Data Preprocessing  ←── notebook (EDA + SMOTE + scaling)
      │
      ▼
Model Training      ←── LogReg / RF / XGBoost / LightGBM
      │
      ▼
FastAPI Backend     ←── /predict → SHAP explainer
      │
      ▼
React Frontend      ←── Risk Gauge + SHAP waterfall chart
```
