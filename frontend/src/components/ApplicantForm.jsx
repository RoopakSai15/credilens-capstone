import { useState } from "react";

const FIELDS = [
  { key: "RevolvingUtilizationOfUnsecuredLines", label: "Credit Utilization", type: "number", step: "0.01", min: 0, placeholder: "e.g. 0.35", hint: "Total balance / credit limit" },
  { key: "age", label: "Age", type: "number", step: "1", min: 18, max: 110, placeholder: "e.g. 45" },
  { key: "MonthlyIncome", label: "Monthly Income ($)", type: "number", step: "1", min: 0, placeholder: "e.g. 5000" },
  { key: "DebtRatio", label: "Debt Ratio", type: "number", step: "0.01", min: 0, placeholder: "e.g. 0.25" },
  { key: "NumberOfDependents", label: "Number of Dependents", type: "number", step: "1", min: 0, placeholder: "e.g. 2" },
  { key: "NumberOfOpenCreditLinesAndLoans", label: "Open Credit Lines & Loans", type: "number", step: "1", min: 0, placeholder: "e.g. 8" },
  { key: "NumberRealEstateLoansOrLines", label: "Real Estate Loans/Lines", type: "number", step: "1", min: 0, placeholder: "e.g. 1" },
  { key: "NumberOfTime30_59DaysPastDueNotWorse", label: "30–59 Day Late Payments", type: "number", step: "1", min: 0, placeholder: "e.g. 0" },
  { key: "NumberOfTime60_89DaysPastDueNotWorse", label: "60–89 Day Late Payments", type: "number", step: "1", min: 0, placeholder: "e.g. 0" },
  { key: "NumberOfTimes90DaysLate", label: "90+ Day Late Payments", type: "number", step: "1", min: 0, placeholder: "e.g. 0" },
];

const MODELS = [
  { value: "xgboost", label: "XGBoost (Recommended)" },
  { value: "lightgbm", label: "LightGBM" },
  { value: "random_forest", label: "Random Forest" },
  { value: "logistic_regression", label: "Logistic Regression" },
];

const DEFAULTS = {
  RevolvingUtilizationOfUnsecuredLines: "",
  age: "",
  MonthlyIncome: "",
  DebtRatio: "",
  NumberOfDependents: "",
  NumberOfOpenCreditLinesAndLoans: "",
  NumberRealEstateLoansOrLines: "",
  NumberOfTime30_59DaysPastDueNotWorse: "",
  NumberOfTime60_89DaysPastDueNotWorse: "",
  NumberOfTimes90DaysLate: "",
  model: "xgboost",
};

export default function ApplicantForm({ onSubmit, loading }) {
  const [form, setForm] = useState(DEFAULTS);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    FIELDS.forEach(({ key }) => {
      payload[key] = parseFloat(payload[key]);
    });
    onSubmit(payload);
  };

  const handleReset = () => setForm(DEFAULTS);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Applicant Details</h2>
        <p className="card-subtitle">Enter financial profile to assess credit default risk</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {FIELDS.map(({ key, label, type, step, min, max, placeholder, hint }) => (
            <div className="form-group" key={key}>
              <label className="form-label">
                {label}
                {hint && <span className="form-hint"> — {hint}</span>}
              </label>
              <input
                className="form-input"
                type={type}
                step={step}
                min={min}
                max={max}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">ML Model</label>
            <select
              className="form-input"
              value={form.model}
              onChange={(e) => handleChange("model", e.target.value)}
            >
              {MODELS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" /> Analyzing…
              </span>
            ) : "Assess Risk"}
          </button>
        </div>
      </form>
    </div>
  );
}
