import { useState, useEffect } from "react";
import API from "../../services/api";

export default function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [sumRes, dayRes, invRes] = await Promise.all([
        API.get("/api/sales/reports/summary"),
        API.get("/api/sales/reports/daily"),
        API.get("/api/inventory/"),
      ]);
      setSummary(sumRes.data);
      setDaily(dayRes.data);
      setInventory(invRes.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const lowStock = inventory.filter(
    (i) => i.Status === "Low Stock" || i.Status === "Out of Stock",
  );

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Loading reports...
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
        📊 Reports & Analytics
      </h2>

      {/* Today's Summary */}
      <h3
        style={{
          fontFamily: "'Josefin Sans',sans-serif",
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 12,
          color: "#555",
        }}
      >
        📅 Today — {daily?.date}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          ["Today's Sales", daily?.total_sales || 0, "#3b82f6", "🛒"],
          [
            "Today's Revenue",
            `$${daily?.total_revenue?.toFixed(2) || "0.00"}`,
            "#00B207",
            "💰",
          ],
          [
            "Avg Transaction",
            `$${daily?.avg_transaction?.toFixed(2) || "0.00"}`,
            "#FF8C00",
            "📈",
          ],
        ].map(([l, v, c, icon]) => (
          <div
            key={l}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "20px 24px",
              borderLeft: `4px solid ${c}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              {l}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Monthly & Yearly */}
      <h3
        style={{
          fontFamily: "'Josefin Sans',sans-serif",
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 12,
          color: "#555",
        }}
      >
        📆 This Month & Year
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {[
          ["Monthly Sales", summary?.monthly_sales || 0, "#3b82f6"],
          [
            "Monthly Revenue",
            `$${summary?.monthly_revenue?.toFixed(2) || "0.00"}`,
            "#00B207",
          ],
          ["Yearly Sales", summary?.yearly_sales || 0, "#FF8C00"],
          [
            "Yearly Revenue",
            `$${summary?.yearly_revenue?.toFixed(2) || "0.00"}`,
            "#EA4B48",
          ],
        ].map(([l, v, c]) => (
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
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              {l}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Best Selling Products */}
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
            🏆 Best Selling Products
          </h3>
          {!summary?.best_selling_products?.length ? (
            <div style={{ textAlign: "center", color: "#888", padding: 20 }}>
              No sales data yet
            </div>
          ) : (
            summary.best_selling_products.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background:
                        i === 0
                          ? "#FFD700"
                          : i === 1
                            ? "#A8A9AD"
                            : i === 2
                              ? "#CD7F32"
                              : "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#888" }}>
                      {p.total_qty} units sold
                    </div>
                  </div>
                </div>
                <span
                  style={{ fontWeight: 700, color: "#00B207", fontSize: 13 }}
                >
                  ${p.total_revenue?.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Inventory Alert */}
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
            ⚠️ Inventory Alerts ({lowStock.length})
          </h3>
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
            lowStock.slice(0, 8).map((item, i) => (
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
      </div>
    </div>
  );
}
