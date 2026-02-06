// src/components/ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usd } from "../utils/money.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ p }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);

  function add() {
    cart.addItem(p, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }

  return (
    <div className="card product-card" style={{ overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <img
          src={p.image}
          alt={p.name}
          style={{ width: "100%", height: 220, objectFit: "contain", display: "block", background: "rgba(255,255,255,.02)" }}
        />

        {p.badge ? (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span className="badge">{p.badge}</span>
          </div>
        ) : null}
      </div>

      <div className="card-pad">
        <div className="small" style={{ opacity: 0.85 }}>{p.category || "Scooter"}</div>

        <div style={{ fontWeight: 900, marginTop: 6, lineHeight: 1.15 }}>
          {p.name}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 8
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900 }}>{usd(p.price)}</div>

          <div className="small">
            As low as{" "}
            <span style={{ color: "var(--neon)" }}>${(p.price / 12).toFixed(2)}/mo</span>{" "}
            with Affirm
          </div>
        </div>

        <p className="small" style={{ marginTop: 10, opacity: 0.9 }}>
          {p.short}
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" to={`/product/${p.slug}`}>
            View
          </Link>

          <button className="btn" onClick={add} type="button">
            {added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
