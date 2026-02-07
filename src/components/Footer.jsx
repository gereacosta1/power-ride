import React from "react";

export default function Footer() {
  return (
    <footer className="footer" id="support">
      <div className="container">
        <div className="surface" style={{ padding: 18, marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
            <div style={{ minWidth: 220 }}>
              <div style={{ fontWeight: 900, fontSize: 16 }}>Power Ride LLC</div>
              <div className="small" style={{ marginTop: 6 }}>
                Electric scooters. Flexible financing with Affirm.
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                <a className="btn" href="#support">Support</a>
                <a className="btn" href="#support">Policies</a>
                <a className="btn" href="#support">Warranty</a>
              </div>
            </div>

            <div className="card card-pad" style={{ maxWidth: 560, background: "rgba(255,255,255,.03)" }}>
              <div style={{ marginBottom: 8, fontWeight: 800, color: "rgba(255,255,255,.80)" }}>
                Affirm disclosure
              </div>
              <div className="small">
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
      </div>
    </footer>
  );
}
