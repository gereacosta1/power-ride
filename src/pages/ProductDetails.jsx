//src/pages/ProductDetails.jsx
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
            <Link className="btn btn-primary" to="/catalog">Back to catalog</Link>
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
              qty: 1
            }
          ],
          currency: "USD",
          shipping_amount: 0,
          tax_amount: 0,
          metadata: { product_slug: product.slug, source: "product_details" }
        })
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

  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 16, alignItems: "start" }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
          />
        </div>

        <div className="card card-pad">
          <div className="h-eyebrow">{product.category || "Scooter"}</div>
          <h2 style={{ margin: "10px 0 6", letterSpacing: "-.02em" }}>{product.name}</h2>

          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{usd(product.price)}</div>
            <div className="small">
              As low as <span style={{ color: "var(--neon)" }}>${(product.price / 12).toFixed(2)}/mo</span> with Affirm (example)
            </div>
          </div>

          <p className="small" style={{ marginTop: 10 }}>{product.short}</p>

          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Specs</div>
            <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
              {product.specs?.map((s) => <li key={s} style={{ marginBottom: 6 }}>{s}</li>)}
            </ul>
          </div>

          {err && (
            <div className="card" style={{ marginTop: 12, padding: 12, borderColor: "rgba(255,80,80,.35)" }}>
              <div style={{ fontWeight: 800 }}>Checkout error</div>
              <div className="small" style={{ marginTop: 6 }}>{err}</div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={startAffirmCheckout} disabled={busy}>
              {busy ? "Starting..." : "Checkout with Affirm"}
            </button>

            <button className="btn" onClick={addToCart}>
              {added ? "Added" : "Add to cart"}
            </button>

            <Link className="btn" to="/cart">Go to cart</Link>
            <Link className="btn" to="/catalog">Back</Link>
          </div>

          <div className="hr" />

          <AffirmDisclosure compact />
        </div>
      </div>
    </div>
  );
}
