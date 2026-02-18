// src/pages/Home.jsx
import React, { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { products } from "../data/products.js";
import { usd } from "../utils/money.js";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";

function categoryLabel(cat) {
  const c = String(cat || "").toLowerCase().trim();
  if (c === "scooter") return "Electric scooters";
  if (c === "solar") return "Solar energy";
  if (c === "audio") return "JBL speakers";
  if (c === "bicycle") return "E-bikes";
  if (c === "motorcycle") return "Motorcycles";
  return c ? c.charAt(0).toUpperCase() + c.slice(1) : "Product";
}

function monthlyExample(price) {
  const n = Number(price || 0);
  if (!n) return "";
  return (n / 12).toFixed(2);
}

export default function Home() {
  const featured = useMemo(() => products.slice(0, 6), [products]);
  const spotlight = useMemo(() => products[0], [products]);
  const location = useLocation();

  // Smooth-scroll when we land on "/" with a hash (ex: "/#store")
  useEffect(() => {
    const hash = location?.hash || "";
    if (!hash) return;

    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    // wait a tick so layout is ready
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [location?.hash]);

  return (
    <div className="container" style={{ paddingBottom: 24 }}>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <span className="h-eyebrow">Power • Neon • Fast Checkout</span>
            <h1 className="h-title">
              Power <span className="glow">Ride</span> LLC
            </h1>

            <p className="h-sub">
              Electric scooters, solar energy, and JBL speakers. Clean catalog, fast browsing, and
              flexible financing messaging. Built to look premium, load fast, and convert.
            </p>

            <div className="home-cta">
              <Link className="btn btn-primary" to="/catalog">
                Browse products
              </Link>
              <Link className="btn" to="/legal">
                Financing details
              </Link>
              <a className="btn" href="#featured">
                See featured
              </a>
            </div>

            <div className="home-badges">
              <span className="badge">Affirm messaging</span>
              <span className="badge">Mobile-first</span>
              <span className="badge">Fast UI</span>
              <span className="badge">Clean catalog</span>
            </div>

            <div className="home-micro">
              <div className="micro-item">
                <div className="micro-k">Same-day setup</div>
                <div className="micro-v">Catalog + checkout ready</div>
              </div>
              <div className="micro-item">
                <div className="micro-k">Premium UI</div>
                <div className="micro-v">Dark glass + neon</div>
              </div>
              <div className="micro-item">
                <div className="micro-k">Clear info</div>
                <div className="micro-v">Specs + pricing</div>
              </div>
            </div>
          </div>

          {/* HERO SIDE: Spotlight product */}
          <div className="card card-pad home-spotlight">
            <div className="spot-top">
              <div>
                <div className="h-eyebrow">Spotlight</div>
                <div style={{ fontWeight: 900, marginTop: 8, fontSize: 18 }}>
                  {spotlight?.name || "Featured product"}
                </div>
                <div className="small" style={{ marginTop: 6, opacity: 0.9 }}>
                  {spotlight?.short || "Popular pick — clean look and strong value."}
                </div>
              </div>

              <div className="spot-price">
                <div className="small" style={{ opacity: 0.85 }}>
                  From
                </div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>
                  {spotlight ? usd(spotlight.price) : "$—"}
                </div>

                {/* Trigger term ($/mo) => MUST connect to disclosure on same URL */}
                {spotlight?.price ? (
                  <div className="small">
                    As low as{" "}
                    <span style={{ color: "var(--neon)" }}>${monthlyExample(spotlight.price)}/mo</span>{" "}
                    with Affirm{" "}
                    <a href="#affirm-disclosure" className="small" style={{ opacity: 0.95 }}>
                      *
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="hr" />

            <div className="spot-media">
              {spotlight?.image ? (
                <img src={spotlight.image} alt={spotlight.name} className="spot-img" loading="lazy" />
              ) : (
                <div className="spot-img" />
              )}

              <div className="spot-actions">
                <Link className="btn btn-primary" to={spotlight ? `/product/${spotlight.slug}` : "/catalog"}>
                  View details
                </Link>
                <Link className="btn" to="/catalog">
                  Browse all
                </Link>
              </div>
            </div>

            <div className="spot-chips">
              <span className="chip">Fast delivery</span>
              <span className="chip">Premium build</span>
              <span className="chip">Flexible payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRESENTATION (slider) */}
      <section id="featured" className="home-section">
        <div className="home-head">
          <div>
            <div className="h-eyebrow">Featured lineup</div>
            <h2 className="home-title">Top picks right now</h2>
            <p className="small" style={{ marginTop: 6 }}>
              Quick presentation to fill the homepage with real products and imagery. Tap any card to
              open the product.
            </p>
          </div>
          <Link className="btn" to="/catalog">
            Open catalog
          </Link>
        </div>

        {!featured.length ? (
          <div className="card card-pad" style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 900 }}>No products yet</div>
            <div className="small" style={{ marginTop: 8 }}>
              Add products in <code>src/data/products.js</code> and ensure images exist in{" "}
              <code>/public</code>.
            </div>
          </div>
        ) : (
          <div className="home-slider" role="region" aria-label="Featured products">
            {featured.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="slide card">
                <div className="slide-media">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  {p.badge ? (
                    <div className="slide-badge">
                      <span className="badge">{p.badge}</span>
                    </div>
                  ) : null}
                </div>

                <div className="slide-body">
                  <div className="small" style={{ opacity: 0.85 }}>
                    {categoryLabel(p.category)}
                  </div>
                  <div className="slide-name">{p.name}</div>

                  <div className="slide-price">
                    <div style={{ fontWeight: 900 }}>{usd(p.price)}</div>

                    {/* Trigger term ($/mo) => MUST connect to disclosure */}
                    <div className="small">
                      As low as{" "}
                      <span style={{ color: "var(--neon)" }}>${monthlyExample(p.price)}/mo</span> with
                      Affirm{" "}
                      <a href="#affirm-disclosure" className="small" style={{ opacity: 0.95 }}>
                        *
                      </a>
                    </div>
                  </div>

                  <div className="small" style={{ opacity: 0.9, marginTop: 8 }}>
                    {p.short}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* OUR STORE / ABOUT (PHOTOS + TEXT + CTA) */}
      <section id="store" className="home-section">
        <div className="home-head">
          <div>
            <div className="h-eyebrow">Our store</div>
            <h2 className="home-title">Real showroom. Real inventory. Same neon vibe.</h2>
            <p className="small" style={{ marginTop: 6, maxWidth: 820 }}>
              Not just an online catalog — we’re a physical shop too. Come check scooters in person,
              compare options, and get help choosing the right setup. Clean, fast online browsing —
              plus in-store support when you want it.
            </p>
          </div>

          <div className="store-cta">
            <Link className="btn btn-primary" to="/catalog">
              Browse catalog
            </Link>
            <Link className="btn" to="/contact">
              Contact / Visit
            </Link>
          </div>
        </div>

        <div className="store-wrap">
          {/* Left: image grid */}
          <div className="store-gallery" aria-label="Store photos">
            <figure className="store-photo store-photo--big">
              <img
                src="/img/fisic-store/fisic-store-1.jpeg"
                alt="Power Ride physical store entrance"
                loading="lazy"
              />
              <figcaption className="store-cap">
                <span className="store-tag">Showroom</span>
                <span>Walk in • Browse • Pick up</span>
              </figcaption>
            </figure>

            <figure className="store-photo">
              <img
                src="/img/fisic-store/fisic-store-2.jpeg"
                alt="Inside view of Power Ride store"
                loading="lazy"
              />
              <figcaption className="store-cap">
                <span className="store-tag">Inventory</span>
                <span>Scooters &amp; accessories</span>
              </figcaption>
            </figure>

            <figure className="store-photo">
              <img
                src="/img/fisic-store/fisic-store-3.jpeg"
                alt="Another inside view of Power Ride store"
                loading="lazy"
              />
              <figcaption className="store-cap">
                <span className="store-tag">Local</span>
                <span>Miami-ready setups</span>
              </figcaption>
            </figure>

            <figure className="store-photo store-photo--wide">
              <img
                src="/img/fisic-store/fisic-store-4.jpeg"
                alt="Store desk and wall branding"
                loading="lazy"
              />
              <figcaption className="store-cap">
                <span className="store-tag">Support</span>
                <span>Questions • guidance • checkout</span>
              </figcaption>
            </figure>
          </div>

          {/* Right: details panel */}
          <div className="card store-panel">
            <div className="store-panel-inner">
              <div className="store-kicker">Why it matters</div>
              <div className="store-title">
                A store that feels <span className="glow">premium</span> online and offline
              </div>

              <div className="store-list">
                <div className="store-li">
                  <div className="store-bullet" />
                  <div>
                    <div className="store-li-title">Hands-on help</div>
                    <div className="small">See models in person and get quick recommendations.</div>
                  </div>
                </div>

                <div className="store-li">
                  <div className="store-bullet" />
                  <div>
                    <div className="store-li-title">Pickup + support</div>
                    <div className="small">Prefer local pickup? We can guide the whole process.</div>
                  </div>
                </div>

                <div className="store-li">
                  <div className="store-bullet" />
                  <div>
                    <div className="store-li-title">Same clean experience</div>
                    <div className="small">Neon/glass design stays consistent across the site.</div>
                  </div>
                </div>
              </div>

              <div className="hr" />

              <div className="store-stats">
                <div className="store-stat">
                  <div className="store-num">4+</div>
                  <div className="small">Store photos</div>
                </div>
                <div className="store-stat">
                  <div className="store-num">Fast</div>
                  <div className="small">Mobile-first UI</div>
                </div>
                <div className="store-stat">
                  <div className="store-num">Clear</div>
                  <div className="small">Catalog + pricing</div>
                </div>
              </div>

              <div className="store-actions">
                <a className="btn" href="#support">
                  Support
                </a>
                <Link className="btn btn-primary" to="/catalog">
                  Shop now
                </Link>
              </div>

              <div className="store-note small">
                Tip: if you want a full “About” page later, we can reuse this block and expand it.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY DIFFERENT (unique blocks) */}
      <section className="home-section">
        <div className="home-head">
          <div>
            <div className="h-eyebrow">Built different</div>
            <h2 className="home-title">A homepage that doesn’t look like your other builds</h2>
            <p className="small" style={{ marginTop: 6 }}>
              Editorial layout, spotlight module, slider with snap, and a “spec chips” style. Same neon
              theme, but different structure.
            </p>
          </div>
        </div>

        <div className="home-grid3">
          <div className="card card-pad">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>1) Presentation-first</div>
            <div className="small">
              The slider showcases real products immediately. It fills space with visuals while staying
              lightweight.
            </div>
            <div className="hr" />
            <div className="small">Tip: keep featured = 6 for best mobile scroll.</div>
          </div>

          <div className="card card-pad">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>2) Clear purchase path</div>
            <div className="small">
              Home → Featured → Product → Add to cart → Checkout. It’s obvious what to do next.
            </div>
            <div className="hr" />
            <div className="small">CTAs are repeated at strategic points (not just once).</div>
          </div>

          <div className="card card-pad">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>3) Trust + compliance</div>
            <div className="small">
              Financing disclosure appears on URLs where financing is advertised. Keep it visible and
              consistent.
            </div>
            <div className="hr" />
            <div className="small">You already have the Legal page for deeper details.</div>
          </div>
        </div>
      </section>

      {/* MINI CATEGORY / PICKS (fills space) */}
      <section className="home-section" id="solar">
        <div className="home-head">
          <div>
            <div className="h-eyebrow">Quick picks</div>
            <h2 className="home-title">Choose your vibe</h2>
            <p className="small" style={{ marginTop: 6 }}>
              Simple blocks that look “editorial” (different from a normal homepage).
            </p>
          </div>
        </div>

        <div className="home-picks">
          <Pick title="Electric scooters" desc="Fast browsing, clean UI, quick checkout." cta="Shop scooters" to="/catalog" />
          <Pick title="Solar energy" desc="Browse power stations, panels, and batteries." cta="Open solar" to="/solar" />
          <Pick title="JBL speakers" desc="Portable audio and party power." cta="Browse audio" to="/catalog" />
        </div>
      </section>

      {/* DISCLOSURE / COMPLIANCE (Home advertises financing with $/mo) */}
      <section className="home-section">
        <AffirmDisclosure showExample />
      </section>

      {/* FINAL CTA */}
      <section className="home-section">
        <div className="card home-final">
          <div>
            <div className="h-eyebrow">Ready</div>
            <h2 className="home-title" style={{ marginTop: 10 }}>
              Browse the full catalog and build your cart
            </h2>
            <p className="small" style={{ marginTop: 8, maxWidth: 720 }}>
              This homepage is now filled with real products, unique blocks and layout, and strong CTAs.
              Next step is adding more products and refining copy per product.
            </p>

            <div className="home-cta" style={{ marginTop: 14 }}>
              <Link className="btn btn-primary" to="/catalog">
                Shop now
              </Link>
              <Link className="btn" to="/cart">
                Go to cart
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Pick({ title, desc, cta, to, asAnchor }) {
  if (asAnchor) {
    return (
      <a className="card card-pad pick" href={to}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
        <div className="small" style={{ marginTop: 8, opacity: 0.9 }}>
          {desc}
        </div>
        <div style={{ marginTop: 12 }}>
          <span className="btn">{cta}</span>
        </div>
      </a>
    );
  }

  return (
    <Link className="card card-pad pick" to={to}>
      <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
      <div className="small" style={{ marginTop: 8, opacity: 0.9 }}>
        {desc}
      </div>
      <div style={{ marginTop: 12 }}>
        <span className="btn">{cta}</span>
      </div>
    </Link>
  );
}
