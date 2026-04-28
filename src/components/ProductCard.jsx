import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usd } from "../utils/money.js";
import { useCart } from "../context/CartContext.jsx";
import { supabase } from "../lib/supabase.js";

function formatCategory(cat) {
  const c = String(cat || "").toLowerCase().trim();

  const map = {
    solar: "Solar energy",
    audio: "Audio",
    scooter: "Electric scooters",
    bicycle: "E-bikes",
    motorcycle: "Motorcycles",
    tech: "Tech products",
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

function fallbackSlug(p) {
  if (p?.slug) return p.slug;

  return String(p?.name || p?.id || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

  useEffect(() => {
    setImgOk(true);
  }, [p?.image]);

  useEffect(() => {
    let active = true;

    async function loadStoreSettings() {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("loadStoreSettings error:", error);
        return;
      }

      if (!active || !data) return;

      setStoreSettings({
        paypal_enabled: Boolean(data.paypal_enabled),
        paypal_pay_later_enabled: Boolean(data.paypal_pay_later_enabled),
        paypal_show_on_product_page: Boolean(data.paypal_show_on_product_page),
      });
    }

    loadStoreSettings();

    return () => {
      active = false;
    };
  }, []);

  const productSlug = useMemo(() => fallbackSlug(p), [p]);
  const categoryLabel = useMemo(() => formatCategory(p?.category), [p?.category]);
  const mo = useMemo(() => monthlyExample(p?.price), [p?.price]);

  const isKit = useMemo(
    () => String(p?.type || "").toLowerCase() === "kit",
    [p?.type]
  );

  const includesPreview = useMemo(() => {
    if (!Array.isArray(p?.includes)) return [];
    return p.includes.filter(Boolean).slice(0, 3);
  }, [p?.includes]);

  const showPayPalNote = useMemo(() => {
    return Boolean(
      storeSettings.paypal_enabled && storeSettings.paypal_show_on_product_page
    );
  }, [storeSettings]);

  function add() {
    cart.addItem(p, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
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
          {p?.name}
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>
            {usd(p?.price)}
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
                <li key={index} className="small">
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
            style={{
              flex: 1,
              background: added ? "var(--neon)" : "",
              color: added ? "#000" : "",
              fontWeight: 700,
            }}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}