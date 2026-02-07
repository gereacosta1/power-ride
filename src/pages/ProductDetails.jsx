import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductBySlug } from "../data/products.js";
import { usd } from "../utils/money.js";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { slug } = useParams();
  const product = useMemo(() => getProductBySlug(slug), [slug]);
  const cart = useCart();

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="container" style={{ padding: 18 }}>
        <div className="card card-pad">
          <div style={{ fontWeight: 900 }}>Product not found</div>
          <div className="small" style={{ marginTop: 6 }}>
            The product you’re looking for doesn’t exist.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link className="btn btn-primary" to="/catalog">
              Back to catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function addToCart() {
    cart.addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }

  async function startAffirmCheckout() {
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/affirm-authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              display_name: product.name,
              sku: product.id,
              unit_price: Math.round(product.price * 100),
              qty: 1,
            },
          ],
          currency: "USD",
          shipping_amount: 0,
          tax_amount: 0,
          metadata: { product_slug: product.slug, source: "product_details" },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Affirm authorize failed");

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      throw new Error("Missing checkout_url from server");
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  const specs = Array.isArray(product.specs) ? product.specs : [];

  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div className="pd-grid">
        {/* Media */}
        <div className="card pd-media">
          <div className="pd-media-inner">
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        {/* Details */}
        <div className="card card-pad pd-panel">
          <div className="pd-top">
            <div>
              <div className="h-eyebrow">{product.category || "Product"}</div>
              <h2 style={{ margin: "10px 0 6", letterSpacing: "-.02em" }}>
                {product.name}
              </h2>
            </div>

            {product.badge ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="badge">{product.badge}</span>
              </div>
            ) : null}
          </div>

          <div className="pd-price">
            <div style={{ fontSize: 24, fontWeight: 900 }}>{usd(product.price)}</div>
            <div className="small">
              As low as{" "}
              <span style={{ color: "var(--neon)" }}>
                ${(product.price / 12).toFixed(2)}/mo
              </span>{" "}
              with Affirm (example)
            </div>
          </div>

          <div className="pd-note">
            <div className="small" style={{ margin: 0, opacity: 0.95 }}>
              {product.short}
            </div>
          </div>

          {specs.length ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Specs</div>
              <div className="pd-specs">
                {specs.map((s) => (
                  <span key={s} className="pd-spec">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {err && (
            <div
              className="card"
              style={{ marginTop: 12, padding: 12, borderColor: "rgba(255,80,80,.35)" }}
            >
              <div style={{ fontWeight: 800 }}>Checkout error</div>
              <div className="small" style={{ marginTop: 6 }}>{err}</div>
            </div>
          )}

          <div className="pd-actions">
            <button
              className="btn btn-primary"
              onClick={startAffirmCheckout}
              disabled={busy}
              type="button"
            >
              {busy ? "Starting..." : "Checkout with Affirm"}
            </button>

            <button className="btn" onClick={addToCart} type="button">
              {added ? "Added" : "Add to cart"}
            </button>

            <Link className="btn" to="/cart">Go to cart</Link>
            <Link className="btn" to="/catalog">Back</Link>
          </div>

          <div className="hr" />

          {/* Acá SÍ mostramos el ejemplo TILA porque hay "$X/mo" en esta URL */}
          <AffirmDisclosure showExample />
        </div>
      </div>
    </div>
  );
}
