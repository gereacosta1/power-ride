// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const cart = useCart();
  const { pathname } = useLocation();

  const linkClass = ({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`;

  return (
    <header className="nav">
      <div className="container">
        <div className="nav-inner">
          <div className="nav-left">
            <Link to="/" className="brand" aria-label="Power Ride LLC home">
              <span className="brand-dot" />
              <span>Power Ride LLC</span>
            </Link>
          </div>

          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            <NavLink to="/catalog" className={linkClass}>
              Catalog
            </NavLink>
            <NavLink to="/legal" className={linkClass}>
              Financing &amp; Legal
            </NavLink>
          </nav>

          <div className="nav-right">
            <Link
              className="btn"
              to="/cart"
              aria-current={pathname === "/cart" ? "page" : undefined}
              style={{ position: "relative" }}
            >
              Cart
              {cart.count > 0 && <CartBadge count={cart.count} />}
            </Link>

            <Link className="btn" to="/contact">
              Contact
            </Link>

            <Link className="btn btn-primary" to="/catalog">
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function CartBadge({ count }) {
  return (
    <span
      style={{
        position: "absolute",
        top: -8,
        right: -8,
        minWidth: 20,
        height: 20,
        borderRadius: 999,
        padding: "0 6px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 900,
        background: "var(--neon)",
        color: "#06150d",
        border: "1px solid rgba(0,0,0,.25)",
        lineHeight: 1,
      }}
    >
      {count}
    </span>
  );
}
