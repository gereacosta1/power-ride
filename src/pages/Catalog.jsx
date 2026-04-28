import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";
import { supabase } from "../lib/supabase.js";
import { products as localProducts } from "../data/products.js";

function parseList(str) {
  if (!str) return [];
  if (Array.isArray(str)) return str.filter(Boolean);
  return String(str)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeSupabaseProduct(p) {
  return {
    ...p,
    includes: parseList(p.includes),
    specs: parseList(p.specs),
    inStock: Boolean(p.in_stock),
  };
}

function normalizeLocalProduct(p) {
  return {
    ...p,
    includes: Array.isArray(p.includes) ? p.includes : [],
    specs: Array.isArray(p.specs) ? p.specs : [],
    inStock: Boolean(p.inStock),
  };
}

function mergeProducts(dbProducts, localProductsList) {
  const map = new Map();

  localProductsList.forEach((p) => {
    map.set(String(p.slug || p.id), p);
  });

  dbProducts.forEach((p) => {
    map.set(String(p.slug || p.id), p);
  });

  return Array.from(map.values());
}

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const localNormalized = localProducts.map(normalizeLocalProduct);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Catalog loadProducts error:", error);
      setProducts(localNormalized);
      setLoading(false);
      return;
    }

    const dbNormalized = (data || []).map(normalizeSupabaseProduct);
    const merged = mergeProducts(dbNormalized, localNormalized);

    setProducts(merged);
    setLoading(false);
  }

  const scooters = useMemo(
    () => products.filter((p) => p.category === "scooter"),
    [products]
  );

  const bicycles = useMemo(
    () => products.filter((p) => p.category === "bicycle"),
    [products]
  );

  const motorcycles = useMemo(
    () => products.filter((p) => p.category === "motorcycle"),
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

  const tech = useMemo(
    () => products.filter((p) => p.category === "tech"),
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
          <Section title="E-bikes" items={bicycles} />
          <Section title="Motorcycles" items={motorcycles} />
          <Section title="JBL speakers" items={audio} />
          <Section title="Solar products" items={solar} />
          <Section title="Tech products" items={tech} />
        </>
      )}

      <div style={{ marginTop: 18 }}>
        <AffirmDisclosure showExample />
      </div>
    </div>
  );
}

function Section({ title, items }) {
  if (!items.length) return null;

  return (
    <section style={{ marginTop: 18 }}>
      <h3>{title}</h3>

      <div className="grid" style={{ marginTop: 12 }}>
        {items.map((p) => (
          <ProductCard key={p.slug || p.id} p={p} />
        ))}
      </div>
    </section>
  );
}