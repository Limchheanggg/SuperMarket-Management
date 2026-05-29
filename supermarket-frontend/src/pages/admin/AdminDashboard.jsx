import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

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
          }}
        />
      ))}
    </div>
  );
}

function DonutChart({ inStock, lowStock, outStock, size = 100 }) {
  const total = inStock + lowStock + outStock || 1;
  const r = 28,
    cx = 40,
    cy = 40,
    circ = 2 * Math.PI * r;
  const segments = [
    { value: inStock, color: "#22c55e" },
    { value: lowStock, color: "#f59e0b" },
    { value: outStock, color: "#ef4444" },
  ];
  let offset = 0;
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
          API.get("/api/sales/reports/summary").catch(() => ({ data: null })),
          API.get("/api/sales/reports/daily").catch(() => ({ data: null })),
          API.get("/api/inventory/").catch(() => ({ data: [] })),
          API.get("/api/sales/").catch(() => ({ data: [] })),
        ]);
        setSummary(sumRes.data);
        setDaily(dayRes.data);
        setInventory(invRes.data || []);
        setRecentSales((salesRes.data || []).slice(0, 6));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Correct inventory counts ──
  // Each product belongs to exactly ONE status bucket
  const totalProducts = inventory.length;
  const inStockCount = inventory.filter((i) => i.Status === "In Stock").length;
  const lowStockCount = inventory.filter(
    (i) => i.Status === "Low Stock",
  ).length;
  const outCount = inventory.filter((i) => i.Status === "Out of Stock").length;
  // Sanity: inStock + low + out === total (always true now)

  const KPI = [
    {
      label: "Today's Revenue",
      value:
        daily?.total_revenue != null
          ? `$${daily.total_revenue.toFixed(2)}`
          : "$0.00",
      sub: "today",
      icon: "💰",
      color: "#6366f1",
      bg: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
      sparkData: [0, 0, 0, 0, 0, 0, daily?.total_revenue || 0],
    },
    {
      label: "Today's Sales",
      value: daily?.total_sales ?? 0,
      sub: "transactions",
      icon: "🛒",
      color: "#16a34a",
      bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
      sparkData: [0, 0, 0, 0, 0, 0, daily?.total_sales || 0],
    },
    {
      label: "Low/Out of Stock",
      value: lowStockCount + outCount,
      sub: "need restocking",
      icon: "⚠️",
      color: "#d97706",
      bg: "linear-gradient(135deg,#fffbeb,#fef3c7)",
      sparkData: [0, 0, 0, 0, 0, 0, lowStockCount + outCount],
    },
    {
      label: "Monthly Revenue",
      value:
        summary?.monthly_revenue != null
          ? `$${summary.monthly_revenue.toFixed(2)}`
          : "$0.00",
      sub: "this month",
      icon: "📈",
      color: "#db2777",
      bg: "linear-gradient(135deg,#fdf2f8,#fce7f3)",
      sparkData: [0, 0, 0, 0, 0, 0, summary?.monthly_revenue || 0],
    },
  ];

  return (
    <div style={{ padding: 28, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ad-card{background:#fff;border-radius:18px;padding:22px;border:1.5px solid #e5e7eb;box-shadow:0 2px 10px rgba(0,0,0,.04);transition:all .25s}
        .ad-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.08)}
        .ad-kpi{border-radius:18px;padding:22px;transition:all .25s;cursor:default}
        .ad-kpi:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.1)}
        .ad-quick{padding:13px 18px;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;text-decoration:none;text-align:center;transition:all .2s;display:block}
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
            {totalProducts} products · {inStockCount} in stock ·{" "}
            {lowStockCount + outCount} need attention
          </p>
        </div>
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
              <MiniBarChart data={k.sparkData} color={k.color} />
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
          gridTemplateColumns: "1fr 1fr 280px",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Recent Sales */}
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
            <div
              style={{
                textAlign: "center",
                padding: 20,
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🛒</div>
              No sales yet.{" "}
              <Link
                to="/admin/sales"
                style={{ color: "#16a34a", fontWeight: 700 }}
              >
                Create first sale →
              </Link>
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

        {/* Inventory Donut */}
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
              marginBottom: 16,
            }}
          >
            <DonutChart
              inStock={inStockCount}
              lowStock={lowStockCount}
              outStock={outCount}
              size={100}
            />
          </div>
          {/* Correct counts — each product counted ONCE */}
          {[
            ["In Stock", inStockCount, "#22c55e", "#f0fdf4"],
            ["Low Stock", lowStockCount, "#f59e0b", "#fffbeb"],
            ["Out of Stock", outCount, "#ef4444", "#fef2f2"],
          ].map(([l, v, c, bg]) => (
            <div
              key={l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 12px",
                borderRadius: 10,
                background: bg,
                marginBottom: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 9,
                    height: 9,
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
                  fontSize: 15,
                  fontWeight: 800,
                  color: c,
                }}
              >
                {v}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 10,
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 12,
                color: "#64748b",
              }}
            >
              Total:{" "}
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 14,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              {totalProducts} products
            </span>
          </div>
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
              ],
              [
                "📦 Inventory",
                "/admin/inventory",
                "linear-gradient(135deg,#0891b2,#06b6d4)",
              ],
              [
                "👥 Users",
                "/admin/users",
                "linear-gradient(135deg,#7c3aed,#8b5cf6)",
              ],
              [
                "📈 Reports",
                "/admin/reports",
                "linear-gradient(135deg,#db2777,#ec4899)",
              ],
              [
                "⭐ Membership",
                "/admin/membership",
                "linear-gradient(135deg,#d97706,#f59e0b)",
              ],
            ].map(([l, p, bg]) => (
              <Link
                key={l}
                to={p}
                className="ad-quick"
                style={{ background: bg, color: "#fff" }}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats */}
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
            value: totalProducts,
            icon: "📦",
            color: "#0891b2",
            bg: "#ecfeff",
          },
          {
            label: "Monthly Sales",
            value: summary?.monthly_sales ?? 0,
            icon: "📊",
            color: "#7c3aed",
            bg: "#f5f3ff",
          },
          {
            label: "Yearly Revenue",
            value:
              summary?.yearly_revenue != null
                ? `$${summary.yearly_revenue.toFixed(0)}`
                : "$0",
            icon: "💵",
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            label: "Yearly Sales",
            value: summary?.yearly_sales ?? 0,
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
