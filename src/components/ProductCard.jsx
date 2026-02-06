import React from "react";
import { Link } from "react-router-dom";
import Badge from "./Badge.jsx";
import { usd } from "../utils/money.js";

export default function ProductCard({ p }) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <img
          src={p.image}
          alt={p.name}
          style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }}
          loading="lazy"
        />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <Badge>{p.badge}</Badge>
        </div>
      </div>

      <div className="card-pad">
        <div style={{ color: "rgba(255,255,255,.72)", fontSize: 12 }}>Scooter</div>
        <div style={{ fontWeight: 900, marginTop: 4 }}>{p.name}</div>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{usd(p.price)}</div>
          <div className="small" style={{ opacity: .9 }}>
            As low as <span style={{ color: "var(--neon)" }}>${(p.price / 12).toFixed(2)}/mo</span> with Affirm
          </div>
        </div>

        <div className="small" style={{ marginTop: 10 }}>
          {p.short}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <Link className="btn btn-primary" to={`/product/${p.slug}`}>
            View
          </Link>
          <Link className="btn" to={`/product/${p.slug}`}>
            Finance with Affirm
          </Link>
        </div>
      </div>
    </div>
  );
}
