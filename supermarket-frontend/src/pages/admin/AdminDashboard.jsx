import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sumRes, dayRes, invRes, salesRes] = await Promise.allSettled([
          API.get("/api/sales/reports/summary"),
          API.get("/api/sales/reports/daily"),
          API.get("/api/inventory/"),
          API.get("/api/sales/"),
        ]);
        if (sumRes.status === "fulfilled") setSummary(sumRes.value.data);
        if (dayRes.status === "fulfilled") setDaily(dayRes.value.data);
        if (invRes.status === "fulfilled") setInventory(invRes.value.data);
        if (salesRes.status === "fulfilled")
          setRecentSales(salesRes.value.data.slice(0, 5));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const lowStock = inventory.filter((i) => i.Status !== "In Stock");
  const totalProducts = inventory.length;
  const outOfStock = inventory.filter(
    (i) => i.Status === "Out of Stock",
  ).length;

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <div className="spinner" />
      </div>
    );

  if (error)
    return (
      <div style={{ padding: 28 }}>
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #EA4B48",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <h3
            style={{
              fontFamily: "'Josefin Sans',sans-serif",
              color: "#991b1b",
              marginBottom: 8,
            }}
          >
            Dashboard Error
          </h3>
          <p style={{ color: "#991b1b", fontSize: 14 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ marginTop: 16 }}
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ padding: 28 }}>
      <h2
        style={{
          fontFamily: "'Josefin Sans',sans-serif",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        📊 Admin Dashboard
      </h2>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          [
            "Today's Revenue",
            `$${(daily?.total_revenue || 0).toFixed(2)}`,
            "#00B207",
            "💰",
            "/admin/sales",
          ],
          [
            "Today's Sales",
            daily?.total_sales || 0,
            "#3b82f6",
            "🛒",
            "/admin/sales",
          ],
          [
            "Low Stock Items",
            lowStock.length,
            "#FF8C00",
            "⚠️",
            "/admin/inventory",
          ],
          [
            "Total Revenue",
            `$${(summary?.total_revenue || 0).toFixed(2)}`,
            "#EA4B48",
            "📈",
            "/admin/reports",
          ],
        ].map(([l, v, c, icon, link]) => (
          <Link key={l} to={link} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "20px 24px",
                borderLeft: `4px solid ${c}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                {l}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: c }}>{v}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Second row stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          ["Total Products", totalProducts, "#6366f1", "📦"],
          ["Out of Stock", outOfStock, "#EA4B48", "❌"],
          [
            "Total Transactions",
            summary?.total_transactions || 0,
            "#00B207",
            "🧾",
          ],
          [
            "Avg Transaction",
            `$${(summary?.average_transaction || 0).toFixed(2)}`,
            "#FF8C00",
            "💳",
          ],
        ].map(([l, v, c, icon]) => (
          <div
            key={l}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "16px 20px",
              borderLeft: `4px solid ${c}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              {l}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Recent Sales */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
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
                fontFamily: "'Josefin Sans',sans-serif",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Recent Sales
            </h3>
            <Link
              to="/admin/sales"
              style={{
                color: "#00B207",
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          {recentSales.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888", padding: 20 }}>
              <div style={{ fontSize: 32 }}>🛒</div>
              <p style={{ marginTop: 8, fontSize: 13 }}>No sales yet</p>
            </div>
          ) : (
            recentSales.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f5f5f5",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#00B207", fontWeight: 700 }}>
                  {s.Sale_ID}
                </span>
                <span
                  style={{
                    color: "#666",
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.Customer}
                </span>
                <span style={{ color: "#888", fontSize: 12 }}>{s.date}</span>
                <span style={{ fontWeight: 700 }}>
                  ${Number(s.Total_Amount || 0).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Payment Breakdown */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Josefin Sans',sans-serif",
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Revenue by Payment
          </h3>
          {summary?.by_method && Object.keys(summary.by_method).length > 0 ? (
            Object.entries(summary.by_method).map(([method, amount]) => {
              const total = summary.total_revenue || 1;
              const pct = ((amount / total) * 100).toFixed(1);
              const colors = {
                Cash: "#00B207",
                Card: "#3b82f6",
                ABA: "#FF8C00",
                "ABA / Wing": "#FF8C00",
                "Bank Transfer": "#6366f1",
              };
              const color = colors[method] || "#888";
              return (
                <div key={method} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{method}</span>
                    <span style={{ fontWeight: 700 }}>
                      ${Number(amount).toFixed(2)}{" "}
                      <span style={{ color: "#888", fontWeight: 400 }}>
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#f0f0f0",
                      borderRadius: 99,
                      height: 8,
                    }}
                  >
                    <div
                      style={{
                        background: color,
                        borderRadius: 99,
                        height: 8,
                        width: `${pct}%`,
                        transition: "width 0.5s",
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#888",
                padding: 20,
                fontSize: 13,
              }}
            >
              No payment data yet
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Inventory Alerts */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
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
                fontFamily: "'Josefin Sans',sans-serif",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              ⚠️ Inventory Alerts ({lowStock.length})
            </h3>
            <Link
              to="/admin/inventory"
              style={{
                color: "#00B207",
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Manage →
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#00B207",
                padding: 20,
                fontWeight: 600,
              }}
            >
              ✅ All products well stocked!
            </div>
          ) : (
            lowStock.slice(0, 6).map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {item.Name}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    {item.Category_Name}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>
                    {item.Quantity} left
                  </div>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontSize: 10,
                      fontWeight: 700,
                      background:
                        item.Status === "Out of Stock"
                          ? "#EA4B4820"
                          : "#FF8C0020",
                      color:
                        item.Status === "Out of Stock" ? "#EA4B48" : "#FF8C00",
                    }}
                  >
                    {item.Status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Josefin Sans',sans-serif",
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Quick Actions
          </h3>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              ["🛒 New Sale", "/admin/sales", "#00B207"],
              ["📦 Add Product", "/admin/inventory", "#3b82f6"],
              ["👤 Add Employee", "/admin/users", "#FF8C00"],
              ["📊 View Reports", "/admin/reports", "#EA4B48"],
              ["⭐ Membership", "/admin/membership", "#6366f1"],
              ["🔄 Restock", "/admin/inventory", "#00B207"],
            ].map(([label, path, color]) => (
              <Link
                key={label}
                to={path}
                style={{
                  padding: "14px",
                  borderRadius: 8,
                  background: color + "15",
                  color,
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  textAlign: "center",
                  border: `1px solid ${color}30`,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = color;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = color + "15";
                  e.currentTarget.style.color = color;
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
