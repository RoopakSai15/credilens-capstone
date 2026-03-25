import numpy as np
from core.model_store import get_model, get_scaler
from core.config import DEFAULT_THRESHOLD


def predict(feature_values: list[float], model_name: str) -> tuple[float, int]:
    """
    Run a single prediction.

    Returns:
        (probability_of_default, binary_prediction)
    """
    clf = get_model(model_name)
    X = np.array(feature_values).reshape(1, -1)

    # Logistic regression was trained on scaled data
    if model_name == "logistic_regression":
        scaler = get_scaler()
        X = scaler.transform(X)

    prob = float(clf.predict_proba(X)[0][1])
    prediction = int(prob >= DEFAULT_THRESHOLD)
    return prob, prediction
