import { useState, useEffect } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function AdminSales() {
  const [tab, setTab] = useState("transactions");
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // New sale state
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [discount, setDiscount] = useState(0);
  const [saleSuccess, setSaleSuccess] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [salesRes, prodRes, custRes] = await Promise.all([
        API.get("/api/sales/"),
        API.get("/api/products/"),
        API.get("/api/users/customers"),
      ]);
      setSales(salesRes.data || []);
      setProducts(prodRes.data || []);
      setCustomers(custRes.data || []);
    } catch {
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!selectedProduct) return toast.error("Select a product");
    const product = products.find(
      (p) => p.Product_ID === parseInt(selectedProduct),
    );
    if (!product) return;
    const existing = cart.find((c) => c.product_id === product.Product_ID);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.product_id === product.Product_ID
            ? { ...c, quantity: c.quantity + parseInt(qty) }
            : c,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          product_id: product.Product_ID,
          name: product.Name,
          unit_price: product.Unit_Price,
          quantity: parseInt(qty),
        },
      ]);
    }
    setSelectedProduct("");
    setQty(1);
  };

  const removeFromCart = (id) =>
    setCart(cart.filter((c) => c.product_id !== id));

  const subtotal = cart.reduce((s, c) => s + c.unit_price * c.quantity, 0);
  const tax = (subtotal - parseFloat(discount || 0)) * 0.1;
  const total = subtotal - parseFloat(discount || 0) + tax;

  const processSale = async () => {
    if (cart.length === 0) return toast.error("Add products first!");
    try {
      const res = await API.post("/api/sales/", {
        items: cart.map((c) => ({
          Product_ID: c.product_id,
          qty: c.quantity,
          Unit_Price: c.unit_price,
        })),
        discount: parseFloat(discount || 0),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        payment_method: paymentMethod,
        customer_id: selectedCustomer ? parseInt(selectedCustomer) : null,
        cashier_id: null,
      });
      setSaleSuccess(res.data);
      setCart([]);
      setDiscount(0);
      setSelectedCustomer("");
      toast.success(`Sale ${res.data.Sale_ID} completed!`);
      fetchAll();
    } catch {
      toast.error("Error processing sale");
    }
  };

  const viewDetail = async (saleId) => {
    // Extract numeric ID from "S001" format
    const numericId = String(saleId).replace(/\D/g, "");
    if (!numericId) return toast.error("Invalid sale ID");
    setDetailLoading(true);
    try {
      const res = await API.get(`/api/sales/${numericId}`);
      setDetail(res.data);
    } catch {
      toast.error("Could not load sale details");
    } finally {
      setDetailLoading(false);
    }
  };

  // Format date from "D/M/YYYY" to readable string
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    // Handle "D/M/YYYY" format from our backend
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      const months = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${d} ${months[parseInt(m)] || m} ${y}`;
    }
    return dateStr;
  };

  return (
    <div style={{ padding: 28, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 4,
            }}
          >
            🛒 Sales Management
          </h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Showing {sales.length} of 9,900+ total transactions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[
          ["transactions", "📋 Transactions"],
          ["new_sale", "+ New Sale"],
        ].map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 22px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              background:
                tab === t
                  ? "linear-gradient(135deg,#15803d,#22c55e)"
                  : "#f1f5f9",
              color: tab === t ? "#fff" : "#374151",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Transactions Tab */}
      {tab === "transactions" && (
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            overflow: "hidden",
            border: "1.5px solid #e5e7eb",
            boxShadow: "0 2px 10px rgba(0,0,0,.04)",
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e5e7eb",
                }}
              >
                {[
                  "Sale ID",
                  "Customer",
                  "Items",
                  "Total",
                  "Payment",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "13px 16px",
                      textAlign: "left",
                      fontWeight: 700,
                      color: "#374151",
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🧾</div>
                    <p>
                      No sales yet.{" "}
                      <button
                        onClick={() => setTab("new_sale")}
                        style={{
                          color: "#16a34a",
                          fontWeight: 700,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Create first sale →
                      </button>
                    </p>
                  </td>
                </tr>
              ) : (
                sales.map((s) => (
                  <tr
                    key={s.Sale_ID}
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
                        padding: "13px 16px",
                        color: "#16a34a",
                        fontWeight: 700,
                      }}
                    >
                      #{s.Sale_ID}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      {s.Customer || "Walk-in"}
                    </td>
                    <td style={{ padding: "13px 16px", color: "#64748b" }}>
                      {s.items} items
                    </td>
                    <td style={{ padding: "13px 16px", fontWeight: 700 }}>
                      ${Number(s.Total_Amount || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: "13px 16px", color: "#374151" }}>
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
                        {s.method || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
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
                        {s.status || "completed"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        color: "#64748b",
                        fontSize: 12,
                      }}
                    >
                      {formatDate(s.date)}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <button
                        onClick={() => viewDetail(s.Sale_ID)}
                        disabled={detailLoading}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 8,
                          border: "1.5px solid #93c5fd",
                          background: "#dbeafe",
                          color: "#1d4ed8",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                        }}
                      >
                        {detailLoading ? "…" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New Sale Tab */}
      {tab === "new_sale" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}
        >
          <div>
            {/* Add Product */}
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
                  marginBottom: 14,
                  color: "#0f172a",
                }}
              >
                Add Products
              </h3>
              <div style={{ display: "flex", gap: 10 }}>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 9,
                    border: "1.5px solid #e5e7eb",
                    fontSize: 13,
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    outline: "none",
                  }}
                >
                  <option value="">Select product...</option>
                  {products.map((p) => (
                    <option key={p.Product_ID} value={p.Product_ID}>
                      {p.Name} — ${p.Unit_Price} ({p.Current_Stock} in stock)
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  min="1"
                  style={{
                    width: 70,
                    padding: "10px 14px",
                    borderRadius: 9,
                    border: "1.5px solid #e5e7eb",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  onClick={addToCart}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 9,
                    border: "none",
                    background: "linear-gradient(135deg,#15803d,#22c55e)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 20,
                border: "1.5px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 15,
                  fontWeight: 800,
                  marginBottom: 14,
                  color: "#0f172a",
                }}
              >
                Cart Items{" "}
                {cart.length > 0 && (
                  <span style={{ color: "#16a34a" }}>({cart.length})</span>
                )}
              </h3>
              {cart.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    padding: 30,
                    fontSize: 13,
                  }}
                >
                  No items added yet
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product_id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#0f172a",
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: 12 }}>
                        ${item.unit_price} × {item.quantity}
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span
                        style={{
                          fontWeight: 800,
                          color: "#16a34a",
                          fontSize: 14,
                        }}
                      >
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        style={{
                          border: "none",
                          background: "#fee2e2",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: 16,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 20,
              border: "1.5px solid #e5e7eb",
              height: "fit-content",
            }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 15,
                fontWeight: 800,
                marginBottom: 16,
                color: "#0f172a",
              }}
            >
              Sale Summary
            </h3>

            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 6,
                  color: "#374151",
                }}
              >
                Customer (optional)
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 9,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 13,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  outline: "none",
                }}
              >
                <option value="">Walk-in Customer</option>
                {customers.map((c) => (
                  <option key={c.Customer_ID} value={c.Customer_ID}>
                    {c.First_Name} {c.Last_Name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 6,
                  color: "#374151",
                }}
              >
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 9,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 13,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  outline: "none",
                }}
              >
                {["Cash", "Card", "QR Code", "Bank Transfer"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 6,
                  color: "#374151",
                }}
              >
                Discount ($)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min="0"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 9,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 13,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div
              style={{
                borderTop: "2px solid #f1f5f9",
                paddingTop: 14,
                marginBottom: 16,
              }}
            >
              {[
                ["Subtotal", `$${subtotal.toFixed(2)}`],
                ["Discount", `-$${parseFloat(discount || 0).toFixed(2)}`],
                ["Tax (10%)", `$${tax.toFixed(2)}`],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "#64748b",
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
                  fontSize: 18,
                  fontWeight: 800,
                  marginTop: 10,
                  color: "#0f172a",
                }}
              >
                <span>Total</span>
                <span style={{ color: "#16a34a" }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={processSale}
              style={{
                width: "100%",
                padding: 13,
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#15803d,#22c55e)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 15,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                boxShadow: "0 4px 12px rgba(21,128,61,.3)",
              }}
            >
              ✓ Process Sale
            </button>

            {saleSuccess && (
              <div
                style={{
                  marginTop: 14,
                  padding: 14,
                  background: "#f0fdf4",
                  borderRadius: 10,
                  textAlign: "center",
                  border: "1px solid #86efac",
                }}
              >
                <div
                  style={{ color: "#16a34a", fontWeight: 800, fontSize: 14 }}
                >
                  ✅ Sale {saleSuccess.Sale_ID} Complete!
                </div>
                <div style={{ color: "#374151", fontSize: 13, marginTop: 4 }}>
                  Total: ${saleSuccess.Total_Amount?.toFixed(2)}
                </div>
                <button
                  onClick={() => setSaleSuccess(null)}
                  style={{
                    marginTop: 8,
                    border: "none",
                    background: "none",
                    color: "#16a34a",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}
                >
                  + New Sale →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetail(null);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              width: "100%",
              maxWidth: 460,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
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
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Receipt — Sale #{detail.Sale_ID}
              </h3>
              <button
                onClick={() => setDetail(null)}
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

            {detail.items?.length > 0 ? (
              detail.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    padding: "8px 0",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <span style={{ color: "#374151" }}>
                    {item.Name} × {item.Quantity}
                  </span>
                  <span style={{ fontWeight: 700 }}>
                    ${Number(item.Subtotal || 0).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  padding: "20px 0",
                  fontSize: 13,
                }}
              >
                No item details available
              </div>
            )}

            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: "2px solid #e5e7eb",
              }}
            >
              {[
                [
                  "Total Amount",
                  `$${Number(detail.Total_Amount || 0).toFixed(2)}`,
                ],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  <span>{l}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setDetail(null)}
              style={{
                width: "100%",
                marginTop: 18,
                padding: 11,
                borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                background: "#f8fafc",
                fontWeight: 700,
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
