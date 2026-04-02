// src/components/ProductCard.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usd } from "../utils/money.js";
import { useCart } from "../context/CartContext.jsx";

function formatCategory(cat) {
  const c = String(cat || "").toLowerCase().trim();

  const map = {
    solar: "Solar energy",
    audio: "Audio",
    scooter: "Electric scooters",
    bicycle: "E-bikes",
    motorcycle: "Motorcycles",
  };

  if (map[c]) return map[c];
  if (!c) return "Item";
  return c.charAt(0).toUpperCase() + c.slice(1);
}

function monthlyExample(price) {
  const n = Number(price || 0);
  if (!Number.isFinite(n) || n <= 0) return "";
  return (n / 12).toFixed(2);
}

export default function ProductCard({ p }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const [imgOk, setImgOk] = useState(true);

  const categoryLabel = useMemo(
    () => formatCategory(p?.category),
    [p?.category]
  );

  const mo = useMemo(() => monthlyExample(p?.price), [p?.price]);

  const isKit = useMemo(
    () => String(p?.type || "").toLowerCase() === "kit",
    [p?.type]
  );

  const includesPreview = useMemo(() => {
    if (!Array.isArray(p?.includes)) return [];
    return p.includes.filter(Boolean).slice(0, 3);
  }, [p?.includes]);

  function add() {
    cart.addItem(p, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }

  return (
    <div className="card product-card" style={{ overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        {imgOk && p?.image ? (
          <img
            src={p.image}
            alt={p?.name || "Product"}
            onError={() => setImgOk(false)}
            style={{
              width: "100%",
              height: 220,
              objectFit: "contain",
              display: "block",
              background: "rgba(255,255,255,.02)",
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 220,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,.03)",
              color: "rgba(255,255,255,.75)",
              fontWeight: 800,
            }}
          >
            Image missing
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {p?.badge ? <span className="badge">{p.badge}</span> : null}
          {isKit ? <span className="badge">Kit</span> : null}
        </div>
      </div>

      <div className="card-pad">
        <div className="small" style={{ opacity: 0.85 }}>
          {categoryLabel}
        </div>

        <div style={{ fontWeight: 900, marginTop: 6, lineHeight: 1.15 }}>
          {p?.name}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 8,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900 }}>{usd(p?.price)}</div>

          {mo ? (
            <div className="small">
              As low as{" "}
              <span style={{ color: "var(--neon)" }}>${mo}/mo</span> with Affirm{" "}
              <a href="#affirm-disclosure" style={{ opacity: 0.95 }}>
                *
              </a>
            </div>
          ) : null}
        </div>

        <p className="small" style={{ marginTop: 10, opacity: 0.9 }}>
          {p?.short}
        </p>

        {isKit && includesPreview.length > 0 ? (
          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12,
              background: "rgba(255,255,255,.02)",
            }}
          >
            <div
              className="small"
              style={{ fontWeight: 800, marginBottom: 6, opacity: 0.95 }}
            >
              Includes
            </div>

            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                opacity: 0.9,
              }}
            >
              {includesPreview.map((item, index) => (
                <li key={`${p?.id || p?.slug || "product"}-include-${index}`}>
                  <span className="small">{item}</span>
                </li>
              ))}
            </ul>

            {Array.isArray(p?.includes) && p.includes.length > includesPreview.length ? (
              <div className="small" style={{ marginTop: 6, opacity: 0.7 }}>
                + more included items
              </div>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 12,
            flexWrap: "wrap",
          }}
        >
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