import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sumRes, dayRes, invRes, salesRes] = await Promise.all([
          API.get("/api/sales/reports/summary"),
          API.get("/api/sales/reports/daily"),
          API.get("/api/inventory/"),
          API.get("/api/sales/"),
        ]);
        setSummary(sumRes.data);
        setDaily(dayRes.data);
        setInventory(invRes.data);
        setRecentSales(salesRes.data.slice(0, 5));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const lowStockCount = inventory.filter((i) => i.Status !== "In Stock").length;

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
            `$${daily?.total_revenue?.toFixed(2) || "0.00"}`,
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
            lowStockCount,
            "#FF8C00",
            "⚠️",
            "/admin/inventory",
          ],
          [
            "Monthly Revenue",
            `$${summary?.monthly_revenue?.toFixed(2) || "0.00"}`,
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
                cursor: "pointer",
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
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
          {loading ? (
            <div style={{ textAlign: "center", color: "#888", padding: 20 }}>
              Loading...
            </div>
          ) : recentSales.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888", padding: 20 }}>
              No sales yet
            </div>
          ) : (
            recentSales.map((s) => (
              <div
                key={s.Sale_ID}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #f5f5f5",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#00B207", fontWeight: 700 }}>
                  #{s.Sale_ID}
                </span>
                <span style={{ color: "#666" }}>{s.Customer}</span>
                <span style={{ fontWeight: 700 }}>
                  ${s.Total_Amount?.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Quick Links */}
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
              ["+ New Sale", "/admin/sales", "#00B207"],
              ["+ Add Product", "/admin/inventory", "#3b82f6"],
              ["+ Add Employee", "/admin/users", "#FF8C00"],
              ["View Reports", "/admin/reports", "#EA4B48"],
            ].map(([label, path, color]) => (
              <Link
                key={label}
                to={path}
                style={{
                  padding: "14px",
                  borderRadius: 8,
                  background: color + "10",
                  color,
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  textAlign: "center",
                  border: `1px solid ${color}30`,
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
