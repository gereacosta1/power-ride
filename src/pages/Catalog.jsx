import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";
import { supabase } from "../lib/supabase.js";

function parseList(str) {
  if (!str) return [];
  return String(str)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeProduct(p) {
  return {
    ...p,
    includes: parseList(p.includes),
    specs: parseList(p.specs),
    inStock: p.in_stock,
  };
}

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error(error);
      setProducts([]);
    } else {
      setProducts((data || []).map(normalizeProduct));
    }

    setLoading(false);
  }

  const scooters = useMemo(
    () => products.filter((p) => p.category === "scooter"),
    [products]
  );

  const audio = useMemo(
    () => products.filter((p) => p.category === "audio"),
    [products]
  );

  const solar = useMemo(
    () => products.filter((p) => p.category === "solar"),
    [products]
  );

  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div>
        <div className="h-eyebrow">Catalog</div>
        <h2 style={{ marginTop: 10 }}>Products</h2>
      </div>

      {loading ? (
        <div style={{ marginTop: 20 }}>Loading...</div>
      ) : (
        <>
          <Section title="Electric scooters" items={scooters} />
          <Section title="JBL speakers" items={audio} />
          <Section title="Solar products" items={solar} />
        </>
      )}

      <div style={{ marginTop: 18 }}>
        <AffirmDisclosure showExample />
      </div>
    </div>
  );
}

function Section({ title, items }) {
  return (
    <section style={{ marginTop: 18 }}>
      <h3>{title}</h3>

      {!items.length ? (
        <div style={{ marginTop: 12 }}>No products yet</div>
      ) : (
        <div className="grid" style={{ marginTop: 12 }}>
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}