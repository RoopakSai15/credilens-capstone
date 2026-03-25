const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function predictDefault(payload) {
  const res = await fetch(`${BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Prediction failed");
  }
  return res.json();
}

export async function getFeatures() {
  const res = await fetch(`${BASE}/features`);
  return res.json();
}

export async function getModels() {
  const res = await fetch(`${BASE}/models`);
  return res.json();
}
