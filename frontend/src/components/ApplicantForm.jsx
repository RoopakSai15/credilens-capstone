import { useState } from "react";

const FIELDS = [
  { key: "RevolvingUtilizationOfUnsecuredLines", label: "Credit Utilization",       hint: "balance / credit limit", step: "0.01", min: 0 },
  { key: "age",                                  label: "Age",                                                       step: "1",    min: 18, max: 110 },
  { key: "MonthlyIncome",                        label: "Monthly Income ($)",                                        step: "1",    min: 0 },
  { key: "DebtRatio",                            label: "Debt Ratio",                                                step: "0.01", min: 0 },
  { key: "NumberOfDependents",                   label: "Number of Dependents",                                      step: "1",    min: 0 },
  { key: "NumberOfOpenCreditLinesAndLoans",      label: "Open Credit Lines & Loans",                                step: "1",    min: 0 },
  { key: "NumberRealEstateLoansOrLines",         label: "Real Estate Loans / Lines",                                step: "1",    min: 0 },
  { key: "NumberOfTime30_59DaysPastDueNotWorse", label: "30–59 Day Late Payments",                                  step: "1",    min: 0 },
  { key: "NumberOfTime60_89DaysPastDueNotWorse", label: "60–89 Day Late Payments",                                  step: "1",    min: 0 },
  { key: "NumberOfTimes90DaysLate",              label: "90+ Day Late Payments",                                    step: "1",    min: 0 },
];

const EMPTY = Object.fromEntries(FIELDS.map(f => [f.key, ""]));

export default function ApplicantForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ ...EMPTY });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    FIELDS.forEach(({ key }) => { payload[key] = parseFloat(payload[key]); });
    onSubmit(payload);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Applicant Details</h2>
        <p className="card-subtitle">Enter the financial profile to assess credit default risk · Model: XGBoost</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {FIELDS.map(({ key, label, hint, step, min, max }) => (
            <div className="form-group" key={key}>
              <label className="form-label">
                {label}
                {hint && <span className="form-hint"> — {hint}</span>}
              </label>
              <input
                className="form-input"
                type="number"
                step={step}
                min={min}
                max={max}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setForm({ ...EMPTY })}>Reset</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="btn-loading"><span className="spinner" /> Analyzing…</span> : "Assess Risk"}
          </button>
        </div>
      </form>
    </div>
  );
}
