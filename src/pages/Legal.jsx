// src/pages/Legal.jsx
import React from "react";
import { Link } from "react-router-dom";
import AffirmDisclosure from "../components/AffirmDisclosure.jsx";

export default function Legal() {
  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div className="card card-pad legal-box">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <div className="h-eyebrow">Financing & Legal</div>
            <h2 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>Policies, disclosures, and store info</h2>
            <p className="small" style={{ marginTop: 8, maxWidth: 760 }}>
              This page is intentionally structured (not empty): it keeps financing language consistent,
              reduces disputes, and makes the store feel more trustworthy.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn" to="/catalog">Browse scooters</Link>
            <Link className="btn btn-primary" to="/contact">Contact</Link>
          </div>
        </div>

        <div className="hr" />

        {/* Main grid */}
        <div className="legal-grid">
          {/* Left: Financing + compliance */}
          <div className="card card-pad legal-box">
            <div style={{ fontWeight: 900, fontSize: 16 }}>Affirm disclosure</div>
            <p className="small" style={{ marginTop: 8 }}>
              Rates from 0–36% APR. Payment options through Affirm are subject to an eligibility check and are provided by these lending partners:
              affirm.com/lenders. Options depend on your purchase amount, and a down payment may be required.
              For licenses and disclosures, see affirm.com/licenses. Full terms: affirm.com/disclosures.
            </p>

            <div className="hr" />

            <div style={{ fontWeight: 900, marginBottom: 6 }}>Why it’s here</div>
            <ul className="small legal-list">
              <li>Financing language must appear on the same URLs where financing is promoted.</li>
              <li>Keeping disclosures consistent reduces compliance risk and customer confusion.</li>
              <li>Clear policies reduce chargebacks and “where is my order?” tickets.</li>
            </ul>

            <div className="hr" />

            {/* Uses your existing component, keeps compliance consistent */}
            <AffirmDisclosure />
          </div>

          {/* Right: Store policies (filled content) */}
          <div className="card card-pad legal-box">
            <div style={{ fontWeight: 900, fontSize: 16 }}>Store policies (template)</div>
            <p className="small" style={{ marginTop: 8 }}>
              Replace the bracket text with your real business details (address, phone, timeframe). This is a clean baseline.
            </p>

            <div className="hr" />

            <div style={{ display: "grid", gap: 12 }}>
              <PolicyBlock
                title="Shipping & delivery"
                bullets={[
                  "Processing time: [1–2 business days].",
                  "Delivery timeframe: [3–7 business days] depending on location.",
                  "Tracking: sent by email after shipment.",
                  "Shipping fees: shown at checkout (if applicable)."
                ]}
              />

              <PolicyBlock
                title="Returns"
                bullets={[
                  "Return window: [14–30 days] from delivery date.",
                  "Items must be unused and in original packaging.",
                  "Return shipping: [customer-paid / store-paid] depending on reason.",
                  "Refunds are processed to the original payment method after inspection."
                ]}
              />

              <PolicyBlock
                title="Warranty"
                bullets={[
                  "Warranty coverage: [12 months] for manufacturer defects.",
                  "Normal wear & tear is not covered.",
                  "To start a claim: contact support with order number + photos/video."
                ]}
              />

              <PolicyBlock
                title="Cancellations"
                bullets={[
                  "Orders can be cancelled before shipment.",
                  "Once shipped, use the return process."
                ]}
              />
            </div>
          </div>
        </div>

        <div className="hr" />

        {/* FAQ section (fills page, looks premium) */}
        <div>
          <div className="h-eyebrow">FAQ</div>
          <h3 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>Common questions</h3>

          <div className="faq">
            <div className="faq-item">
              <div className="faq-q">Do you offer financing on every product?</div>
              <div className="faq-a">
                Financing availability depends on eligibility and purchase details. If financing is shown on a product page,
                the disclosure applies on that same URL.
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-q">How do I track my order?</div>
              <div className="faq-a">
                After shipment, you’ll receive tracking by email. If you didn’t receive it, use the contact form with your order number.
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-q">What if my scooter arrives damaged?</div>
              <div className="faq-a">
                Contact support within [48 hours] with photos. We’ll help with a replacement/return depending on the case.
              </div>
            </div>
          </div>
        </div>

        <div className="hr" />

        {/* Bottom CTA */}
        <div className="card card-pad legal-box">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 900 }}>Need help?</div>
              <div className="small" style={{ marginTop: 6 }}>
                Questions about models, availability, or financing. Send a message and we’ll reply fast.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn" to="/catalog">Open catalog</Link>
              <Link className="btn btn-primary" to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicyBlock({ title, bullets }) {
  return (
    <div className="card card-pad legal-box">
      <div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>
      <ul className="small legal-list">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
