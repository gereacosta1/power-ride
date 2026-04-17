// src/components/AffirmDisclosure.jsx
import React from "react";

export default function AffirmDisclosure({
  compact = false,
  showExample = true,
  id = "affirm-disclosure"
}) {
  const fullDisclosure = (
    <>
      Rates from 0–36% APR. Payment options through Affirm are subject to an
      eligibility check and are provided by these lending partners:{" "}
      <a
        href="https://www.affirm.com/lenders"
        target="_blank"
        rel="noreferrer"
      >
        affirm.com/lenders
      </a>
      . Options depend on your purchase amount, and a down payment may be
      required. CA residents: Loans by Affirm Loan Services, LLC are made or
      arranged pursuant to a California Financing Law license. For licenses and
      disclosures, see{" "}
      <a
        href="https://www.affirm.com/licenses"
        target="_blank"
        rel="noreferrer"
      >
        affirm.com/licenses
      </a>
      .
    </>
  );

  const example = (
    <>
      For example, a $800 purchase could be split into 12 monthly payments of
      $72.21 at 15% APR, or 4 interest-free payments of $200 every 2 weeks. Full
      terms:{" "}
      <a
        href="https://www.affirm.com/disclosures"
        target="_blank"
        rel="noreferrer"
      >
        affirm.com/disclosures
      </a>
      .
    </>
  );

  return (
    <div
      id={id}
      className="card card-pad"
      style={{
        borderColor: "rgba(38,255,106,.22)",
        padding: compact ? 14 : undefined
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
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
          aria-label="View full Affirm terms"
        >
          View full terms
        </a>
      </div>

      <div className="hr" />

      <div className="small" style={{ lineHeight: 1.45 }}>
        <span style={{ fontWeight: 800 }}>* </span>
        {fullDisclosure}

        {showExample && (
          <>
            <br />
            <br />
            {example}
          </>
        )}
      </div>
    </div>
  );
}