import { useState } from "react";
import ApplicantForm from "../components/ApplicantForm";
import RiskGauge from "../components/RiskGauge";
import ShapChart from "../components/ShapChart";
import CsvUpload from "../components/CsvUpload";
import { predictDefault } from "../services/api";

export default function Dashboard() {
  const [results, setResults] = useState([]);   // always an array
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Single prediction → wrap in array so rendering is identical
  const handleSingle = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictDefault(payload);
      setResults([data]);
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CSV upload → already an array from the endpoint
  const handleCsvResults = (rows) => {
    setResults(rows);
    setError(null);
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
          <div>
            <span className="badge">SHAP Explainability</span>
            <span className="badge">4 ML Models</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <ApplicantForm onSubmit={handleSingle} loading={loading} />
        <CsvUpload onResults={handleCsvResults} />

        {error && <div className="error-banner"><strong>Error:</strong> {error}</div>}

        {results.length > 0 && (
          <div id="results-section" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {results.length > 1 && (
              <div className="card" style={{ padding: "1rem 1.75rem" }}>
                <p style={{ fontSize: "0.9rem", color: "#475569" }}>
                  Showing <strong>{results.length}</strong> predictions —
                  scroll down to see all SHAP explanations
                </p>
              </div>
            )}

            {results.map((result, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {results.length > 1 && (
                  <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748b", paddingLeft: "0.25rem" }}>
                    Row {i + 1}
                  </p>
                )}
                <RiskGauge result={result} />
                <ShapChart
                  shap_values={result.shap_values}
                  feature_names={result.feature_names}
                  feature_values={result.feature_values}
                />
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p className="empty-title">No assessment yet</p>
            <p className="empty-sub">Fill in applicant details above or upload a CSV file</p>
          </div>
        )}
      </main>
    </div>
  );
}
