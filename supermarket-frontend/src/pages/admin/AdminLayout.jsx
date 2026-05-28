import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const NAV = [
  {
    icon: "📊",
    label: "Dashboard",
    path: "/admin",
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    icon: "📦",
    label: "Inventory",
    path: "/admin/inventory",
    color: "#0891b2",
    bg: "#ecfeff",
  },
  {
    icon: "👥",
    label: "Users",
    path: "/admin/users",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: "🛒",
    label: "Sales",
    path: "/admin/sales",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: "⭐",
    label: "Membership",
    path: "/admin/membership",
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    icon: "📈",
    label: "Reports",
    path: "/admin/reports",
    color: "#db2777",
    bg: "#fdf2f8",
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .al-nav-item{display:flex;align-items:center;gap:12px;padding:11px 16px;border-radius:12px;text-decoration:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;color:#94a3b8;transition:all .2s;margin-bottom:4px;white-space:nowrap;overflow:hidden}
        .al-nav-item:hover{background:rgba(255,255,255,.08);color:#e2e8f0}
        .al-nav-item.active{color:#fff}
      `}</style>

      {/* SIDEBAR */}
      <aside
        style={{
          width: collapsed ? 72 : 240,
          background: "linear-gradient(180deg,#0f172a 0%,#1e293b 100%)",
          padding: "20px 12px",
          display: "flex",
          flexDirection: "column",
          transition: "width .3s",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            padding: "0 4px",
            marginBottom: 28,
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  background: "linear-gradient(135deg,#16a34a,#22c55e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                🌿
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontWeight: 800,
                    fontSize: 16,
                    color: "#f8fafc",
                    lineHeight: 1,
                  }}
                >
                  FreshMart
                </div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: 10,
                    color: "#64748b",
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  ADMIN
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,.07)",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {!collapsed && (
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#475569",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: "0 16px",
                marginBottom: 10,
              }}
            >
              Menu
            </div>
          )}
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`al-nav-item${active ? " active" : ""}`}
                style={
                  active
                    ? {
                        background: `linear-gradient(135deg,${item.color}33,${item.color}22)`,
                        color: item.color,
                        boxShadow: `inset 3px 0 0 ${item.color}`,
                        marginLeft: 0,
                      }
                    : {}
                }
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && (
                  <span
                    style={{
                      marginLeft: "auto",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to Store */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.07)",
            paddingTop: 14,
            marginTop: 14,
          }}
        >
          <Link to="/" className="al-nav-item" style={{ color: "#64748b" }}>
            <span style={{ fontSize: 18 }}>🏪</span>
            {!collapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflowY: "auto", minHeight: "100vh" }}>
        <Outlet />
      </main>
    </div>
  );
}
