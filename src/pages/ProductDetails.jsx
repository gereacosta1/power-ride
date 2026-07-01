// src/pages/ProductDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { usd } from "../utils/money.js";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getProductBySlug } from "../data/products.js";

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

function formatCategory(category) {
  const c = normalizeCategory(category);

  const map = {
    solar: "Solar Energy",
    audio: "Audio",
    scooter: "Electric Scooters",
    bicycle: "E-Bikes",
    motorcycle: "Motorcycles",
    tech: "Tech Products",
  };

  if (map[c]) return map[c];
  if (!c) return "Product";

  return c.charAt(0).toUpperCase() + c.slice(1);
}

function normalizeSupabaseProduct(product) {
  return {
    ...product,
    id: String(product.id || product.slug || ""),
    slug: product.slug || "",
    name: product.name || product.title || "Product",
    category: normalizeCategory(product.category),
    image: product.image || product.image_url || "",
    price: Number(product.price || 0),
    includes: parseList(product.includes),
    specs: parseList(product.specs),
    badge: product.badge || "",
    type: product.type || "single",
    short: product.short || product.description || "",
    inStock:
      typeof product.in_stock === "boolean"
        ? product.in_stock
        : Boolean(product.inStock),
  };
}

function normalizeLocalProduct(product) {
  return {
    ...product,
    id: String(product.id || product.slug || ""),
    slug: product.slug || "",
    name: product.name || product.title || "Product",
    category: normalizeCategory(product.category),
    image: product.image || product.image_url || "",
    price: Number(product.price || 0),
    includes: Array.isArray(product.includes) ? product.includes : [],
    specs: Array.isArray(product.specs) ? product.specs : [],
    badge: product.badge || "",
    type: product.type || "single",
    short: product.short || product.description || "",
    inStock: Boolean(product.inStock),
  };
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
      if (window.paypal) {
        resolve(window.paypal);
      } else {
        reject(new Error("PayPal SDK loaded but window.paypal is missing"));
      }
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
        setPaypalRenderedFor("");
        return;
      }

      const renderKey = `${storeSettings.paypal_client_id}:${storeSettings.paypal_hosted_button_id}:${product.slug}`;

      if (paypalRenderedFor === renderKey) return;

      setPaypalError("");
      setPaypalReady(false);

      try {
        const paypal = await loadPayPalSdk(storeSettings.paypal_client_id);

        if (cancelled) return;

        const container = document.getElementById(
          "paypal-hosted-button-container"
        );

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
          setPaypalRenderedFor("");
        }
      }
    }

    renderPayPalButton();

    return () => {
      cancelled = true;
    };
  }, [storeSettings, product, paypalRenderedFor]);

  async function loadStoreSettings() {
    try {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("loadStoreSettings error:", error);
        return;
      }

      if (!data) return;

      setStoreSettings({
        paypal_enabled: Boolean(data.paypal_enabled),
        paypal_client_id: data.paypal_client_id || "",
        paypal_hosted_button_id: data.paypal_hosted_button_id || "",
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
      console.error("loadStoreSettings unexpected error:", error);
    }
  }

  async function loadProduct() {
    setLoading(true);
    setErr("");
    setImgOk(true);
    setPaypalRenderedFor("");
    setPaypalReady(false);
    setPaypalError("");

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (data) {
        setProduct(normalizeSupabaseProduct(data));
        return;
      }

      const localProduct = getProductBySlug(slug);

      if (localProduct) {
        setProduct(normalizeLocalProduct(localProduct));
        return;
      }

      if (error) {
        console.error("loadProduct error:", error);
        setErr(error.message || "Failed to load product");
      }

      setProduct(null);
    } catch (error) {
      console.error("loadProduct unexpected error:", error);

      const localProduct = getProductBySlug(slug);

      if (localProduct) {
        setProduct(normalizeLocalProduct(localProduct));
      } else {
        setErr(error.message || "Failed to load product");
        setProduct(null);
      }
    } finally {
      setLoading(false);
    }
  }

  const isKit = useMemo(() => {
    return String(product?.type || "").toLowerCase() === "kit";
  }, [product?.type]);

  const categoryLabel = useMemo(() => {
    return formatCategory(product?.category);
  }, [product?.category]);

  const hasPrice = useMemo(() => {
    const price = Number(product?.price || 0);
    return Number.isFinite(price) && price > 0;
  }, [product?.price]);

  const monthlyPrice = useMemo(() => {
    const price = Number(product?.price || 0);
    if (!Number.isFinite(price) || price <= 0) return "";
    return (price / 12).toFixed(2);
  }, [product?.price]);

  const showPayPalBlock = useMemo(() => {
    return Boolean(
      product &&
        hasPrice &&
        storeSettings.paypal_enabled &&
        storeSettings.paypal_show_on_product_page &&
        storeSettings.paypal_client_id &&
        storeSettings.paypal_hosted_button_id
    );
  }, [product, hasPrice, storeSettings]);

  function addToCart() {
    if (!product) return;

    cart.addItem(product, 1);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 900);
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
              Back to Catalog
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
              {product.badge ? (
                <span className="badge">{product.badge}</span>
              ) : null}

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
              {hasPrice ? usd(product.price) : "Contact for price"}
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
                {product.specs.map((item, index) => (
                  <span
                    key={`${product.slug || product.id}-spec-${index}`}
                    className="badge"
                    style={{ padding: "8px 12px" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {isKit &&
          Array.isArray(product.includes) &&
          product.includes.length > 0 ? (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>
                What’s Included
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
                  {product.includes.map((item, index) => (
                    <li
                      key={`${product.slug || product.id}-include-${index}`}
                      className="small"
                    >
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
            <button
              className="btn btn-primary"
              onClick={addToCart}
              type="button"
              disabled={!product.inStock}
            >
              {added ? "Added" : product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            <Link className="btn" to="/cart">
              Go to Cart
            </Link>

            <Link
              className="btn"
              to={
                normalizeCategory(product.category) === "solar"
                  ? "/solar"
                  : "/catalog"
              }
            >
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