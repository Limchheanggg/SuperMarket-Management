import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSales, getSaleDetail } from "../services/api";
import API from "../services/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    getSales()
      .then((r) => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const openDetail = async (order) => {
    setSelectedOrder(order);
    setDetailItems([]);
    setDetailLoading(true);
    try {
      // Extract numeric ID from "S001" format
      const numericId = String(order.Sale_ID).replace(/\D/g, "");
      const res = await API.get(`/api/sales/${numericId}`);
      setDetailItems(res.data.items || []);
    } catch {
      setDetailItems([]);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <p
            style={{
              color: "#6b7280",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            Loading orders…
          </p>
        </div>
      </div>
    );

  return (
    <div
      className="page-enter"
      style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
    >
      <div
        style={{
          background: "#f0fdf4",
          padding: "14px 0",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div className="container">
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            🏠{" "}
            <Link to="/" style={{ color: "#6b7280", textDecoration: "none" }}>
              Home
            </Link>{" "}
            › <strong style={{ color: "#111827" }}>My Orders</strong>
          </span>
        </div>
      </div>

      <div className="container" style={{ padding: "36px 20px" }}>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: "#111827",
            marginBottom: 6,
          }}
        >
          📦 My Orders
        </h2>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
          {orders.length} transaction{orders.length !== 1 ? "s" : ""} found
        </p>

        {orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#fff",
              borderRadius: 18,
              border: "1.5px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: 72, marginBottom: 16 }}>📦</div>
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              No orders yet
            </h3>
            <p style={{ color: "#6b7280", marginBottom: 24 }}>
              You haven't placed any orders. Start shopping!
            </p>
            <Link
              to="/shop"
              style={{
                padding: "12px 28px",
                background: "linear-gradient(135deg,#15803d,#22c55e)",
                color: "#fff",
                borderRadius: 12,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1.5px solid #e5e7eb",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,.04)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "Order ID",
                    "Date",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 16px",
                        textAlign: "left",
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        borderBottom: "2px solid #16a34a",
                        color: "#374151",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fafafa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "#16a34a",
                        fontWeight: 700,
                      }}
                    >
                      {o.Sale_ID}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b7280" }}>
                      {o.date}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#374151" }}>
                      {o.items} items
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      ${Number(o.Total_Amount || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 700,
                          background: "#f0fdf4",
                          color: "#16a34a",
                          border: "1px solid #86efac",
                        }}
                      >
                        {o.method}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
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
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => openDetail(o)}
                        style={{
                          background: "#f0fdf4",
                          color: "#16a34a",
                          border: "1.5px solid #86efac",
                          borderRadius: 8,
                          padding: "6px 14px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 32,
              width: "100%",
              maxWidth: 520,
              boxShadow: "0 8px 40px rgba(0,0,0,.15)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                🧾 Order {selectedOrder.Sale_ID}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                ✕
              </button>
            </div>

            {/* Order info */}
            <div
              style={{
                background: "#f0fdf4",
                borderRadius: 12,
                padding: 16,
                marginBottom: 18,
                border: "1px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  fontSize: 13,
                }}
              >
                {[
                  ["📅 Date", selectedOrder.date],
                  ["💳 Payment", selectedOrder.method],
                  ["👤 Customer", selectedOrder.Customer || "Walk-in"],
                  ["👨‍💼 Cashier", selectedOrder.cashier || "Staff"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span style={{ color: "#6b7280" }}>{label}: </span>
                    <strong style={{ color: "#111827" }}>{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Items list */}
            <h4
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 12,
              }}
            >
              🛒 Items Purchased
            </h4>

            {detailLoading ? (
              <div
                style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
                Loading items...
              </div>
            ) : detailItems.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 24,
                  color: "#94a3b8",
                  background: "#f8fafc",
                  borderRadius: 10,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
                No item details available
              </div>
            ) : (
              <div
                style={{
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 12,
                  overflow: "hidden",
                  marginBottom: 18,
                }}
              >
                {detailItems.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderBottom:
                        i < detailItems.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                      background: i % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        {item.Name}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}
                      >
                        ${Number(item.Unit_Price).toFixed(2)} × {item.Quantity}
                      </div>
                    </div>
                    <strong
                      style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 14,
                        color: "#16a34a",
                      }}
                    >
                      ${Number(item.Subtotal).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: 14 }}>
              {[
                [
                  "Subtotal",
                  `$${(Number(selectedOrder.Total_Amount || 0) - Number(selectedOrder.Tax || 0)).toFixed(2)}`,
                ],
                ["Tax (10%)", `$${Number(selectedOrder.Tax || 0).toFixed(2)}`],
                ...(selectedOrder.Discount > 0
                  ? [
                      [
                        "Discount",
                        `-$${Number(selectedOrder.Discount).toFixed(2)}`,
                      ],
                    ]
                  : []),
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    color: "#6b7280",
                    marginBottom: 6,
                  }}
                >
                  <span>{l}</span>
                  <span>{v}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                  fontSize: 17,
                  color: "#16a34a",
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <span>Total</span>
                <span>
                  ${Number(selectedOrder.Total_Amount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                width: "100%",
                marginTop: 20,
                padding: "12px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#15803d,#22c55e)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
