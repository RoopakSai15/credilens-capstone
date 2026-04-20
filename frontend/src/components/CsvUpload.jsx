import { useState, useRef } from "react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function CsvUpload({ onResults }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [summary, setSummary] = useState(null);
  const inputRef              = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSummary(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res  = await fetch(`${BASE}/upload/csv`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");

      setSummary({ total: data.total, success: data.success, failed: data.failed });
      onResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="card" style={{ borderLeft: "4px solid #8b5cf6" }}>
      <div className="card-header" style={{ marginBottom: "1rem" }}>
        <h2 className="card-title">Batch CSV Upload</h2>
        <p className="card-subtitle">
          Upload your dataset — column name differences and the target column are handled automatically
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <label className="btn btn-primary" style={{ cursor: "pointer" }}>
          {loading
            ? <span className="btn-loading"><span className="spinner" /> Processing…</span>
            : "Choose CSV file"}
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleUpload}
            disabled={loading}
          />
        </label>

        {summary && (
          <span style={{ fontSize: "0.85rem", color: "#475569" }}>
            ✓ {summary.success}/{summary.total} rows predicted
            {summary.failed > 0 && ` · ${summary.failed} failed`}
          </span>
        )}
      </div>

      {error && (
        <div className="error-banner" style={{ marginTop: "1rem" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
