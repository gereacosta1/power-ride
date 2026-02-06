// src/App.jsx
import React, { useMemo } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Legal from "./pages/Legal.jsx";
import Cart from "./pages/Cart.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const i18n = useMemo(() => ({}), []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar i18n={i18n} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home i18n={i18n} />} />
          <Route path="/catalog" element={<Catalog i18n={i18n} />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal i18n={i18n} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer i18n={i18n} />
    </div>
  );
}
