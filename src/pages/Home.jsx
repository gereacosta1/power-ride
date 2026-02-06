// src/pages/Home.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products.js";
import { usd } from "../utils/money.js";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";

export default function Home() {
  const featured = useMemo(() => products.slice(0, 6), [products]);
  const spotlight = useMemo(() => products[0], [products]);

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
              Electric scooters only. Clean catalog, fast browsing, and flexible financing messaging.
              Built to look premium, load fast, and convert.
            </p>

            <div className="home-cta">
              <Link className="btn btn-primary" to="/catalog">
                Browse scooters
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
                  {spotlight?.name || "Featured scooter"}
                </div>
                <div className="small" style={{ marginTop: 6, opacity: 0.9 }}>
                  {spotlight?.short || "Popular pick — clean look and strong value."}
                </div>
              </div>

              <div className="spot-price">
                <div className="small" style={{ opacity: 0.85 }}>From</div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>
                  {spotlight ? usd(spotlight.price) : "$—"}
                </div>
                {spotlight?.price ? (
                  <div className="small">
                    <span style={{ color: "var(--neon)" }}>
                      ${(spotlight.price / 12).toFixed(2)}/mo
                    </span>{" "}
                    example
                  </div>
                ) : null}
              </div>
            </div>

            <div className="hr" />

            <div className="spot-media">
              {spotlight?.image ? (
                <img
                  src={spotlight.image}
                  alt={spotlight.name}
                  className="spot-img"
                  loading="lazy"
                />
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
            <h2 className="home-title">Top scooters right now</h2>
            <p className="small" style={{ marginTop: 6 }}>
              Quick presentation to fill the homepage with real products and imagery.
              Tap any card to open the product.
            </p>
          </div>
          <Link className="btn" to="/catalog">Open catalog</Link>
        </div>

        {!featured.length ? (
          <div className="card card-pad" style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 900 }}>No products yet</div>
            <div className="small" style={{ marginTop: 8 }}>
              Add products in <code>src/data/products.js</code> and ensure images exist in <code>/public</code>.
            </div>
          </div>
        ) : (
          <div className="home-slider" role="region" aria-label="Featured scooters">
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
                  <div className="small" style={{ opacity: 0.85 }}>{p.category || "Scooter"}</div>
                  <div className="slide-name">{p.name}</div>

                  <div className="slide-price">
                    <div style={{ fontWeight: 900 }}>{usd(p.price)}</div>
                    <div className="small">
                      <span style={{ color: "var(--neon)" }}>${(p.price / 12).toFixed(2)}/mo</span>{" "}
                      example
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

      {/* WHY DIFFERENT (unique blocks) */}
      <section className="home-section">
        <div className="home-head">
          <div>
            <div className="h-eyebrow">Built different</div>
            <h2 className="home-title">A homepage that doesn’t look like your other builds</h2>
            <p className="small" style={{ marginTop: 6 }}>
              Editorial layout, spotlight module, slider with snap, and a “spec chips” style.
              Same neon theme, but different structure.
            </p>
          </div>
        </div>

        <div className="home-grid3">
          <div className="card card-pad">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>1) Presentation-first</div>
            <div className="small">
              The slider showcases real scooters immediately. It fills space with product visuals while staying lightweight.
            </div>
            <div className="hr" />
            <div className="small">
              Tip: keep featured = 6 for best mobile scroll.
            </div>
          </div>

          <div className="card card-pad">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>2) Clear purchase path</div>
            <div className="small">
              Home → Featured → Product → Add to cart → Checkout. It’s obvious what to do next.
            </div>
            <div className="hr" />
            <div className="small">
              CTAs are repeated at strategic points (not just once).
            </div>
          </div>

          <div className="card card-pad">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>3) Trust + compliance</div>
            <div className="small">
              Financing disclosure appears on URLs where financing is advertised. Keep it visible and consistent.
            </div>
            <div className="hr" />
            <div className="small">
              You already have the Legal page for deeper details.
            </div>
          </div>
        </div>
      </section>

      {/* MINI CATEGORY / PICKS (fills space) */}
      <section className="home-section">
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
          <Pick
            title="Daily commute"
            desc="Lightweight, clean design, quick browse."
            cta="See scooters"
            to="/catalog"
          />
          <Pick
            title="Performance"
            desc="Higher price range, higher spec feel."
            cta="View featured"
            to="#featured"
            asAnchor
          />
          <Pick
            title="Financing"
            desc="Clear disclosure + legal page."
            cta="Read details"
            to="/legal"
          />
        </div>
      </section>

      {/* DISCLOSURE / COMPLIANCE (Home also advertises financing) */}
      <section className="home-section">
        <AffirmDisclosure />
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
              This homepage is now “filled” with real scooters, unique blocks and layout, and strong CTAs.
              Next step is adding more products and refining copy per scooter.
            </p>

            <div className="home-cta" style={{ marginTop: 14 }}>
              <Link className="btn btn-primary" to="/catalog">Shop Scooters</Link>
              <Link className="btn" to="/cart">Go to cart</Link>
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
        <div className="small" style={{ marginTop: 8, opacity: 0.9 }}>{desc}</div>
        <div style={{ marginTop: 12 }}>
          <span className="btn">{cta}</span>
        </div>
      </a>
    );
  }

  return (
    <Link className="card card-pad pick" to={to}>
      <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
      <div className="small" style={{ marginTop: 8, opacity: 0.9 }}>{desc}</div>
      <div style={{ marginTop: 12 }}>
        <span className="btn">{cta}</span>
      </div>
    </Link>
  );
}
