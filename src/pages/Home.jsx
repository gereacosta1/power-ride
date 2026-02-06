import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-inner">
          <div>
            <span className="h-eyebrow">Dark • Neon • Minimal</span>
            <h1 className="h-title">
              Power <span className="glow">Riders</span> LLC
            </h1>
            <p className="h-sub">
              Electric scooters only. Clean catalog, fast checkout, and flexible financing with Affirm.
              This build is designed to look premium and convert.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" to="/catalog">
                Browse scooters
              </Link>
              <Link className="btn" to="/legal">
                Financing details
              </Link>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <span className="badge">Affirm financing</span>
              <span className="badge">Mobile-first</span>
              <span className="badge">Netlify hosting</span>
              <span className="badge">SEO basics</span>
            </div>
          </div>

          <div className="card card-pad">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Why this site works</div>
            <div className="small">
              Dark UI with neon accents improves contrast and focus on CTAs. Catalog is built for speed and clarity.
              Product pages include clear financing messaging and legal disclosures, reducing compliance risk.
            </div>

            <div className="hr" />

            <div className="small">
              <div style={{ fontWeight: 800, color: "rgba(255,255,255,.78)" }}>Next step</div>
              Replace products with the exact “Riders Miami” list, add real images, business phone/address, and set Affirm keys on Netlify.
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <div className="card card-pad">
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Financing disclosure (visible on site)</div>
          <div className="small">
            Rates from 0–36% APR. Payment options through Affirm are subject to an eligibility check and are provided by these lending partners:
            affirm.com/lenders. Options depend on your purchase amount, and a down payment may be required.
            For licenses and disclosures, see affirm.com/licenses. Full terms: affirm.com/disclosures.
          </div>
        </div>
      </section>
    </div>
  );
}
