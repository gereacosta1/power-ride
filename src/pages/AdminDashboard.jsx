import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import { usd } from "../utils/money.js";

const emptyForm = {
  name: "",
  category: "scooter",
  price: "",
  image: "",
  short: "",
  badge: "",
  inStock: true,
  type: "single",
  specs: "",
  includes: "",
};

const categoryOptions = [
  { value: "all", label: "All categories" },
  { value: "scooter", label: "Scooter" },
  { value: "audio", label: "Audio" },
  { value: "solar", label: "Solar" },
  { value: "bicycle", label: "Bicycle" },
  { value: "motorcycle", label: "Motorcycle" },
];

function slugify(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [storeSettings, setStoreSettings] = useState({
    id: null,
    paypal_enabled: false,
    paypal_client_id: "",
    paypal_hosted_button_id: "",
    paypal_pay_later_enabled: true,
    paypal_show_on_product_page: true,
  });

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  useEffect(() => {
    loadProducts();
    loadStoreSettings();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadProducts error:", error);
      setError(error.message || "Failed to load products");
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  async function loadStoreSettings() {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("loadStoreSettings error:", error);
      return;
    }

    if (data) {
      setStoreSettings({
        id: data.id,
        paypal_enabled: Boolean(data.paypal_enabled),
        paypal_client_id: data.paypal_client_id || "",
        paypal_hosted_button_id: data.paypal_hosted_button_id || "",
        paypal_pay_later_enabled: Boolean(data.paypal_pay_later_enabled),
        paypal_show_on_product_page: Boolean(data.paypal_show_on_product_page),
      });
    }
  }

  async function saveStoreSettings(e) {
    e.preventDefault();
    setSettingsSaving(true);
    setError("");
    setMessage("");

    if (!storeSettings.id) {
      setError("Store settings row not found");
      setSettingsSaving(false);
      return;
    }

    const { error } = await supabase
      .from("store_settings")
      .update({
        paypal_enabled: storeSettings.paypal_enabled,
        paypal_client_id: storeSettings.paypal_client_id.trim(),
        paypal_hosted_button_id: storeSettings.paypal_hosted_button_id.trim(),
        paypal_pay_later_enabled: storeSettings.paypal_pay_later_enabled,
        paypal_show_on_product_page: storeSettings.paypal_show_on_product_page,
      })
      .eq("id", storeSettings.id);

    if (error) {
      console.error("saveStoreSettings error:", error);
      setError(error.message || "Failed to save store settings");
      setSettingsSaving(false);
      return;
    }

    setMessage("PayPal settings saved successfully");
    setSettingsSaving(false);
  }

  function clearFormOnly() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
  }

  function fillForm(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category: product.category || "scooter",
      price: product.price ?? "",
      image: product.image || "",
      short: product.short || "",
      badge: product.badge || "",
      inStock: Boolean(product.in_stock),
      type: product.type || "single",
      specs: product.specs || "",
      includes: product.includes || "",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.name),
      category: form.category.trim(),
      price: Number(form.price || 0),
      image: form.image.trim(),
      short: form.short.trim(),
      badge: form.badge.trim(),
      in_stock: Boolean(form.inStock),
      type: form.type.trim(),
      specs: form.specs.trim(),
      includes: form.includes.trim(),
    };

    if (!payload.name) {
      setError("Product name is required");
      setSaving(false);
      return;
    }

    if (!payload.slug) {
      setError("Slug could not be generated");
      setSaving(false);
      return;
    }

    let response;

    if (isEditing) {
      response = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId)
        .select();
    } else {
      response = await supabase.from("products").insert(payload).select();
    }

    if (response.error) {
      console.error("save product error:", response.error);
      setError(response.error.message || "Failed to save product");
      setSaving(false);
      return;
    }

    await loadProducts();
    clearFormOnly();
    setMessage(
      isEditing
        ? "Product updated successfully"
        : "Product created successfully"
    );
    setSaving(false);
  }

  async function handleDelete(id) {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    setError("");
    setMessage("");

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("delete product error:", error);
      setError(error.message || "Failed to delete product");
      return;
    }

    if (editingId === id) {
      clearFormOnly();
    }

    await loadProducts();
    setMessage("Product deleted successfully");
  }

  async function handleLogout() {
    await signOut();
  }

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !q ||
        String(product.name || "").toLowerCase().includes(q) ||
        String(product.slug || "").toLowerCase().includes(q) ||
        String(product.short || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 28 }}>
      <div className="card card-pad">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div className="h-eyebrow">Admin panel</div>
            <h2 style={{ marginTop: 10 }}>
              {isEditing ? "Edit Product" : "Products Dashboard"}
            </h2>
            <p className="small" style={{ marginTop: 8, opacity: 0.9 }}>
              Logged in as {user?.email || "admin"}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {isEditing ? (
              <button className="btn" type="button" onClick={clearFormOnly}>
                New product
              </button>
            ) : null}

            <button className="btn" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        {(error || message) && (
          <div style={{ marginTop: 16 }}>
            {error ? <AlertBox type="error">{error}</AlertBox> : null}
            {message ? (
              <div style={{ marginTop: error ? 10 : 0 }}>
                <AlertBox type="success">{message}</AlertBox>
              </div>
            ) : null}
          </div>
        )}

        <div className="card card-pad" style={{ marginTop: 20 }}>
          <div className="h-eyebrow">Payments</div>
          <h3 style={{ marginTop: 10 }}>PayPal settings</h3>

          <form onSubmit={saveStoreSettings} style={{ marginTop: 16 }}>
            <div style={{ display: "grid", gap: 12 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={storeSettings.paypal_enabled}
                  onChange={(e) =>
                    setStoreSettings((prev) => ({
                      ...prev,
                      paypal_enabled: e.target.checked,
                    }))
                  }
                />
                Enable PayPal
              </label>

              <Field label="PayPal Client ID">
                <input
                  style={inputStyle}
                  value={storeSettings.paypal_client_id}
                  onChange={(e) =>
                    setStoreSettings((prev) => ({
                      ...prev,
                      paypal_client_id: e.target.value,
                    }))
                  }
                  placeholder="PayPal client id"
                />
              </Field>

              <Field label="PayPal Hosted Button ID">
                <input
                  style={inputStyle}
                  value={storeSettings.paypal_hosted_button_id}
                  onChange={(e) =>
                    setStoreSettings((prev) => ({
                      ...prev,
                      paypal_hosted_button_id: e.target.value,
                    }))
                  }
                  placeholder="Hosted button id"
                />
              </Field>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={storeSettings.paypal_pay_later_enabled}
                  onChange={(e) =>
                    setStoreSettings((prev) => ({
                      ...prev,
                      paypal_pay_later_enabled: e.target.checked,
                    }))
                  }
                />
                Enable Pay Later
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={storeSettings.paypal_show_on_product_page}
                  onChange={(e) =>
                    setStoreSettings((prev) => ({
                      ...prev,
                      paypal_show_on_product_page: e.target.checked,
                    }))
                  }
                />
                Show on product page
              </label>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={settingsSaving}
                >
                  {settingsSaving ? "Saving..." : "Save PayPal settings"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 430px) minmax(320px, 1fr)",
            gap: 18,
            marginTop: 20,
            alignItems: "start",
          }}
        >
          <div className="card card-pad">
            <div className="h-eyebrow">
              {isEditing ? "Edit product" : "New product"}
            </div>
            <h3 style={{ marginTop: 10 }}>
              {isEditing ? "Update product" : "Create product"}
            </h3>

            <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
              <div style={{ display: "grid", gap: 12 }}>
                <Field label="Name">
                  <input
                    style={inputStyle}
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Product name"
                    required
                  />
                </Field>

                <Field label="Category">
                  <select
                    style={inputStyle}
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                  >
                    {categoryOptions
                      .filter((item) => item.value !== "all")
                      .map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.value}
                        </option>
                      ))}
                  </select>
                </Field>

                <Field label="Price">
                  <input
                    style={inputStyle}
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="0"
                  />
                </Field>

                <Field label="Image URL">
                  <input
                    style={inputStyle}
                    value={form.image}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, image: e.target.value }))
                    }
                    placeholder="/img/product.jpg"
                  />
                </Field>

                {form.image ? (
                  <div
                    className="card"
                    style={{
                      padding: 12,
                      background: "rgba(255,255,255,.03)",
                    }}
                  >
                    <div
                      className="small"
                      style={{ marginBottom: 8, opacity: 0.85, fontWeight: 700 }}
                    >
                      Image preview
                    </div>
                    <img
                      src={form.image}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      style={{
                        width: "100%",
                        maxHeight: 220,
                        objectFit: "contain",
                        borderRadius: 12,
                        background: "rgba(255,255,255,.02)",
                      }}
                    />
                  </div>
                ) : null}

                <Field label="Short description">
                  <textarea
                    style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                    value={form.short}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, short: e.target.value }))
                    }
                    placeholder="Short description"
                  />
                </Field>

                <Field label="Badge">
                  <input
                    style={inputStyle}
                    value={form.badge}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, badge: e.target.value }))
                    }
                    placeholder="New / Hot / Featured"
                  />
                </Field>

                <Field label="Type">
                  <select
                    style={inputStyle}
                    value={form.type}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, type: e.target.value }))
                    }
                  >
                    <option value="single">single</option>
                    <option value="kit">kit</option>
                  </select>
                </Field>

                <Field label="Specs">
                  <input
                    style={inputStyle}
                    value={form.specs}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, specs: e.target.value }))
                    }
                    placeholder="Bluetooth, 120km, 5kW"
                  />
                </Field>

                <Field label="Includes">
                  <input
                    style={inputStyle}
                    value={form.includes}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, includes: e.target.value }))
                    }
                    placeholder="Solar panel, Battery, Inverter"
                  />
                </Field>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    marginTop: 4,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        inStock: e.target.checked,
                      }))
                    }
                  />
                  In stock
                </label>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={saving}
                  >
                    {saving
                      ? isEditing
                        ? "Updating..."
                        : "Creating..."
                      : isEditing
                      ? "Update product"
                      : "Create product"}
                  </button>

                  {isEditing ? (
                    <button className="btn" type="button" onClick={clearFormOnly}>
                      Cancel edit
                    </button>
                  ) : null}
                </div>
              </div>
            </form>
          </div>

          <div className="card card-pad">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div>
                <div className="h-eyebrow">Products</div>
                <h3 style={{ marginTop: 10 }}>Current list</h3>
              </div>

              <div className="badge" style={{ padding: "8px 12px" }}>
                {filteredProducts.length} shown
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 200px",
                gap: 10,
                marginTop: 16,
              }}
            >
              <input
                style={inputStyle}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, slug or description"
              />

              <select
                style={inputStyle}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categoryOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div style={{ marginTop: 14 }} className="card card-pad">
                Loading products...
              </div>
            ) : !filteredProducts.length ? (
              <div style={{ marginTop: 14 }} className="card card-pad">
                No matching products.
              </div>
            ) : (
              <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="card card-pad"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "84px 1fr auto",
                      gap: 14,
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        width: 84,
                        height: 84,
                        borderRadius: 14,
                        overflow: "hidden",
                        background: "rgba(255,255,255,.03)",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      ) : (
                        <span className="small" style={{ opacity: 0.7 }}>
                          No image
                        </span>
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 18,
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        {product.name}
                        {product.badge ? (
                          <span className="badge">{product.badge}</span>
                        ) : null}
                      </div>

                      <div className="small" style={{ marginTop: 6, opacity: 0.85 }}>
                        Category: {product.category} · Price: {usd(product.price)}
                      </div>

                      <div className="small" style={{ marginTop: 6, opacity: 0.85 }}>
                        Slug: {product.slug}
                      </div>

                      {product.short ? (
                        <div className="small" style={{ marginTop: 8, opacity: 0.92 }}>
                          {product.short}
                        </div>
                      ) : null}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn"
                        type="button"
                        onClick={() => fillForm(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn"
                        type="button"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function AlertBox({ type, children }) {
  const isError = type === "error";

  return (
    <div
      style={{
        padding: 10,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,.12)",
        background: isError ? "rgba(255,0,0,.08)" : "rgba(0,255,120,.08)",
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(255,255,255,.04)",
  color: "inherit",
  outline: "none",
};