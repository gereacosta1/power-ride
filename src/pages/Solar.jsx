// src/pages/Solar.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";

export default function Solar() {
  const solarProducts = useMemo(() => {
    return products.filter(
      (p) => String(p.category || "").toLowerCase().trim() === "solar"
    );
  }, []);

  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="h-eyebrow">Solar Energy</div>

          <h2 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>
            Solar Products
          </h2>

          <p
            className="small"
            style={{ marginTop: 8, opacity: 0.9, maxWidth: 820 }}
          >
            Power stations, solar panels, batteries, complete solar kits, and
            home backup energy systems. <a href="#affirm-disclosure">*</a>
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" to="/catalog#solar">
            View in Catalog
          </Link>

          <Link className="btn" to="/catalog">
            Back to Catalog
          </Link>
        </div>
      </div>

      {solarProducts.length > 0 ? (
        <>
          <div
            className="small"
            style={{
              marginTop: 14,
              opacity: 0.85,
              fontWeight: 700,
            }}
          >
            {solarProducts.length} solar products available
          </div>

          <div style={{ marginTop: 16 }} className="grid">
            {solarProducts.map((product) => (
              <ProductCard key={product.id} p={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="card card-pad" style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 900 }}>No solar products yet</div>

          <div className="small" style={{ marginTop: 8, opacity: 0.9 }}>
            Add products in <code>src/data/products.js</code> under{" "}
            <code>solarProducts</code>.
          </div>
        </div>
      )}

      {/* Compliance: disclosure MUST be on the same URL where Affirm is advertised */}
      <div style={{ marginTop: 18 }}>
        <AffirmDisclosure showExample />
      </div>
    </div>
  );
}