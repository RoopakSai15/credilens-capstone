const RISK_CONFIG = {
  Low:    { color: "#22c55e", bg: "#dcfce7", border: "#86efac", icon: "✓" },
  Medium: { color: "#f59e0b", bg: "#fef3c7", border: "#fcd34d", icon: "⚠" },
  High:   { color: "#ef4444", bg: "#fee2e2", border: "#fca5a5", icon: "✕" },
};

export default function RiskGauge({ result }) {
  const { default_probability, risk_level, prediction, confidence, reason_statement, model_used } = result;
  const cfg = RISK_CONFIG[risk_level];
  const pct = Math.round(default_probability * 100);

  // Arc math
  const R = 80;
  const cx = 110, cy = 110;
  const startAngle = Math.PI;
  const endAngle   = startAngle + (default_probability * Math.PI);
  const x1 = cx + R * Math.cos(startAngle);
  const y1 = cy + R * Math.sin(startAngle);
  const x2 = cx + R * Math.cos(endAngle);
  const y2 = cy + R * Math.sin(endAngle);
  const largeArc = default_probability > 0.5 ? 1 : 0;
  const arcPath = `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`;

  return (
    <div className="card result-card" style={{ borderLeft: `4px solid ${cfg.color}` }}>
      <div className="result-top">
        {/* Gauge */}
        <div className="gauge-wrap">
          <svg viewBox="0 0 220 130" width="220" height="130">
            {/* Track */}
            <path
              d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
              fill="none" stroke="#e5e7eb" strokeWidth="14" strokeLinecap="round"
            />
            {/* Value arc */}
            <path
              d={arcPath}
              fill="none" stroke={cfg.color} strokeWidth="14" strokeLinecap="round"
            />
            {/* Percentage */}
            <text x={cx} y={cy - 8} textAnchor="middle" fontSize="28" fontWeight="700" fill={cfg.color}>
              {pct}%
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#6b7280">
              Default Probability
            </text>
          </svg>
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
