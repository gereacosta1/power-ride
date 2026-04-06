// src/pages/ProductDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { usd } from "../utils/money.js";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";
import { useCart } from "../context/CartContext.jsx";

function parseList(str) {
  if (!str) return [];
  return String(str)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

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
  if (!c) return "Product";
  return c.charAt(0).toUpperCase() + c.slice(1);
}

function loadPayPalSdk(clientId) {
  return new Promise((resolve, reject) => {
    if (!clientId) {
      reject(new Error("Missing PayPal client id"));
      return;
    }

    const existing = document.querySelector(
      `script[data-paypal-client-id="${clientId}"]`
    );

    if (existing) {
      if (window.paypal) {
        resolve(window.paypal);
        return;
      }

      existing.addEventListener("load", () => resolve(window.paypal));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load PayPal SDK"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&components=hosted-buttons`;
    script.async = true;
    script.dataset.paypalClientId = clientId;

    script.onload = () => {
      if (window.paypal) resolve(window.paypal);
      else reject(new Error("PayPal SDK loaded but window.paypal is missing"));
    };

    script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
    document.body.appendChild(script);
  });
}

export default function ProductDetails() {
  const { slug } = useParams();
  const cart = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [added, setAdded] = useState(false);
  const [imgOk, setImgOk] = useState(true);

  const [storeSettings, setStoreSettings] = useState({
    paypal_enabled: false,
    paypal_client_id: "",
    paypal_hosted_button_id: "",
    paypal_pay_later_enabled: true,
    paypal_show_on_product_page: true,
  });
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalError, setPaypalError] = useState("");
  const [paypalRenderedFor, setPaypalRenderedFor] = useState("");

  useEffect(() => {
    loadProduct();
    loadStoreSettings();
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    async function renderPayPalButton() {
      const shouldShowPayPal =
        storeSettings.paypal_enabled &&
        storeSettings.paypal_show_on_product_page &&
        storeSettings.paypal_client_id &&
        storeSettings.paypal_hosted_button_id &&
        product;

      if (!shouldShowPayPal) {
        setPaypalReady(false);
        setPaypalError("");
        return;
      }

      const renderKey = `${storeSettings.paypal_client_id}:${storeSettings.paypal_hosted_button_id}:${product.slug}`;
      if (paypalRenderedFor === renderKey) return;

      setPaypalError("");
      setPaypalReady(false);

      try {
        const paypal = await loadPayPalSdk(storeSettings.paypal_client_id);
        if (cancelled) return;

        const container = document.getElementById("paypal-hosted-button-container");
        if (!container) return;

        container.innerHTML = "";

        if (!paypal?.HostedButtons) {
          throw new Error("PayPal Hosted Buttons is not available");
        }

        await paypal
          .HostedButtons({
            hostedButtonId: storeSettings.paypal_hosted_button_id,
          })
          .render("#paypal-hosted-button-container");

        if (cancelled) return;
        setPaypalReady(true);
        setPaypalRenderedFor(renderKey);
      } catch (error) {
        console.error("PayPal render error:", error);
        if (!cancelled) {
          setPaypalError("PayPal could not be loaded right now.");
          setPaypalReady(false);
        }
      }
    }

    renderPayPalButton();

    return () => {
      cancelled = true;
    };
  }, [storeSettings, product, paypalRenderedFor]);

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

    if (data) {
      setStoreSettings({
        paypal_enabled: Boolean(data.paypal_enabled),
        paypal_client_id: data.paypal_client_id || "",
        paypal_hosted_button_id: data.paypal_hosted_button_id || "",
        paypal_pay_later_enabled: Boolean(data.paypal_pay_later_enabled),
        paypal_show_on_product_page: Boolean(data.paypal_show_on_product_page),
      });
    }
  }

  async function loadProduct() {
    setLoading(true);
    setErr("");
    setImgOk(true);
    setPaypalRenderedFor("");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(error);
      setProduct(null);
      setErr(error.message || "Failed to load product");
    } else {
      setProduct({
        ...data,
        includes: parseList(data.includes),
        specs: parseList(data.specs),
        inStock: data.in_stock,
      });
    }

    setLoading(false);
  }

  const isKit = useMemo(
    () => String(product?.type || "").toLowerCase() === "kit",
    [product?.type]
  );

  const categoryLabel = useMemo(
    () => formatCategory(product?.category),
    [product?.category]
  );

  const monthlyPrice = useMemo(() => {
    const n = Number(product?.price || 0);
    if (!Number.isFinite(n) || n <= 0) return "";
    return (n / 12).toFixed(2);
  }, [product?.price]);

  const showPayPalBlock = useMemo(() => {
    return Boolean(
      product &&
        storeSettings.paypal_enabled &&
        storeSettings.paypal_show_on_product_page &&
        storeSettings.paypal_client_id &&
        storeSettings.paypal_hosted_button_id
    );
  }, [product, storeSettings]);

  function addToCart() {
    if (!product) return;
    cart.addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
        <div className="card card-pad">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
        <div className="card card-pad">
          <div style={{ fontWeight: 900, fontSize: 22 }}>Product not found</div>
          <div className="small" style={{ marginTop: 8, opacity: 0.9 }}>
            {err || "The product you’re looking for doesn’t exist."}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link className="btn btn-primary" to="/catalog">
              Back to catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div
        className="pd-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 520px) minmax(320px, 1fr)",
          gap: 18,
          alignItems: "start",
        }}
      >
        <div className="card" style={{ overflow: "hidden" }}>
          <div
            style={{
              minHeight: 460,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,.02)",
              padding: 18,
            }}
          >
            {imgOk && product.image ? (
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImgOk(false)}
                style={{
                  width: "100%",
                  maxHeight: 420,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  minHeight: 360,
                  display: "grid",
                  placeItems: "center",
                  color: "rgba(255,255,255,.75)",
                  fontWeight: 800,
                }}
              >
                Image missing
              </div>
            )}
          </div>
        </div>

        <div className="card card-pad">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div className="h-eyebrow">{categoryLabel}</div>
              <h2 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>
                {product.name}
              </h2>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {product.badge ? <span className="badge">{product.badge}</span> : null}
              {isKit ? <span className="badge">KIT</span> : null}
              {product.inStock ? (
                <span className="badge">In stock</span>
              ) : (
                <span className="badge">Out of stock</span>
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 900 }}>
              {usd(product.price)}
            </div>

            {monthlyPrice ? (
              <div className="small">
                As low as{" "}
                <span style={{ color: "var(--neon)" }}>${monthlyPrice}/mo</span>{" "}
                with Affirm{" "}
                <a href="#affirm-disclosure" className="small">
                  *
                </a>
              </div>
            ) : null}
          </div>

          {product.short ? (
            <div
              className="card"
              style={{
                marginTop: 16,
                padding: 14,
                background: "rgba(255,255,255,.03)",
              }}
            >
              <div className="small" style={{ opacity: 0.95 }}>
                {product.short}
              </div>
            </div>
          ) : null}

          {showPayPalBlock ? (
            <div
              className="card"
              style={{
                marginTop: 16,
                padding: 14,
                background: "rgba(255,255,255,.03)",
              }}
            >
              <div style={{ fontWeight: 800 }}>PayPal</div>

              <div className="small" style={{ marginTop: 6, opacity: 0.9 }}>
                {storeSettings.paypal_pay_later_enabled
                  ? "Pay in full or use Pay Later with PayPal."
                  : "Pay securely with PayPal."}
              </div>

              <div
                id="paypal-hosted-button-container"
                style={{ marginTop: 14, minHeight: 44 }}
              />

              {!paypalReady && !paypalError ? (
                <div className="small" style={{ marginTop: 8, opacity: 0.75 }}>
                  Loading PayPal...
                </div>
              ) : null}

              {paypalError ? (
                <div className="small" style={{ marginTop: 8, opacity: 0.85 }}>
                  {paypalError}
                </div>
              ) : null}
            </div>
          ) : null}

          {Array.isArray(product.specs) && product.specs.length > 0 ? (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Specs</div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {product.specs.map((item, i) => (
                  <span
                    key={`${product.slug}-spec-${i}`}
                    className="badge"
                    style={{ padding: "8px 12px" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {isKit && Array.isArray(product.includes) && product.includes.length > 0 ? (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>
                What’s included
              </div>

              <div
                className="card"
                style={{
                  padding: 14,
                  background: "rgba(255,255,255,.03)",
                }}
              >
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 18,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  {product.includes.map((item, i) => (
                    <li key={`${product.slug}-include-${i}`} className="small">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 20,
            }}
          >
            <button className="btn btn-primary" onClick={addToCart} type="button">
              {added ? "Added" : "Add to cart"}
            </button>

            <Link className="btn" to="/cart">
              Go to cart
            </Link>

            <Link className="btn" to="/catalog">
              Back
            </Link>
          </div>

          <div id="affirm-disclosure" style={{ marginTop: 20 }}>
            <AffirmDisclosure showExample />
          </div>
        </div>
      </div>
    </div>
  );
}