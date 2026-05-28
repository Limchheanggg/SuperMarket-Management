import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

// Mini bar chart component
function MiniBarChart({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}
    >
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: i === data.length - 1 ? color : color + "55",
            borderRadius: "3px 3px 0 0",
            height: `${(v / max) * 100}%`,
            minHeight: 4,
            transition: "height .3s",
          }}
        />
      ))}
    </div>
  );
}

// Donut chart SVG
function DonutChart({ segments, size = 80 }) {
  const r = 28,
    cx = 40,
    cy = 40,
    circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={10}
      />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={10}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

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
        setRecentSales(salesRes.data.slice(0, 6));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const lowStockCount = inventory.filter((i) => i.Status !== "In Stock").length;
  const inStockCount = inventory.filter((i) => i.Status === "In Stock").length;
  const outCount = inventory.filter((i) => i.Status === "Out of Stock").length;

  const KPI = [
    {
      label: "Today's Revenue",
      value: `$${daily?.total_revenue?.toFixed(2) || "0.00"}`,
      sub: "vs yesterday",
      icon: "💰",
      color: "#6366f1",
      bg: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
      bar: "#6366f1",
      sparkData: [12, 18, 14, 22, 16, 24, daily?.total_revenue || 0],
    },
    {
      label: "Today's Sales",
      value: daily?.total_sales || 0,
      sub: "transactions",
      icon: "🛒",
      color: "#16a34a",
      bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
      bar: "#16a34a",
      sparkData: [3, 5, 4, 7, 5, 8, daily?.total_sales || 0],
    },
    {
      label: "Low Stock Items",
      value: lowStockCount,
      sub: "need restocking",
      icon: "⚠️",
      color: "#d97706",
      bg: "linear-gradient(135deg,#fffbeb,#fef3c7)",
      bar: "#f59e0b",
      sparkData: [2, 3, 2, 4, 3, 5, lowStockCount],
    },
    {
      label: "Monthly Revenue",
      value: `$${summary?.monthly_revenue?.toFixed(2) || "0.00"}`,
      sub: "this month",
      icon: "📈",
      color: "#db2777",
      bg: "linear-gradient(135deg,#fdf2f8,#fce7f3)",
      bar: "#ec4899",
      sparkData: [200, 340, 280, 420, 310, 480, summary?.monthly_revenue || 0],
    },
  ];

  return (
    <div style={{ padding: 28, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ad-card{background:#fff;border-radius:18px;padding:22px;border:1.5px solid #e5e7eb;box-shadow:0 2px 10px rgba(0,0,0,.04);transition:all .25s}
        .ad-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.08)}
        .ad-kpi{border-radius:18px;padding:22px;transition:all .25s}
        .ad-kpi:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.1)}
        .ad-quick{padding:14px 18px;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;text-decoration:none;text-align:center;transition:all .2s;display:block}
        .ad-quick:hover{transform:translateY(-2px);opacity:.9}
      `}</style>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 4,
            }}
          >
            Dashboard Overview
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            to="/admin/sales"
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              background: "linear-gradient(135deg,#16a34a,#22c55e)",
              color: "#fff",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(22,163,74,.3)",
            }}
          >
            + New Sale
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {KPI.map((k) => (
          <div
            key={k.label}
            className="ad-kpi"
            style={{ background: k.bg, border: `1.5px solid ${k.color}22` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: k.color + "22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                {k.icon}
              </div>
              <MiniBarChart data={k.sparkData} color={k.bar} />
            </div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {k.value}
            </div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 12,
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 11,
                color: k.color,
                fontWeight: 700,
                marginTop: 6,
              }}
            >
              ↑ {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 300px",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Recent Sales */}
        <div className="ad-card" style={{ gridColumn: "span 1" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 16,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Recent Sales
            </h3>
            <Link
              to="/admin/sales"
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#6366f1",
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 20, color: "#94a3b8" }}>
              Loading...
            </div>
          ) : recentSales.length === 0 ? (
            <div style={{ textAlign: "center", padding: 20, color: "#94a3b8" }}>
              No sales yet
            </div>
          ) : (
            recentSales.map((s) => (
              <div
                key={s.Sale_ID}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f8fafc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                    }}
                  >
                    🧾
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      #{s.Sale_ID}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 11,
                        color: "#94a3b8",
                      }}
                    >
                      {s.Customer}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#16a34a",
                    }}
                  >
                    ${s.Total_Amount?.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 11,
                      color: "#94a3b8",
                    }}
                  >
                    {s.Payment_Method}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Inventory Summary */}
        <div className="ad-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 16,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Inventory Status
            </h3>
            <Link
              to="/admin/inventory"
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#0891b2",
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <DonutChart
              size={100}
              segments={[
                { value: inStockCount || 1, color: "#22c55e" },
                { value: lowStockCount || 1, color: "#f59e0b" },
                { value: outCount || 1, color: "#ef4444" },
              ]}
            />
          </div>
          {[
            ["In Stock", inStockCount, "#22c55e"],
            ["Low Stock", lowStockCount, "#f59e0b"],
            ["Out of Stock", outCount, "#ef4444"],
          ].map(([l, v, c]) => (
            <div
              key={l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: c,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {l}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 14,
                  fontWeight: 800,
                  color: c,
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="ad-card">
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 16,
            }}
          >
            Quick Actions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              [
                "+  New Sale",
                "/admin/sales",
                "linear-gradient(135deg,#16a34a,#22c55e)",
                "#fff",
              ],
              [
                "📦 Inventory",
                "/admin/inventory",
                "linear-gradient(135deg,#0891b2,#06b6d4)",
                "#fff",
              ],
              [
                "👥 Add Employee",
                "/admin/users",
                "linear-gradient(135deg,#7c3aed,#8b5cf6)",
                "#fff",
              ],
              [
                "📈 Reports",
                "/admin/reports",
                "linear-gradient(135deg,#db2777,#ec4899)",
                "#fff",
              ],
              [
                "⭐ Membership",
                "/admin/membership",
                "linear-gradient(135deg,#d97706,#f59e0b)",
                "#fff",
              ],
            ].map(([l, p, bg, c]) => (
              <Link
                key={l}
                to={p}
                className="ad-quick"
                style={{ background: bg, color: c }}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
        }}
      >
        {[
          {
            label: "Total Products",
            value: inventory.length,
            icon: "📦",
            color: "#0891b2",
            bg: "#ecfeff",
          },
          {
            label: "Monthly Sales",
            value: summary?.monthly_sales || 0,
            icon: "📊",
            color: "#7c3aed",
            bg: "#f5f3ff",
          },
          {
            label: "Yearly Revenue",
            value: `$${summary?.yearly_revenue?.toFixed(0) || "0"}`,
            icon: "💵",
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            label: "Yearly Sales",
            value: summary?.yearly_sales || 0,
            icon: "🧾",
            color: "#db2777",
            bg: "#fdf2f8",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="ad-card"
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: s.color,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 12,
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
