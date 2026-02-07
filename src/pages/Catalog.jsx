import React, { useMemo } from "react";
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";

function Section({ title, subtitle, items }) {
  return (
    <section style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="h-eyebrow">{subtitle}</div>
          <h2 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>{title}</h2>
        </div>
      </div>

      {items.length ? (
        <div style={{ marginTop: 16 }} className="grid">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="card card-pad" style={{ marginTop: 14, opacity: 0.95 }}>
          <div style={{ fontWeight: 900 }}>Coming soon</div>
          <div className="small" style={{ marginTop: 6 }}>
            We’re adding products to this section.
          </div>
        </div>
      )}
    </section>
  );
}

export default function Catalog() {
  const groups = useMemo(() => {
    const scooters = [];
    const solar = [];
    const speakers = [];
    const other = [];

    for (const p of products) {
      if (!p?.inStock) continue;

      if (p.category === "scooter") scooters.push(p);
      else if (p.category === "solar") solar.push(p);
      else if (p.category === "speaker") speakers.push(p);
      else other.push(p);
    }

    return { scooters, solar, speakers, other };
  }, []);

  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="h-eyebrow">Catalog</div>
          <h2 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>Browse products</h2>
          <p className="small" style={{ marginTop: 8 }}>
            Electric scooters, solar energy, and JBL speakers. Financing with Affirm available on eligible purchases.
          </p>
        </div>
      </div>

      <Section title="Electric scooters" subtitle="Power Ride" items={groups.scooters} />
      <Section title="Solar energy" subtitle="Power Ride" items={groups.solar} />
      <Section title="JBL speakers" subtitle="Audio" items={groups.speakers} />

      {groups.other.length ? (
        <Section title="Other" subtitle="More" items={groups.other} />
      ) : null}

      {/* Compliance: disclosure MUST be on the same URL where Affirm is advertised */}
      <div style={{ marginTop: 22 }}>
        <AffirmDisclosure showExample />
      </div>
    </div>
  );
}
