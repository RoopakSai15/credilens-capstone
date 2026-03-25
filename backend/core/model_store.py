import joblib
from core.config import MODEL_FILES, SCALER_FILE, FEATURES_FILE

# ── In-memory store (populated at startup) ───────────────────────────────────
_models:   dict = {}
_scaler         = None
_features: list[str] = []


def load_all() -> None:
    """Called once at app startup. Loads every model + scaler into memory."""
    global _models, _scaler, _features

    for name, path in MODEL_FILES.items():
        if not path.exists():
            raise FileNotFoundError(f"Model file not found: {path}")
        _models[name] = joblib.load(path)

    if not SCALER_FILE.exists():
        raise FileNotFoundError(f"Scaler not found: {SCALER_FILE}")
    _scaler = joblib.load(SCALER_FILE)

    if not FEATURES_FILE.exists():
        raise FileNotFoundError(f"Features file not found: {FEATURES_FILE}")
    _features = joblib.load(FEATURES_FILE)

    print(f"[model_store] Loaded models: {list(_models.keys())}")
    print(f"[model_store] Features ({len(_features)}): {_features}")


def get_model(name: str):
    if name not in _models:
        raise KeyError(f"Unknown model: '{name}'. Available: {list(_models.keys())}")
    return _models[name]


def get_scaler():
    return _scaler


def get_features() -> list[str]:
    return _features


def list_models() -> list[str]:
    return list(_models.keys())
