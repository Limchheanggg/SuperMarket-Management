import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { icon: "📊", label: "Dashboard", path: "/admin" },
  { icon: "📦", label: "Inventory", path: "/admin/inventory" },
  { icon: "👥", label: "Users", path: "/admin/users" },
  { icon: "🛒", label: "Sales", path: "/admin/sales" },
  { icon: "⭐", label: "Membership", path: "/admin/membership" },
  { icon: "📈", label: "Reports", path: "/admin/reports" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          background: "#1a1a1a",
          padding: "28px 0",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "0 20px 24px",
            borderBottom: "1px solid #2a2a2a",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              color: "#00B207",
              fontFamily: "'Josefin Sans',sans-serif",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            🌿 FreshMart
          </div>
          <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
            Admin Panel
          </div>
        </div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 20px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.15s",
              background:
                location.pathname === item.path ? "#00B207" : "transparent",
              color: location.pathname === item.path ? "#fff" : "#aaa",
            }}
          >
            {item.icon} {item.label}
          </Link>
        ))}
        <div style={{ position: "absolute", bottom: 20, left: 20 }}>
          <Link
            to="/"
            style={{ color: "#888", fontSize: 13, textDecoration: "none" }}
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main style={{ overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
