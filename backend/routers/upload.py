import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException
from core.config import BATCH_LIMIT
from core.model_store import get_features
from schemas.input import ApplicantInput
from routers.predict import _run_one

router = APIRouter()

# CSV columns that must be renamed to match the backend schema
COLUMN_REMAP = {
    "NumberOfTime30-59DaysPastDueNotWorse": "NumberOfTime30_59DaysPastDueNotWorse",
    "NumberOfTime60-89DaysPastDueNotWorse": "NumberOfTime60_89DaysPastDueNotWorse",
}

# Columns to drop before prediction (target variable, not a feature)
DROP_COLUMNS = {"SeriousDlqin2yrs"}


@router.post("/csv")
async def predict_csv(
    file: UploadFile = File(...),
    model: str = "xgboost",
):
    """
    Accept a CSV file, fix column names, drop target column,
    and return predictions for every row.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are accepted.")

    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {e}")

    # Drop target column if present
    df = df.drop(columns=[c for c in DROP_COLUMNS if c in df.columns])

    # Fix hyphen → underscore in column names
    df = df.rename(columns=COLUMN_REMAP)

    # Validate all required features are present
    required = set(get_features())
    missing = required - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"CSV is missing columns: {sorted(missing)}",
        )

    if len(df) > BATCH_LIMIT:
        raise HTTPException(
            status_code=400,
            detail=f"CSV has {len(df)} rows — limit is {BATCH_LIMIT}.",
        )

    results = []
    errors = []

    for i, row in df.iterrows():
        try:
            applicant = ApplicantInput(
                **{col: row[col] for col in get_features()},
                model=model,
            )
            results.append(
                {
                    "row": i + 1,
                    "result": _run_one(applicant),
                }
            )
        except Exception as e:
            errors.append({"row": i + 1, "error": str(e)})

    return {
        "total": len(df),
        "success": len(results),
        "failed": len(errors),
        "results": [r["result"] for r in results],
        "errors": errors,
    }
