import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLogin() {
  const { user, signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn({
      email: form.email.trim(),
      password: form.password,
    });

    if (error) {
      setError(error.message || "Login failed");
    }

    setLoading(false);
  }

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 28 }}>
      <div
        className="card card-pad"
        style={{ maxWidth: 520, margin: "0 auto" }}
      >
        <div className="h-eyebrow">Admin</div>
        <h2 style={{ marginTop: 10 }}>Login</h2>
        <p className="small" style={{ marginTop: 8, opacity: 0.9 }}>
          Sign in to manage products.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="admin@email.com"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            {error ? (
              <div
                style={{
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.12)",
                  background: "rgba(255,0,0,.08)",
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            ) : null}

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Enter admin"}
            </button>
          </div>
        </form>
      </div>
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