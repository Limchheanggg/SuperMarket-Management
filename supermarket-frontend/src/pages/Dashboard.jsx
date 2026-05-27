import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrders, getCustomerMembership } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.name || user?.email || "Customer";
  const [orders, setOrders] = useState([]);
  const [membership, setMembership] = useState(null);

  useEffect(() => {
    getOrders()
      .then((r) => setOrders(r.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.id) {
      getCustomerMembership(user.id)
        .then((r) => setMembership(r.data))
        .catch(() => {});
    }
  }, [user]);

  const totalSpent = orders.reduce(
    (s, o) => s + Number(o.total || o.Total_Amount || 0),
    0,
  );
  const pending = orders.filter(
    (o) => (o.status || "").toLowerCase() === "processing",
  ).length;
  const points = membership?.Points ?? 0;
  const tier = membership?.Tier ?? "Bronze";

  const tierColor = {
    Bronze: "#CD7F32",
    Silver: "#A8A9AD",
    Gold: "#FFD700",
    Platinum: "#00B2FF",
  };

  return (
    <div className="page-enter">
      <div
        style={{
          background: "#F2FCF3",
          padding: "14px 0",
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <div className="container">
          <span style={{ fontSize: 13 }}>
            Home › <strong>Dashboard</strong>
          </span>
        </div>
      </div>
      <div className="container" style={{ padding: "36px 20px" }}>
        <h2
          style={{
            fontFamily: "'Josefin Sans',sans-serif",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          My Dashboard
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            minHeight: "60vh",
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #e8e8e8",
          }}
        >
          {/* Sidebar */}
          <aside style={{ background: "#1a1a1a", padding: "28px 0" }}>
            <div
              style={{
                padding: "0 20px 24px",
                borderBottom: "1px solid #2a2a2a",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#00B207",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                {name[0].toUpperCase()}
              </div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                {name}
              </div>
              <div
                style={{
                  color: tierColor[tier] || "#888",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ⭐ {tier} Member
              </div>
            </div>
            {[
              ["🏠", "Dashboard", "/dashboard"],
              ["📦", "My Orders", "/orders"],
              ["❤️", "Wishlist", "/wishlist"],
              ["⚙️", "Settings", "/account"],
            ].map(([icon, label, to]) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "13px 20px",
                  color: "#aaa",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {icon} {label}
              </Link>
            ))}
          </aside>

          {/* Content */}
          <div style={{ padding: 28, background: "#f9f9f9" }}>
            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
                marginBottom: 24,
              }}
            >
              {[
                ["Orders", orders.length, "#00B207"],
                ["Pending", pending, "#FF8C00"],
                ["Points", points.toLocaleString(), "#3b82f6"],
                ["Spent", `$${totalSpent.toFixed(2)}`, "#EA4B48"],
              ].map(([l, v, c]) => (
                <div
                  key={l}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 20,
                    borderLeft: `4px solid ${c}`,
                  }}
                >
                  <div
                    style={{ fontSize: 12, color: "#7e7e7e", marginBottom: 6 }}
                  >
                    {l}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      fontFamily: "'Josefin Sans',sans-serif",
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>

            {/* Membership card */}
            {membership && (
              <div
                style={{
                  background: `linear-gradient(135deg, #1a1a1a, #2d4a1e)`,
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 24,
                  color: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>
                    Membership Tier
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      fontFamily: "'Josefin Sans',sans-serif",
                      color: tierColor[tier],
                    }}
                  >
                    {tier}
                  </div>
                  <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>
                    Total Spent:{" "}
                    <strong style={{ color: "#fff" }}>
                      ${membership.Total_Spent?.toFixed(2)}
                    </strong>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>
                    Loyalty Points
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#00B207" }}
                  >
                    {points.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>
                    1 pt = $0.01 discount
                  </div>
                </div>
              </div>
            )}

            {/* Recent Orders */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                border: "1px solid #e8e8e8",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 14,
                }}
              >
                Recent Orders
              </h3>
              {orders.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px 20px",
                    color: "#7e7e7e",
                  }}
                >
                  <div style={{ fontSize: 40 }}>📦</div>
                  <p style={{ marginTop: 10 }}>No orders yet</p>
                  <Link
                    to="/shop"
                    className="btn btn-primary"
                    style={{ marginTop: 14, display: "inline-flex" }}
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.slice(0, 5).map((o, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid #f5f5f5",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "#00B207", fontWeight: 700 }}>
                      {o.id || o.Sale_ID}
                    </span>
                    <span style={{ color: "#7e7e7e" }}>
                      {o.date || o.Sale_Date}
                    </span>
                    <span
                      className={`status status-${(o.status || "pending").toLowerCase()}`}
                    >
                      {o.status || "Pending"}
                    </span>
                    <strong>
                      ${Number(o.total || o.Total_Amount || 0).toFixed(2)}
                    </strong>
                  </div>
                ))
              )}
              {orders.length > 0 && (
                <Link
                  to="/orders"
                  style={{
                    color: "#00B207",
                    fontSize: 13,
                    fontWeight: 700,
                    marginTop: 10,
                    display: "block",
                  }}
                >
                  View all →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
