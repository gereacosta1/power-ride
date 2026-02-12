// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import AffirmDisclosure from "./AffirmDisclosure.jsx";

export default function Footer() {
  return (
    <footer className="footer" id="support">
      <div className="container">
        <div className="surface" style={{ padding: 18, marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div style={{ minWidth: 220 }}>
              <div style={{ fontWeight: 900, fontSize: 16 }}>Power Ride LLC</div>
              <div className="small" style={{ marginTop: 6 }}>
                Electric scooters. Flexible financing with Affirm.
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 12,
                }}
              >
                <a className="btn" href="#support">
                  Support
                </a>

                <Link className="btn" to="/legal">
                  Policies
                </Link>

                <Link className="btn" to="/legal">
                  Warranty
                </Link>
              </div>
            </div>

            {/* Mantener 1 sola fuente de verdad para el disclosure */}
            <div style={{ maxWidth: 560, flex: "1 1 360px" }}>
              <AffirmDisclosure
                compact
                showExample={false}
                id="affirm-disclosure-footer"
              />
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
