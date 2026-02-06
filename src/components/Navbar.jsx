import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container">
        <div className="nav-inner">
          <div className="nav-left">
            <Link to="/" className="brand" aria-label="Power Riders Home">
              <span className="brand-dot" />
              <span>Power Riders LLC</span>
            </Link>
          </div>

          <nav className="nav-links" aria-label="Main navigation">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link" to="/catalog">
              Catalog
            </NavLink>
            <NavLink className="nav-link" to="/legal">
              Financing & Legal
            </NavLink>
          </nav>

          <div className="nav-right">
            <a className="btn" href="#support" onClick={(e)=>{e.preventDefault(); window.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});}}>
              Contact
            </a>
            <Link className="btn btn-primary" to="/catalog">
              Shop Scooters
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
