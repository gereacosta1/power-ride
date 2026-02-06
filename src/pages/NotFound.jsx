import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: 18 }}>
      <div className="card card-pad">
        <div style={{ fontWeight: 900 }}>404</div>
        <div className="small" style={{ marginTop: 6 }}>Page not found.</div>
        <div style={{ marginTop: 12 }}>
          <Link className="btn btn-primary" to="/">Go home</Link>
        </div>
      </div>
    </div>
  );
}
