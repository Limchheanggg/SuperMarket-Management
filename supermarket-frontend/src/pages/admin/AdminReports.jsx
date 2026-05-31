import { useState, useEffect } from "react";
import API from "../../services/api";

function BarChart({ data, color, height = 120 }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        height,
        paddingTop: 10,
      }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div style={{ fontSize: 9, color: "#64748b", fontWeight: 600 }}>
            {d.value > 0
              ? `$${d.value >= 1000 ? (d.value / 1000).toFixed(1) + "k" : d.value.toFixed(0)}`
              : ""}
          </div>
          <div
            style={{
              width: "100%",
              background: `linear-gradient(180deg,${color},${color}88)`,
              borderRadius: "6px 6px 0 0",
              height: `${Math.max((d.value / max) * 100, d.value > 0 ? 4 : 1)}%`,
              minHeight: d.value > 0 ? 4 : 1,
              transition: "height .5s ease",
              opacity: d.value > 0 ? 1 : 0.2,
            }}
            title={`${d.label}: $${d.value}`}
          />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 10,
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, bg }) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 18,
        padding: 22,
        border: `1.5px solid ${color}22`,
      }}
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
            width: 46,
            height: 46,
            borderRadius: 14,
            background: color + "22",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 11,
            color,
            fontWeight: 700,
            background: color + "15",
            padding: "4px 10px",
            borderRadius: 99,
          }}
        >
          ↑ {sub}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: 30,
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: 13,
          color: "#64748b",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payChart, setPayChart] = useState("monthly"); // 'monthly' | 'payment'

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [sRes, dRes, iRes, mRes, bRes] = await Promise.all([
        API.get("/api/sales/reports/summary"),
        API.get("/api/sales/reports/daily"),
        API.get("/api/inventory/"),
        API.get("/api/sales/reports/monthly"),
        API.get("/api/sales/reports/best-sellers"),
      ]);
      setSummary(sRes.data);
      setDaily(dRes.data);
      setInventory(iRes.data || []);
      setMonthly(mRes.data || []);
      setBestSellers(bRes.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const lowStock = inventory.filter((i) => i.Status !== "In Stock");

  // Payment method chart data
  const paymentData = summary?.by_method
    ? Object.entries(summary.by_method).map(([k, v]) => ({
        label: k.replace(" ", ""),
        value: v,
      }))
    : [];

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              color: "#64748b",
              fontSize: 16,
            }}
          >
            Loading reports...
          </p>
        </div>
      </div>
    );

  const RANK_COLORS = [
    "#f59e0b",
    "#94a3b8",
    "#cd7c0a",
    "#6366f1",
    "#16a34a",
    "#db2777",
    "#0891b2",
    "#7c3aed",
    "#ea580c",
    "#15803d",
  ];

  return (
    <div style={{ padding: 28, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .rp-card{background:#fff;border-radius:18px;padding:22px;border:1.5px solid #e5e7eb;box-shadow:0 2px 10px rgba(0,0,0,.04)}
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 26,
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 4,
          }}
        >
          Reports & Analytics
        </h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Track your store performance in real time
        </p>
      </div>

      {/* Today banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#0f172a,#1e3a2f)",
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 12,
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            📅 Today — {daily?.date}
          </div>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 36,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 4,
            }}
          >
            ${daily?.total_revenue?.toFixed(2) || "0.00"}
          </div>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 14,
              color: "#94a3b8",
            }}
          >
            Total Revenue Today
          </div>
        </div>
        {[
          ["🛒", daily?.total_sales || 0, "Sales Today"],
          [
            "💰",
            `$${daily?.avg_transaction?.toFixed(2) || "0.00"}`,
            "Avg Transaction",
          ],
        ].map(([icon, v, l]) => (
          <div
            key={l}
            style={{
              background: "rgba(255,255,255,.06)",
              borderRadius: 16,
              padding: "18px 24px",
              border: "1px solid rgba(255,255,255,.08)",
              textAlign: "center",
              minWidth: 140,
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 4,
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 12,
                color: "#64748b",
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard
          icon="📆"
          label="Monthly Sales"
          value={summary?.monthly_sales || 0}
          sub="this month"
          color="#6366f1"
          bg="linear-gradient(135deg,#eef2ff,#e0e7ff)"
        />
        <StatCard
          icon="💵"
          label="Monthly Revenue"
          value={`$${summary?.monthly_revenue?.toFixed(2) || "0.00"}`}
          sub="this month"
          color="#16a34a"
          bg="linear-gradient(135deg,#f0fdf4,#dcfce7)"
        />
        <StatCard
          icon="📊"
          label="Yearly Sales"
          value={summary?.yearly_sales || 0}
          sub="this year"
          color="#d97706"
          bg="linear-gradient(135deg,#fffbeb,#fef3c7)"
        />
        <StatCard
          icon="🏆"
          label="Yearly Revenue"
          value={`$${summary?.yearly_revenue?.toFixed(2) || "0.00"}`}
          sub="this year"
          color="#db2777"
          bg="linear-gradient(135deg,#fdf2f8,#fce7f3)"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Monthly Revenue Chart — REAL DATA */}
        <div className="rp-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
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
              Monthly Revenue
            </h3>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 12,
                color: "#6366f1",
                fontWeight: 700,
                background: "#eef2ff",
                padding: "4px 10px",
                borderRadius: 99,
              }}
            >
              {new Date().getFullYear()}
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 12,
              color: "#94a3b8",
              marginBottom: 16,
            }}
          >
            Revenue breakdown by month
          </p>
          {monthly.length > 0 ? (
            <>
              <BarChart data={monthly} color="#6366f1" height={140} />
              {/* Total label */}
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  background: "#f8fafc",
                  borderRadius: 10,
                  fontSize: 13,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748b" }}>Total this year</span>
                <strong style={{ color: "#6366f1" }}>
                  ${summary?.yearly_revenue?.toFixed(2) || "0.00"}
                </strong>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>
              No data yet
            </div>
          )}
        </div>

        {/* Best Selling Products — REAL DATA */}
        <div className="rp-card">
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
                fontSize: 16,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              🏆 Best Selling Products
            </h3>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 12,
                color: "#d97706",
                fontWeight: 700,
                background: "#fef3c7",
                padding: "4px 10px",
                borderRadius: 99,
              }}
            >
              Top 10
            </span>
          </div>
          {bestSellers.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
              No sales data yet
            </div>
          ) : (
            <div style={{ overflowY: "auto", maxHeight: 340 }}>
              {bestSellers.map((p, i) => {
                const c = RANK_COLORS[i] || "#6366f1";
                const max = bestSellers[0].total_qty;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "9px 0",
                      borderBottom: "1px solid #f8fafc",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 9,
                        background: c + "22",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 12,
                        fontWeight: 800,
                        color: c,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: 5,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          height: 5,
                          background: "#f1f5f9",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(p.total_qty / max) * 100}%`,
                            background: `linear-gradient(90deg,${c},${c}88)`,
                            borderRadius: 99,
                            transition: "width .5s",
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          fontSize: 13,
                          fontWeight: 800,
                          color: c,
                        }}
                      >
                        ${p.total_revenue.toFixed(2)}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          fontSize: 11,
                          color: "#94a3b8",
                        }}
                      >
                        {p.total_qty} units
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div className="rp-card">
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 16,
            }}
          >
            💳 Revenue by Payment Method
          </h3>
          {paymentData.length === 0 ? (
            <div style={{ textAlign: "center", padding: 20, color: "#94a3b8" }}>
              No data
            </div>
          ) : (
            paymentData.map((p, i) => {
              const colors = ["#16a34a", "#6366f1", "#d97706", "#db2777"];
              const total = paymentData.reduce((s, x) => s + x.value, 0);
              const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : 0;
              return (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#374151" }}>
                      {p.label}
                    </span>
                    <span style={{ fontWeight: 800, color: colors[i % 4] }}>
                      ${p.value.toFixed(2)}{" "}
                      <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: "#f1f5f9",
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: `linear-gradient(90deg,${colors[i % 4]},${colors[i % 4]}88)`,
                        borderRadius: 99,
                        transition: "width .5s",
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Total Stats Summary */}
        <div className="rp-card">
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 16,
            }}
          >
            📈 All-Time Summary
          </h3>
          {[
            [
              "🛒",
              "Total Transactions",
              summary?.total_transactions || 0,
              "#6366f1",
            ],
            [
              "💰",
              "Total Revenue",
              `$${summary?.total_revenue?.toFixed(2) || "0.00"}`,
              "#16a34a",
            ],
            [
              "📊",
              "Avg Transaction",
              `$${summary?.average_transaction?.toFixed(2) || "0.00"}`,
              "#d97706",
            ],
            ["📦", "Products in Store", inventory.length, "#0891b2"],
            ["⚠️", "Low/Out of Stock", lowStock.length, "#dc2626"],
          ].map(([icon, label, value, color]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: 10,
                marginBottom: 8,
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
              }}
            >
              <span style={{ fontSize: 13, color: "#374151" }}>
                {icon} {label}
              </span>
              <strong
                style={{
                  fontSize: 14,
                  color,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
              >
                {value}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Alerts */}
      <div className="rp-card">
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
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            ⚠️ Inventory Alerts
            <span
              style={{
                marginLeft: 10,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 12,
                background: "#fef3c7",
                color: "#d97706",
                padding: "3px 10px",
                borderRadius: 99,
                fontWeight: 700,
              }}
            >
              {lowStock.length} items
            </span>
          </h3>
        </div>
        {lowStock.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 24,
              color: "#16a34a",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            ✅ All products well stocked!
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
            }}
          >
            {lowStock.slice(0, 9).map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: 12,
                  background:
                    item.Status === "Out of Stock" ? "#fef2f2" : "#fffbeb",
                  border: `1.5px solid ${item.Status === "Out of Stock" ? "#fecaca" : "#fde68a"}`,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {item.Name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 11,
                      color: "#94a3b8",
                      marginTop: 2,
                    }}
                  >
                    {item.Category_Name}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 14,
                      fontWeight: 800,
                      color:
                        item.Status === "Out of Stock" ? "#ef4444" : "#f59e0b",
                    }}
                  >
                    {item.Quantity}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background:
                        item.Status === "Out of Stock"
                          ? "#ef444420"
                          : "#f59e0b20",
                      color:
                        item.Status === "Out of Stock" ? "#ef4444" : "#f59e0b",
                    }}
                  >
                    {item.Status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
