// src/pages/Contact.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [status, setStatus] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setStatus("Form ready. If you want it to send emails, we can connect it to Netlify Forms.");
  }

  return (
    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
      <div className="card card-pad">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <div className="h-eyebrow">Contact</div>
            <h2 style={{ margin: "10px 0 0", letterSpacing: "-.02em" }}>Talk to Power Ride</h2>
            <p className="small" style={{ marginTop: 8 }}>
              Questions about a scooter, availability, or financing? Send us a message.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn" to="/catalog">Browse scooters</Link>
            <Link className="btn btn-primary" to="/legal">Financing details</Link>
          </div>
        </div>

        <div className="hr" />

        <form onSubmit={onSubmit} className="contact-form">
          <div className="field">
            <label className="small" htmlFor="name">Name</label>
            <input id="name" className="input input-wide" placeholder="Your name" autoComplete="name" required />
          </div>

          <div className="field">
            <label className="small" htmlFor="email">Email</label>
            <input id="email" className="input input-wide" placeholder="you@email.com" autoComplete="email" type="email" required />
          </div>

          <div className="field">
            <label className="small" htmlFor="model">Scooter model (optional)</label>
            <input id="model" className="input input-wide" placeholder="E2 PLUS II / F3 / Freego..." />
          </div>

          <div className="field field-full">
            <label className="small" htmlFor="msg">Message</label>
            <textarea id="msg" className="input input-wide" rows="6" placeholder="Tell us what you need..." required />
          </div>

          {status && (
            <div className="card" style={{ padding: 12, borderColor: "rgba(38,255,106,.30)" }}>
              <div style={{ fontWeight: 900 }}>Ready</div>
              <div className="small" style={{ marginTop: 6 }}>{status}</div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary" type="submit">Send message</button>
            <Link className="btn" to="/">Back home</Link>
          </div>

          <div className="small" style={{ opacity: 0.8 }}>
            Next step: enable Netlify Forms to receive messages without backend.
          </div>
        </form>
      </div>
    </div>
  );
}
