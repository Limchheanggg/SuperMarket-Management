import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const TIER_THRESHOLDS = { Bronze: 0, Silver: 50, Gold: 200, Platinum: 500 };
const TIER_NEXT = {
  Bronze: "Silver",
  Silver: "Gold",
  Gold: "Platinum",
  Platinum: null,
};
const TIER_COLORS = {
  Bronze: "#ea580c",
  Silver: "#64748b",
  Gold: "#ca8a04",
  Platinum: "#7c3aed",
};
const TIER_ICONS = { Bronze: "🥉", Silver: "🥈", Gold: "🥇", Platinum: "💎" };

function getTier(spent) {
  if (spent >= 500) return "Platinum";
  if (spent >= 200) return "Gold";
  if (spent >= 50) return "Silver";
  return "Bronze";
}

export default function Dashboard() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({
    orders: 0,
    spent: 0,
    points: 0,
    tier: "Bronze",
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const name = user?.full_name || user?.name || user?.email || "Customer";

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    // Sales
    let salesPoints = 0;
    let salesTier = "Bronze";
    try {
      const salesRes = await API.get("/api/sales/").catch(() => ({ data: [] }));
      const allSales = salesRes.data || [];
      const totalOrders = allSales.length;
      const totalSpent = allSales.reduce(
        (s, o) => s + Number(o.Total_Amount || 0),
        0,
      );
      salesPoints = Math.floor(totalSpent);
      salesTier = getTier(totalSpent);
      setRecentOrders(allSales.slice(0, 5));
      setStats((prev) => ({ ...prev, orders: totalOrders, spent: totalSpent }));
    } catch {}

    // Inventory
    try {
      const invRes = await API.get("/api/inventory/").catch(() => ({
        data: [],
      }));
      setInventory(invRes.data || []);
    } catch {}

    // Membership — look up by User_ID (reliable) instead of fuzzy name matching
    try {
      const userId = user?.id;
      if (userId) {
        const memRes = await API.get(
          `/api/membership/me?user_id=${userId}`,
        ).catch(() => ({ data: null }));
        const myMembership = memRes.data;

        if (myMembership && (myMembership.points > 0 || myMembership.tier)) {
          setStats((prev) => ({
            ...prev,
            points: myMembership.points || 0,
            tier: myMembership.tier || getTier(prev.spent),
            spent:
              myMembership.total_spent > 0
                ? myMembership.total_spent
                : prev.spent,
          }));
        } else {
          setStats((prev) => ({
            ...prev,
            points: salesPoints,
            tier: salesTier,
          }));
        }
      } else {
        setStats((prev) => ({ ...prev, points: salesPoints, tier: salesTier }));
      }
    } catch {
      setStats((prev) => ({ ...prev, points: salesPoints, tier: salesTier }));
    }

    setLoading(false);
  };

  const lowStock = inventory.filter((i) => i.Status !== "In Stock");
  const tierColor = TIER_COLORS[stats.tier] || "#ea580c";
  const tierIcon = TIER_ICONS[stats.tier] || "🥉";
  const nextTier = TIER_NEXT[stats.tier];
  const nextVal = nextTier ? TIER_THRESHOLDS[nextTier] : 500;
  const currVal = TIER_THRESHOLDS[stats.tier];
  const progress = nextTier
    ? Math.min(100, ((stats.spent - currVal) / (nextVal - currVal)) * 100)
    : 100;

  const SIDEBAR_LINKS = [
    ["🏠", "Dashboard", "/dashboard"],
    ["📦", "My Orders", "/orders"],
    ["❤️", "Wishlist", "/wishlist"],
    ["⚙️", "Settings", "/account"],
  ];

  return (
    <div className="page-enter">
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 0",
        }}
      >
        <div className="container">
          <span
            style={{
              fontSize: 13,
              color: "#6b7280",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            🏠 Home › <strong style={{ color: "#111827" }}>My Dashboard</strong>
          </span>
        </div>
      </div>

      <div className="container" style={{ padding: "36px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            minHeight: "70vh",
            background: "#fff",
            borderRadius: 18,
            overflow: "hidden",
            border: "1.5px solid #e5e7eb",
            boxShadow: "0 4px 20px rgba(0,0,0,.06)",
          }}
        >
          <aside
            style={{
              background: "linear-gradient(180deg,#0f172a,#1e293b)",
              padding: "28px 12px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "0 8px 24px",
                borderBottom: "1px solid rgba(255,255,255,.07)",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 15,
                  background: `linear-gradient(135deg,${tierColor},${tierColor}88)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                {name[0]?.toUpperCase()}
              </div>
              <div
                style={{
                  color: "#f1f5f9",
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
              >
                {name}
              </div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
                {["admin", "manager"].includes(user?.role)
                  ? `🔴 ${user.role}`
                  : `${tierIcon} ${stats.tier} Member`}
              </div>
            </div>

            <nav style={{ flex: 1 }}>
              {SIDEBAR_LINKS.map(([icon, label, to]) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    color: "#94a3b8",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    borderRadius: 10,
                    marginBottom: 4,
                    transition: "all .2s",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.08)";
                    e.currentTarget.style.color = "#e2e8f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  <span style={{ fontSize: 18 }}>{icon}</span> {label}
                </Link>
              ))}
              {["admin", "manager"].includes(user?.role) && (
                <Link
                  to="/admin"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 16px",
                    color: "#a78bfa",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                    borderRadius: 10,
                    marginBottom: 4,
                    background: "rgba(124,58,237,.15)",
                    border: "1px solid rgba(124,58,237,.3)",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}
                >
                  <span style={{ fontSize: 18 }}>⚙️</span> Admin Panel
                </Link>
              )}
            </nav>
          </aside>

          <div style={{ padding: 28, background: "#f8fafc" }}>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 20,
              }}
            >
              Good day, {name.split(" ")[0]}! 👋
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 14,
                marginBottom: 24,
              }}
            >
              {[
                [
                  "Total Orders",
                  stats.orders,
                  "#6366f1",
                  "linear-gradient(135deg,#eef2ff,#e0e7ff)",
                ],
                [
                  "Loyalty Points",
                  `${stats.points} pts`,
                  tierColor,
                  `linear-gradient(135deg,${tierColor}15,${tierColor}08)`,
                ],
                [
                  "Total Spent",
                  `$${stats.spent.toFixed(2)}`,
                  "#db2777",
                  "linear-gradient(135deg,#fdf2f8,#fce7f3)",
                ],
              ].map(([l, v, c, bg]) => (
                <div
                  key={l}
                  style={{
                    background: bg,
                    borderRadius: 14,
                    padding: "18px 20px",
                    border: `1.5px solid ${c}22`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginBottom: 6,
                      fontWeight: 600,
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                    }}
                  >
                    {l}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: c,
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 20,
                border: "1.5px solid #e5e7eb",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Recent Orders
                </h3>
                <Link
                  to="/orders"
                  style={{
                    fontSize: 12,
                    color: "#6366f1",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  View all →
                </Link>
              </div>
              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    padding: 20,
                    fontSize: 13,
                  }}
                >
                  Loading…
                </div>
              ) : recentOrders.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    padding: 20,
                    fontSize: 13,
                  }}
                >
                  No orders yet.{" "}
                  <Link
                    to="/shop"
                    style={{ color: "#16a34a", fontWeight: 700 }}
                  >
                    Start shopping!
                  </Link>
                </div>
              ) : (
                recentOrders.map((o, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "9px 0",
                      borderBottom: "1px solid #f8fafc",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>
                      {o.Sale_ID}
                    </span>
                    <span style={{ color: "#6b7280", fontSize: 12 }}>
                      {o.date}
                    </span>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 700,
                        background: "#dcfce7",
                        color: "#15803d",
                      }}
                    >
                      {o.status}
                    </span>
                    <strong>${Number(o.Total_Amount || 0).toFixed(2)}</strong>
                  </div>
                ))
              )}
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 20,
                border: "1.5px solid #e5e7eb",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 16,
                }}
              >
                🎁 Loyalty Program
              </h3>
              <div
                style={{
                  background: `linear-gradient(135deg,${tierColor}15,${tierColor}08)`,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 14,
                  border: `1px solid ${tierColor}33`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 36 }}>{tierIcon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: tierColor,
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {stats.points} pts
                    </div>
                    <div
                      style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}
                    >
                      {stats.tier} Member · ${stats.spent.toFixed(2)} spent ·{" "}
                      <strong style={{ color: tierColor }}>1 pt per $1</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "#e5e7eb",
                  height: 8,
                  borderRadius: 99,
                  overflow: "hidden",
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    background: `linear-gradient(90deg,${tierColor},${tierColor}88)`,
                    height: "100%",
                    width: `${Math.max(progress, 2)}%`,
                    borderRadius: 99,
                    transition: "width .5s",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "#94a3b8",
                  marginBottom: 16,
                }}
              >
                <span>
                  {tierIcon} {stats.tier} (${TIER_THRESHOLDS[stats.tier]})
                </span>
                {nextTier ? (
                  <span>
                    {TIER_ICONS[nextTier]} {nextTier} — $
                    {Math.max(0, nextVal - stats.spent).toFixed(2)} away
                  </span>
                ) : (
                  <span>💎 Max tier reached!</span>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
                marginBottom: 16,
              }}
            >
              {[
                [
                  "🛒 Browse Shop",
                  "/shop",
                  "linear-gradient(135deg,#15803d,#22c55e)",
                  "#fff",
                ],
                [
                  "📦 My Orders",
                  "/orders",
                  "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  "#fff",
                ],
                [
                  "❤️ Wishlist",
                  "/wishlist",
                  "linear-gradient(135deg,#db2777,#ec4899)",
                  "#fff",
                ],
              ].map(([l, p, bg, c]) => (
                <Link
                  key={l}
                  to={p}
                  style={{
                    padding: "14px",
                    borderRadius: 12,
                    background: bg,
                    color: c,
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: "none",
                    textAlign: "center",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    transition: "all .2s",
                    display: "block",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {l}
                </Link>
              ))}
            </div>

            {["admin", "manager"].includes(user?.role) &&
              lowStock.length > 0 && (
                <div
                  style={{
                    marginTop: 16,
                    background: "#fffbeb",
                    borderRadius: 14,
                    padding: 18,
                    border: "1.5px solid #fcd34d",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#d97706",
                      marginBottom: 12,
                    }}
                  >
                    ⚠️ {lowStock.length} Low Stock Items
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: 8,
                    }}
                  >
                    {lowStock.slice(0, 6).map((item) => (
                      <div
                        key={item.Product_ID}
                        style={{
                          background: "#fff",
                          borderRadius: 8,
                          padding: "10px 12px",
                          border: "1px solid #fde68a",
                          fontSize: 12,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#0f172a",
                            marginBottom: 2,
                          }}
                        >
                          {item.Name}
                        </div>
                        <div style={{ color: "#d97706", fontWeight: 600 }}>
                          {item.Quantity} left
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/admin/inventory"
                    style={{
                      display: "inline-block",
                      marginTop: 10,
                      color: "#d97706",
                      fontWeight: 700,
                      fontSize: 13,
                      textDecoration: "none",
                    }}
                  >
                    View all in inventory →
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
