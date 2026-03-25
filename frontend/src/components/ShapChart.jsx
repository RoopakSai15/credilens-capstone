const FEATURE_LABELS = {
  RevolvingUtilizationOfUnsecuredLines: "Credit Utilization",
  age: "Age",
  NumberOfTime30_59DaysPastDueNotWorse: "30–59 Day Late",
  DebtRatio: "Debt Ratio",
  MonthlyIncome: "Monthly Income",
  NumberOfOpenCreditLinesAndLoans: "Open Credit Lines",
  NumberOfTimes90DaysLate: "90+ Day Late",
  NumberRealEstateLoansOrLines: "Real Estate Loans",
  NumberOfTime60_89DaysPastDueNotWorse: "60–89 Day Late",
  NumberOfDependents: "Dependents",
};

export default function ShapChart({ shap_values, feature_names, feature_values }) {
  const data = feature_names
    .map((f, i) => ({
      label: FEATURE_LABELS[f] || f,
      value: shap_values[i],
      raw: feature_values[i],
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)), 0.001);

  return (
    <div className="card shap-card">
      <div className="card-header">
        <h2 className="card-title">Feature Contributions (SHAP)</h2>
        <p className="card-subtitle">
          Positive values push toward default &nbsp;·&nbsp; Negative values reduce risk
        </p>
      </div>

      <div className="shap-list">
        {data.map(({ label, value, raw }) => {
          const isPos = value >= 0;
          const barW  = Math.abs(value) / maxAbs * 100;
          const color = isPos ? "#ef4444" : "#22c55e";
          const bgCol = isPos ? "#fee2e2" : "#dcfce7";

          return (
            <div className="shap-row" key={label}>
              <div className="shap-label">
                <span className="shap-feat">{label}</span>
                <span className="shap-raw">= {typeof raw === "number" ? raw.toLocaleString() : raw}</span>
              </div>

              <div className="shap-bar-wrap">
                {/* Centre line */}
                <div className="shap-center" />

                {isPos ? (
                  <div
                    className="shap-bar shap-bar-right"
                    style={{ width: `${barW / 2}%`, background: color, opacity: 0.85 }}
                  />
                ) : (
                  <div
                    className="shap-bar shap-bar-left"
                    style={{ width: `${barW / 2}%`, background: color, opacity: 0.85 }}
                  />
                )}
              </div>

              <div
                className="shap-value"
                style={{ color, background: bgCol }}
              >
                {isPos ? "+" : ""}{value.toFixed(4)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="shap-legend">
        <span className="legend-item"><span className="dot dot-red" /> Increases default risk</span>
        <span className="legend-item"><span className="dot dot-green" /> Decreases default risk</span>
      </div>
    </div>
  );
}
