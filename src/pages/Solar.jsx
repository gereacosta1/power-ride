// src/pages/Solar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Solar() {
  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div className="card card-pad">
        <div className="h-eyebrow">Solar energy</div>
        <h2 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>Coming soon</h2>

        <p className="small" style={{ marginTop: 10, maxWidth: 820, opacity: 0.9 }}>
          This section is ready. When your client sends products, we’ll add solar panels, inverters,
          batteries, kits, and accessories with the same checkout flow.
        </p>

        <div className="hr" />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" to="/catalog#solar">Go to Solar section</Link>
          <Link className="btn" to="/catalog">Back to catalog</Link>
        </div>
      </div>
    </div>
  );
}
