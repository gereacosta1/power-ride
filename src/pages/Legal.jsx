import React from "react";

export default function Legal() {
  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div className="card card-pad">
        <div className="h-eyebrow">Financing & Legal</div>
        <h2 style={{ margin: "10px 0 8", letterSpacing: "-.02em" }}>Affirm disclosure</h2>

        <div className="small">
          Rates from 0–36% APR. Payment options through Affirm are subject to an eligibility check and are provided by these lending partners:
          affirm.com/lenders. Options depend on your purchase amount, and a down payment may be required.
          For licenses and disclosures, see affirm.com/licenses. Full terms: affirm.com/disclosures.
        </div>

        <div className="hr" />

        <div style={{ fontWeight: 900, marginBottom: 6 }}>Policies</div>
        <div className="small">
          Add here your store policies (shipping, returns, warranty) when you have the business details. This page exists to keep the site compliant,
          reduce disputes, and improve trust.
        </div>
      </div>
    </div>
  );
}
