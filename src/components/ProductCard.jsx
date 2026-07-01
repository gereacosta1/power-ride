// src/components/ProductCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usd } from "../utils/money.js";
import { useCart } from "../context/CartContext.jsx";
import { supabase } from "../lib/supabase.js";

function formatCategory(category) {
  const c = String(category || "").toLowerCase().trim();

  const map = {
    solar: "Solar Energy",
    audio: "Audio",
    scooter: "Electric Scooters",
    bicycle: "E-Bikes",
    motorcycle: "Motorcycles",
    tech: "Tech Products",
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

function fallbackSlug(product) {
  if (product?.slug) return product.slug;

  return String(product?.name || product?.id || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getImage(product) {
  return product?.image || product?.image_url || "";
}

function hasValidPrice(price) {
  const n = Number(price || 0);
  return Number.isFinite(n) && n > 0;
}

export default function ProductCard({ p }) {
  const cart = useCart();

  const [added, setAdded] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const [storeSettings, setStoreSettings] = useState({
    paypal_enabled: false,
    paypal_pay_later_enabled: true,
    paypal_show_on_product_page: true,
  });

  const productImage = useMemo(() => getImage(p), [p]);
  const productSlug = useMemo(() => fallbackSlug(p), [p]);
  const categoryLabel = useMemo(() => formatCategory(p?.category), [p?.category]);
  const hasPrice = useMemo(() => hasValidPrice(p?.price), [p?.price]);
  const mo = useMemo(() => monthlyExample(p?.price), [p?.price]);

  const isKit = useMemo(() => {
    return String(p?.type || "").toLowerCase().trim() === "kit";
  }, [p?.type]);

  const inStock = useMemo(() => {
    if (typeof p?.inStock === "boolean") return p.inStock;
    if (typeof p?.in_stock === "boolean") return p.in_stock;
    return true;
  }, [p]);

  const includesPreview = useMemo(() => {
    if (!Array.isArray(p?.includes)) return [];
    return p.includes.filter(Boolean).slice(0, 3);
  }, [p?.includes]);

  const showPayPalNote = useMemo(() => {
    return Boolean(
      hasPrice &&
        storeSettings.paypal_enabled &&
        storeSettings.paypal_show_on_product_page
    );
  }, [hasPrice, storeSettings]);

  useEffect(() => {
    setImgOk(true);
  }, [productImage]);

  useEffect(() => {
    let active = true;

    async function loadStoreSettings() {
      try {
        const { data, error } = await supabase
          .from("store_settings")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("ProductCard loadStoreSettings error:", error);
          return;
        }

        if (!active || !data) return;

        setStoreSettings({
          paypal_enabled: Boolean(data.paypal_enabled),
          paypal_pay_later_enabled:
            data.paypal_pay_later_enabled === null ||
            data.paypal_pay_later_enabled === undefined
              ? true
              : Boolean(data.paypal_pay_later_enabled),
          paypal_show_on_product_page:
            data.paypal_show_on_product_page === null ||
            data.paypal_show_on_product_page === undefined
              ? true
              : Boolean(data.paypal_show_on_product_page),
        });
      } catch (error) {
        console.error("ProductCard loadStoreSettings unexpected error:", error);
      }
    }

    loadStoreSettings();

    return () => {
      active = false;
    };
  }, []);

  function add() {
    if (!p || !inStock) return;

    cart.addItem(p, 1);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1200);
  }

  return (
    <div
      className="card product-card"
      style={{
        overflow: "hidden",
        transition: "all .25s ease",
      }}
    >
      <div style={{ position: "relative" }}>
        {imgOk && productImage ? (
          <img
            src={productImage}
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
            No image
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
          {!inStock ? <span className="badge">Out of stock</span> : null}
        </div>
      </div>

      <div className="card-pad">
        <div className="small" style={{ opacity: 0.8 }}>
          {categoryLabel}
        </div>

        <div
          style={{
            fontWeight: 900,
            marginTop: 6,
            lineHeight: 1.15,
            fontSize: 18,
          }}
        >
          {p?.name || "Product"}
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>
            {hasPrice ? usd(p?.price) : "Contact for price"}
          </div>

          {mo ? (
            <div className="small" style={{ marginTop: 4 }}>
              As low as{" "}
              <span style={{ color: "var(--neon)", fontWeight: 700 }}>
                ${mo}/mo
              </span>{" "}
              with Affirm *
            </div>
          ) : null}

          {showPayPalNote ? (
            <div className="small" style={{ marginTop: 4, opacity: 0.9 }}>
              {storeSettings.paypal_pay_later_enabled
                ? "PayPal Pay Later available"
                : "PayPal available"}
            </div>
          ) : null}
        </div>

        {p?.short ? (
          <p className="small" style={{ marginTop: 10, opacity: 0.9 }}>
            {p.short}
          </p>
        ) : null}

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
              style={{
                fontWeight: 800,
                marginBottom: 6,
                opacity: 0.95,
              }}
            >
              Includes
            </div>

            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {includesPreview.map((item, index) => (
                <li key={`${productSlug}-include-${index}`} className="small">
                  {item}
                </li>
              ))}
            </ul>

            {Array.isArray(p?.includes) &&
            p.includes.length > includesPreview.length ? (
              <div className="small" style={{ marginTop: 6, opacity: 0.7 }}>
                + more
              </div>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 14,
          }}
        >
          <Link
            className="btn btn-primary"
            to={`/product/${productSlug}`}
            style={{ flex: 1 }}
          >
            View
          </Link>

          <button
            className="btn"
            onClick={add}
            type="button"
            disabled={!inStock}
            style={{
              flex: 1,
              background: added ? "var(--neon)" : "",
              color: added ? "#000" : "",
              fontWeight: 700,
              opacity: inStock ? 1 : 0.65,
              cursor: inStock ? "pointer" : "not-allowed",
            }}
          >
            {added ? "Added ✓" : inStock ? "Add to cart" : "Out of stock"}
          </button>
        </div>
      </div>
    </div>
  );
}