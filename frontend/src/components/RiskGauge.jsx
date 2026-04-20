const RISK_CONFIG = {
  Low:    { color: "#22c55e", bg: "#dcfce7", border: "#86efac", icon: "✓" },
  Medium: { color: "#f59e0b", bg: "#fef3c7", border: "#fcd34d", icon: "⚠" },
  High:   { color: "#ef4444", bg: "#fee2e2", border: "#fca5a5", icon: "✕" },
};

export default function RiskGauge({ result }) {
  const { default_probability, risk_level, prediction, confidence, reason_statement, model_used } = result;
  const cfg = RISK_CONFIG[risk_level];
  const pct = Math.round(default_probability * 100);

  // Arc math — clean semicircle gauge
const R = 70;
const cx = 110, cy = 90;

// Track: always full semicircle, left to right across the top
// Start = left point (30, 110), End = right point (190, 110)

// Value arc sweeps from left, proportional to default_probability
// Angle goes from 180° (left) to 0° (right) across the top
const startRad = Math.PI;                                    // left point
const endRad   = Math.PI - (default_probability * Math.PI); // sweeps right
const x1 = cx + R * Math.cos(startRad);  // always left point
const y1 = cy + R * Math.sin(startRad);
const x2 = cx + R * Math.cos(endRad);
const y2 = cy + R * Math.sin(endRad);
const largeArc = default_probability > 0.5 ? 1 : 0;
const arcPath = `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`;

  return (
    <div className="card result-card" style={{ borderLeft: `4px solid ${cfg.color}` }}>
      <div className="result-top">
        {/* Gauge */}
        <div className="gauge-wrap">
  <div style={{ width: "220px" }}>
    <div style={{
      fontSize: "36px", fontWeight: "700", color: cfg.color, marginBottom: "6px"
    }}>
      {pct}%
    </div>
    <div style={{
      background: "#e5e7eb", borderRadius: "999px", height: "12px", overflow: "hidden"
    }}>
      <div style={{
        width: `${pct}%`,
        height: "100%",
        background: cfg.color,
        borderRadius: "999px",
        transition: "width 0.6s ease"
      }} />
    </div>
    <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
      Default Probability
    </div>
  </div>
</div>

        {/* Risk badge */}
        <div className="risk-badge-wrap">
          <div
            className="risk-badge"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
          >
            <span className="risk-icon">{cfg.icon}</span>
            <span className="risk-label">{risk_level} Risk</span>
          </div>
          <div className="result-meta">
            <span className="meta-item">
              <strong>Decision:</strong> {prediction === 1 ? "⚠ Likely Default" : "✓ Likely Repay"}
            </span>
            <span className="meta-item">
              <strong>Confidence:</strong> {Math.round(confidence * 100)}%
            </span>
            <span className="meta-item">
              <strong>Model:</strong> {model_used.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Reason statement */}
      <div className="reason-box">
        <p className="reason-title">AI Explanation</p>
        <p className="reason-text">{reason_statement}</p>
      </div>
    </div>
  );
}
