import { useState, useEffect } from "react";
import API from "../../services/api";

function LineChart({ data, color = "#6366f1", height = 180 }) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const w = 700,
    padL = 48,
    padR = 16,
    padT = 20,
    padB = 30;
  const chartW = w - padL - padR;
  const chartH = height - padT - padB;

  const points = data.map((d, i) => ({
    x: padL + (i / (data.length - 1)) * chartW,
    y: padT + chartH - (d.value / max) * chartH,
    ...d,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: padT + chartH - pct * chartH,
    label:
      max >= 1000
        ? `$${((max * pct) / 1000).toFixed(1)}k`
        : `$${(max * pct).toFixed(0)}`,
  }));

  const currentMonth = new Date().getMonth();

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      style={{ width: "100%", height, overflow: "visible" }}
    >
      <defs>
        <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
        <filter id="lineglow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={padL}
            y1={g.y}
            x2={w - padR}
            y2={g.y}
            stroke={i === 0 ? "#e2e8f0" : "#f1f5f9"}
            strokeWidth={i === 0 ? 1.5 : 1}
            strokeDasharray={i === 0 ? "none" : "4,4"}
          />
          <text
            x={padL - 8}
            y={g.y + 4}
            textAnchor="end"
            style={{
              fontSize: 10,
              fill: "#94a3b8",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontWeight: 500,
            }}
          >
            {g.label}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaD} fill="url(#lineAreaGrad)" />

      {/* Smooth line using cubic bezier */}
      <path
        d={(() => {
          let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
          for (let i = 1; i < points.length; i++) {
            const cp1x = (points[i - 1].x + points[i].x) / 2;
            const cp2x = (points[i - 1].x + points[i].x) / 2;
            d += ` C ${cp1x.toFixed(1)} ${points[i - 1].y.toFixed(1)}, ${cp2x.toFixed(1)} ${points[i].y.toFixed(1)}, ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
          }
          return d;
        })()}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#lineglow)"
      />

      {/* Current month vertical highlight */}
      {points[currentMonth]?.value > 0 && (
        <line
          x1={points[currentMonth].x}
          y1={padT}
          x2={points[currentMonth].x}
          y2={padT + chartH}
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.15"
          strokeDasharray="4,3"
        />
      )}

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          {/* Value label */}
          {p.value > 0 && (
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              style={{
                fontSize: 9,
                fill: color,
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}
            >
              {p.value >= 1000
                ? `$${(p.value / 1000).toFixed(1)}k`
                : `$${p.value.toFixed(0)}`}
            </text>
          )}
          {/* Outer glow for current month */}
          {i === currentMonth && p.value > 0 && (
            <circle cx={p.x} cy={p.y} r={9} fill={color} fillOpacity="0.15" />
          )}
          {/* Dot */}
          <circle
            cx={p.x}
            cy={p.y}
            r={i === currentMonth && p.value > 0 ? 5 : 3.5}
            fill={p.value > 0 ? "#fff" : "#f1f5f9"}
            stroke={p.value > 0 ? color : "#cbd5e1"}
            strokeWidth="2"
          />
          {/* X label */}
          <text
            x={p.x}
            y={padT + chartH + 18}
            textAnchor="middle"
            style={{
              fontSize: 10,
              fill:
                i === currentMonth
                  ? color
                  : p.value > 0
                    ? "#64748b"
                    : "#cbd5e1",
              fontWeight: i === currentMonth ? 800 : p.value > 0 ? 600 : 400,
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
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
  const paymentData = summary?.by_method
    ? Object.entries(summary.by_method).map(([k, v]) => ({
        label: k,
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
        {/* Line Chart — Monthly Revenue */}
        <div className="rp-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
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
              marginBottom: 12,
            }}
          >
            Revenue trend by month
          </p>
          {monthly.length > 0 ? (
            <>
              <LineChart data={monthly} color="#6366f1" height={180} />
              <div
                style={{
                  marginTop: 10,
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

        {/* Best Selling Products */}
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
              <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>No sales
              data yet
            </div>
          ) : (
            <div style={{ overflowY: "auto", maxHeight: 340 }}>
              {bestSellers.map((p, i) => {
                const c = RANK_COLORS[i] || "#6366f1";
                const maxQty = bestSellers[0].total_qty;
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
                            width: `${(p.total_qty / maxQty) * 100}%`,
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

      {/* Payment Method + All-Time Summary */}
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
                <div key={i} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                      fontSize: 13,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: colors[i % 4],
                        }}
                      />
                      <span style={{ fontWeight: 700, color: "#374151" }}>
                        {p.label}
                      </span>
                    </div>
                    <span style={{ fontWeight: 800, color: colors[i % 4] }}>
                      ${p.value.toFixed(2)}{" "}
                      <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
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
                        transition: "width .6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

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
