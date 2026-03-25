import numpy as np
import shap
from core.model_store import get_model, get_scaler
from core.config import FEATURE_LABELS, RISK_THRESHOLDS


def get_shap_values(feature_values: list[float], model_name: str) -> list[float]:
    """Compute per-feature SHAP values for a single prediction."""
    clf = get_model(model_name)
    X = np.array(feature_values).reshape(1, -1)

    if model_name == "logistic_regression":
        X = get_scaler().transform(X)
        explainer = shap.LinearExplainer(clf, shap.maskers.Independent(X))
        sv = explainer(X).values[0]
    else:
        explainer = shap.TreeExplainer(clf)
        sv = explainer.shap_values(X)
        if isinstance(sv, list):   # RandomForest returns list[class_0, class_1]
            sv = sv[1]
        sv = sv[0]

    return sv.tolist()


def risk_level(prob: float) -> str:
    for level, (lo, hi) in RISK_THRESHOLDS.items():
        if lo <= prob < hi:
            return level
    return "High"


def build_reason(
    shap_values: list[float],
    feature_names: list[str],
    prob: float,
) -> str:
    """Turn SHAP values into a plain-English sentence for the loan officer."""
    pairs = sorted(zip(shap_values, feature_names), reverse=True)

    top_pos = [
        (FEATURE_LABELS.get(f, f), v)
        for v, f in pairs if v > 0
    ][:3]
    top_neg = [
        (FEATURE_LABELS.get(f, f), v)
        for v, f in reversed(pairs) if v < 0
    ][:2]

    lines = [f"Default probability: {prob * 100:.1f}%."]

    if top_pos:
        drivers = ", ".join(f"{lbl} (+{v:.3f})" for lbl, v in top_pos)
        lines.append(f"Main risk drivers: {drivers}.")

    if top_neg:
        mitigators = ", ".join(f"{lbl} ({v:.3f})" for lbl, v in top_neg)
        lines.append(f"Mitigating factors: {mitigators}.")

    return " ".join(lines)
