from pydantic import BaseModel


class PredictionResponse(BaseModel):
    default_probability: float
    prediction:          int           # 0 = repay, 1 = default
    risk_level:          str           # Low / Medium / High
    confidence:          float
    shap_values:         list[float]
    feature_names:       list[str]
    feature_values:      list[float]
    reason_statement:    str
    model_used:          str
