// src/components/AffirmDisclosure.jsx
import React from "react";

export default function AffirmDisclosure({ compact = false, id = "affirm-terms" }) {
  // Texto base (lending partners + CA residents + licenses)
  const fullDisclosure =
    "Rates from 0–36% APR. Payment options through Affirm are subject to an eligibility check and are provided by these lending partners: affirm.com/lenders. Options depend on your purchase amount, and a down payment may be required. CA residents: Loans by Affirm Loan Services, LLC are made or arranged pursuant to a California Financing Law license. For licenses and disclosures, see affirm.com/licenses.";

  // Representative example (TILA: term + APR)
  const example =
    "For example, a $800 purchase could be split into 12 monthly payments of $72.21 at 15% APR, or 4 interest-free payments of $200 every 2 weeks. Full terms: affirm.com/disclosures.";

  return (
    <div
      id={id}
      className="card card-pad"
      style={{
        borderColor: "rgba(38,255,106,.22)",
        padding: compact ? 14 : 18
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div className="h-eyebrow">Affirm disclosure</div>
          <div style={{ fontWeight: 900, marginTop: 8 }}>
            Financing &amp; representative example (TILA)
          </div>
        </div>

        <a
          className="btn"
          href="https://www.affirm.com/disclosures"
          target="_blank"
          rel="noreferrer"
          style={{ height: 42 }}
        >
          View full terms
        </a>
      </div>

      <div className="hr" />

      <div className="small">
        {fullDisclosure}
        <br />
        <br />
        {example}
      </div>
    </div>
  );
}
