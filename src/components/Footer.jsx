import React from "react";

export default function Footer() {
  return (
    <footer className="footer" id="support">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 900 }}>Power Ride LLC</div>
            <div className="small">Electric scooters. Flexible financing with Affirm.</div>
          </div>

          <div className="small" style={{ maxWidth: 520 }}>
            <div style={{ marginBottom: 8, fontWeight: 700, color: "rgba(255,255,255,.78)" }}>
              Affirm disclosure
            </div>
            <div>
              Rates from 0–36% APR. Payment options through Affirm are subject to an eligibility check and are provided by these lending partners:
              affirm.com/lenders. Options depend on your purchase amount, and a down payment may be required. For licenses and disclosures, see
              affirm.com/licenses. Example: A $800 purchase could be split into 12 monthly payments (APR varies) or 4 interest-free payments every 2 weeks.
              Full terms: affirm.com/disclosures.
            </div>
          </div>
        </div>

        <div className="hr" />

        <div className="small">
          © {new Date().getFullYear()} Power Ride LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
