from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

# ── Model filenames ──────────────────────────────────────────────────────────
MODEL_FILES = {
    "xgboost":             MODELS_DIR / "xgboost.pkl",
    "lightgbm":            MODELS_DIR / "lightgbm.pkl",
    "random_forest":       MODELS_DIR / "random_forest.pkl",
    "logistic_regression": MODELS_DIR / "logistic_regression.pkl",
}
SCALER_FILE   = MODELS_DIR / "scaler.pkl"
FEATURES_FILE = MODELS_DIR / "features.pkl"

# ── Prediction settings ──────────────────────────────────────────────────────
DEFAULT_MODEL    = "xgboost"
DEFAULT_THRESHOLD = 0.35          # tuned threshold from notebook
BATCH_LIMIT      = 100

# ── Risk thresholds ──────────────────────────────────────────────────────────
RISK_THRESHOLDS = {
    "Low":    (0.00, 0.30),
    "Medium": (0.30, 0.60),
    "High":   (0.60, 1.00),
}

# ── Human-readable feature labels ───────────────────────────────────────────
FEATURE_LABELS: dict[str, str] = {
    "RevolvingUtilizationOfUnsecuredLines":    "Credit Utilization",
    "age":                                     "Age",
    "NumberOfTime30_59DaysPastDueNotWorse":    "30–59 Day Late Payments",
    "DebtRatio":                               "Debt Ratio",
    "MonthlyIncome":                           "Monthly Income",
    "NumberOfOpenCreditLinesAndLoans":         "Open Credit Lines",
    "NumberOfTimes90DaysLate":                 "90+ Day Late Payments",
    "NumberRealEstateLoansOrLines":            "Real Estate Loans",
    "NumberOfTime60_89DaysPastDueNotWorse":    "60–89 Day Late Payments",
    "NumberOfDependents":                      "Number of Dependents",
}
