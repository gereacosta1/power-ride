// src/pages/Catalog.jsx
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";
import { supabase } from "../lib/supabase.js";
import { products as localProducts } from "../data/products.js";

function parseList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeCategory(category) {
  return String(category || "").toLowerCase().trim();
}

function normalizeSupabaseProduct(product) {
  return {
    ...product,
    id: String(product.id || product.slug || crypto.randomUUID()),
    slug: product.slug || "",
    category: normalizeCategory(product.category),
    image: product.image || product.image_url || "",
    price: Number(product.price || 0),
    includes: parseList(product.includes),
    specs: parseList(product.specs),
    inStock:
      typeof product.in_stock === "boolean"
        ? product.in_stock
        : Boolean(product.inStock),
  };
}

function normalizeLocalProduct(product) {
  return {
    ...product,
    id: String(product.id || product.slug),
    slug: product.slug || "",
    category: normalizeCategory(product.category),
    image: product.image || "",
    price: Number(product.price || 0),
    includes: Array.isArray(product.includes) ? product.includes : [],
    specs: Array.isArray(product.specs) ? product.specs : [],
    inStock: Boolean(product.inStock),
  };
}

function mergeProducts(dbProducts, localProductsList) {
  const map = new Map();

  localProductsList.forEach((product) => {
    const key = String(product.slug || product.id);
    map.set(key, product);
  });

  dbProducts.forEach((product) => {
    const key = String(product.slug || product.id);
    map.set(key, product);
  });

  return Array.from(map.values());
}

function getProductsByCategory(products, category) {
  const targetCategory = normalizeCategory(category);

  return products.filter((product) => {
    return normalizeCategory(product.category) === targetCategory;
  });
}

export default function Catalog() {
  const [products, setProducts] = useState(() =>
    localProducts.map(normalizeLocalProduct)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const localNormalized = localProducts.map(normalizeLocalProduct);

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Catalog loadProducts error:", error);
        setProducts(localNormalized);
        return;
      }

      const dbNormalized = (data || []).map(normalizeSupabaseProduct);
      const merged = mergeProducts(dbNormalized, localNormalized);

      setProducts(merged);
    } catch (error) {
      console.error("Catalog loadProducts unexpected error:", error);
      setProducts(localNormalized);
    } finally {
      setLoading(false);
    }
  }

  const scooters = useMemo(
    () => getProductsByCategory(products, "scooter"),
    [products]
  );

  const bicycles = useMemo(
    () => getProductsByCategory(products, "bicycle"),
    [products]
  );

  const motorcycles = useMemo(
    () => getProductsByCategory(products, "motorcycle"),
    [products]
  );

  const audio = useMemo(
    () => getProductsByCategory(products, "audio"),
    [products]
  );

  const solar = useMemo(
    () => getProductsByCategory(products, "solar"),
    [products]
  );

  const tech = useMemo(
    () => getProductsByCategory(products, "tech"),
    [products]
  );

  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div>
        <div className="h-eyebrow">Catalog</div>
        <h2 style={{ marginTop: 10 }}>Products</h2>
      </div>

      {loading ? (
        <div className="card card-pad" style={{ marginTop: 20 }}>
          Loading products...
        </div>
      ) : (
        <>
          <Section title="Electric Scooters" items={scooters} />
          <Section title="E-Bikes" items={bicycles} />
          <Section title="Motorcycles" items={motorcycles} />
          <Section title="JBL Speakers" items={audio} />
          <Section title={`Solar Products (${solar.length})`} items={solar} />
          <Section title="Tech Products" items={tech} />
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
    <section
      id={title.toLowerCase().includes("solar") ? "solar" : undefined}
      style={{ marginTop: 18 }}
    >
      <h3>{title}</h3>

      <div className="grid" style={{ marginTop: 12 }}>
        {items.map((product) => (
          <ProductCard key={product.slug || product.id} p={product} />
        ))}
      </div>
    </section>
  );
}