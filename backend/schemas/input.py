from pydantic import BaseModel, Field
from typing import Literal
from core.config import DEFAULT_MODEL


class ApplicantInput(BaseModel):
    model_config = {"populate_by_name": True}

    RevolvingUtilizationOfUnsecuredLines: float = Field(
        ..., ge=0, description="Total balance / credit limit"
    )
    age: int = Field(..., ge=18, le=110)
    NumberOfTime30_59DaysPastDueNotWorse: int = Field(
        ..., ge=0, alias="NumberOfTime30-59DaysPastDueNotWorse"
    )
    DebtRatio: float = Field(..., ge=0)
    MonthlyIncome: float = Field(..., ge=0)
    NumberOfOpenCreditLinesAndLoans: int = Field(..., ge=0)
    NumberOfTimes90DaysLate: int = Field(..., ge=0)
    NumberRealEstateLoansOrLines: int = Field(..., ge=0)
    NumberOfTime60_89DaysPastDueNotWorse: int = Field(
        ..., ge=0, alias="NumberOfTime60-89DaysPastDueNotWorse"
    )
    NumberOfDependents: int = Field(..., ge=0)
    model: Literal[
        "xgboost",
        "lightgbm",
        "random_forest",
        "logistic_regression",
    ] = DEFAULT_MODEL
