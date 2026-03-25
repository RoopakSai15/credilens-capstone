import { useState } from "react";
import ApplicantForm from "../components/ApplicantForm";
import RiskGauge from "../components/RiskGauge";
import ShapChart from "../components/ShapChart";
import { predictDefault } from "../services/api";

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictDefault(payload);
      setResult(data);
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="logo">XAI</div>
            <div>
              <h1 className="header-title">Credit Default Risk Analyzer</h1>
              <p className="header-sub">Explainable AI · Loan Officer Dashboard</p>
            </div>
          </div>
          <div className="header-badges">
            <span className="badge badge-blue">SHAP Explainability</span>
            <span className="badge badge-gray">4 ML Models</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <ApplicantForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div id="results-section" className="results-grid">
            <RiskGauge result={result} />
            <ShapChart
              shap_values={result.shap_values}
              feature_names={result.feature_names}
              feature_values={result.feature_values}
            />
          </div>
        )}

        {!result && !error && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p className="empty-title">No Assessment Yet</p>
            <p className="empty-sub">Fill in the applicant details above and click <strong>Assess Risk</strong></p>
          </div>
        )}
      </main>
    </div>
  );
}
