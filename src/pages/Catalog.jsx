import React from "react";
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";

export default function Catalog() {
  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="h-eyebrow">Electric scooters</div>
          <h2 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>Catalog</h2>
          <p className="small" style={{ marginTop: 8 }}>
            Electric scooters only. Financing with Affirm available on eligible purchases.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {/* Compliance: disclosure MUST be on the same URL where Affirm is advertised */}
      <div style={{ marginTop: 18 }}>
        <AffirmDisclosure />
      </div>
    </div>
  );
}
