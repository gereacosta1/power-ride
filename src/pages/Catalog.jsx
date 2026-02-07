// src/pages/Catalog.jsx
import React, { useMemo } from "react";
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";

export default function Catalog() {
  const scooters = useMemo(() => products.filter((p) => p.category === "scooter"), []);
  const audio = useMemo(() => products.filter((p) => p.category === "audio"), []);
  const solar = useMemo(() => products.filter((p) => p.category === "solar"), []);

  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="h-eyebrow">Catalog</div>
          <h2 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>Products</h2>
          <p className="small" style={{ marginTop: 8 }}>
            Financing with Affirm available on eligible purchases.
          </p>
        </div>
      </div>

      {/* SCOOTERS */}
      <Section title="Electric scooters" eyebrow="Scooters" items={scooters} />

      {/* JBL / AUDIO */}
      <Section title="JBL speakers" eyebrow="Audio" items={audio} />

      {/* SOLAR */}
      <section id="solar" style={{ marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div className="h-eyebrow">Solar energy</div>
            <h3 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>Coming soon</h3>
            <p className="small" style={{ marginTop: 8, opacity: 0.9 }}>
              We’re adding products to this section.
            </p>
          </div>
        </div>

        {solar.length ? (
          <div style={{ marginTop: 16 }} className="grid">
            {solar.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <div className="card card-pad" style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 900 }}>No solar products yet</div>
            <div className="small" style={{ marginTop: 8, opacity: 0.9 }}>
              Placeholder listo. Cuando tu cliente te pase productos, los cargamos acá.
            </div>
          </div>
        )}
      </section>

      {/* Compliance: disclosure MUST be on the same URL where Affirm is advertised */}
      <div style={{ marginTop: 18 }}>
        <AffirmDisclosure />
      </div>
    </div>
  );
}

function Section({ eyebrow, title, items }) {
  return (
    <section style={{ marginTop: 18 }}>
      <div>
        <div className="h-eyebrow">{eyebrow}</div>
        <h3 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>{title}</h3>
      </div>

      {!items.length ? (
        <div className="card card-pad" style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 900 }}>No products yet</div>
          <div className="small" style={{ marginTop: 8, opacity: 0.9 }}>
            Coming soon.
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 16 }} className="grid">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </section>
  );
}
