from fastapi import APIRouter
from core.model_store import get_features, list_models
from core.config import FEATURE_LABELS

router = APIRouter()


@router.get("/models")
def available_models():
    """List all loaded models."""
    return {"available_models": list_models()}


@router.get("/features")
def feature_info():
    """Return feature names and their human-readable labels."""
    return {
        "features": get_features(),
        "labels":   FEATURE_LABELS,
    }
