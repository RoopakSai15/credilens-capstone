from fastapi import APIRouter, HTTPException
from core.config import BATCH_LIMIT
from core.model_store import get_features
from schemas.input import ApplicantInput
from schemas.output import PredictionResponse
from services.predictor import predict
from services.explainer import get_shap_values, risk_level, build_reason

router = APIRouter()


def _run_one(data: ApplicantInput) -> PredictionResponse:

    data_dict = data.model_dump(by_alias=True)
    feature_names = get_features()
    feature_values = [data_dict[f] for f in feature_names]

    prob, prediction = predict(feature_values, data.model)
    shap_values = get_shap_values(feature_values, data.model)
    level = risk_level(prob)
    reason = build_reason(shap_values, feature_names, prob)

    return PredictionResponse(
        default_probability=round(prob, 4),
        prediction=prediction,
        risk_level=level,
        confidence=round(max(prob, 1 - prob), 4),
        shap_values=shap_values,
        feature_names=feature_names,
        feature_values=feature_values,
        reason_statement=reason,
        model_used=data.model,
    )


@router.post("", response_model=PredictionResponse)
def single_predict(data: ApplicantInput):
    """Predict default risk for one applicant."""
    return _run_one(data)


@router.post("/batch", response_model=list[PredictionResponse])
def batch_predict(applicants: list[ApplicantInput]):
    """Predict default risk for up to 100 applicants at once."""
    if len(applicants) > BATCH_LIMIT:
        raise HTTPException(
            status_code=400,
            detail=f"Batch size exceeds limit of {BATCH_LIMIT}",
        )
    return [_run_one(a) for a in applicants]
