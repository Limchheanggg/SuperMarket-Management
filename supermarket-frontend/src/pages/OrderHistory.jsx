import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getSales } from "../services/api";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    getSales()
      .then((r) => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );

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
            Home › <strong>My Orders</strong>
          </span>
        </div>
      </div>
      <div className="container" style={{ padding: "36px 20px" }}>
        <h2
          style={{
            fontFamily: "'Josefin Sans',sans-serif",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          My Orders
        </h2>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 80 }}>📦</div>
            <h3
              style={{
                fontFamily: "'Josefin Sans',sans-serif",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No orders yet
            </h3>
            <p style={{ color: "#7e7e7e", marginBottom: 24 }}>
              You haven't placed any orders. Start shopping!
            </p>
            <a href="/shop" className="btn btn-primary">
              Browse Products
            </a>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              overflow: "hidden",
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
                <tr style={{ background: "#F2FCF3" }}>
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
                        fontFamily: "'Josefin Sans',sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        borderBottom: "2px solid #00B207",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "#00B207",
                        fontWeight: 700,
                      }}
                    >
                      {o.Sale_ID || o.id}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#7e7e7e" }}>
                      {o.date}
                    </td>
                    <td style={{ padding: "14px 16px" }}>{o.items} items</td>
                    <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                      ${Number(o.Total_Amount || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>{o.method}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        className={`status status-${(o.status || "pending").toLowerCase()}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => setSelectedOrder(o)}
                        style={{
                          background: "#F2FCF3",
                          color: "#00B207",
                          border: "1.5px solid #00B207",
                          borderRadius: 7,
                          padding: "5px 12px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
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
              borderRadius: 16,
              padding: 32,
              width: "100%",
              maxWidth: 500,
              boxShadow: "0 8px 40px rgba(0,0,0,.15)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
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
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Order {selectedOrder.Sale_ID || selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  cursor: "pointer",
                  color: "#7e7e7e",
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                background: "#F2FCF3",
                borderRadius: 10,
                padding: 16,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  fontSize: 14,
                }}
              >
                <div>
                  <span style={{ color: "#7e7e7e" }}>Date: </span>
                  <strong>{selectedOrder.date}</strong>
                </div>
                <div>
                  <span style={{ color: "#7e7e7e" }}>Payment: </span>
                  <strong>{selectedOrder.method}</strong>
                </div>
                <div>
                  <span style={{ color: "#7e7e7e" }}>Customer: </span>
                  <strong>{selectedOrder.Customer}</strong>
                </div>
                <div>
                  <span style={{ color: "#7e7e7e" }}>Cashier: </span>
                  <strong>{selectedOrder.cashier}</strong>
                </div>
                <div>
                  <span style={{ color: "#7e7e7e" }}>Status: </span>
                  <span
                    className={`status status-${(selectedOrder.status || "pending").toLowerCase()}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <span style={{ color: "#7e7e7e" }}>Total: </span>
                  <strong style={{ color: "#00B207", fontSize: 16 }}>
                    ${Number(selectedOrder.Total_Amount || 0).toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>

            {selectedOrder.Discount > 0 && (
              <div
                style={{
                  background: "#fff7ed",
                  border: "1px solid #FF8C00",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 14,
                  fontSize: 13,
                }}
              >
                🏷️ Discount applied:{" "}
                <strong>${selectedOrder.Discount?.toFixed(2)}</strong>
              </div>
            )}

            <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#7e7e7e" }}>Subtotal</span>
                <span>
                  $
                  {(
                    Number(selectedOrder.Total_Amount || 0) -
                    Number(selectedOrder.Tax || 0)
                  ).toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#7e7e7e" }}>Tax</span>
                <span>${Number(selectedOrder.Tax || 0).toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#00B207",
                  marginTop: 8,
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
              className="btn btn-primary btn-full"
              style={{ marginTop: 20, justifyContent: "center" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
