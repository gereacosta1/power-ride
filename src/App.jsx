import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Legal from "./pages/Legal.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
