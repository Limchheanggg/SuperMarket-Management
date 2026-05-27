import { useState, useEffect } from "react";
import API from "../../services/api";

export default function AdminSales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tab, setTab] = useState("transactions");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Sale state
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [saleSuccess, setSaleSuccess] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [salesRes, prodRes, custRes] = await Promise.all([
        API.get("/api/sales/"),
        API.get("/api/products/"),
        API.get("/api/users/customers"),
      ]);
      setSales(salesRes.data);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
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
  const tax = (subtotal - discount) * 0.1;
  const total = subtotal - discount + tax;

  const processSale = async () => {
    if (cart.length === 0) return alert("Add products first!");
    try {
      const res = await API.post("/api/sales/", {
        items: cart,
        discount: parseFloat(discount),
        tax_rate: 0.1,
        payment_method: paymentMethod,
        customer_id: selectedCustomer ? parseInt(selectedCustomer) : null,
      });
      setSaleSuccess(res.data);
      setCart([]);
      setDiscount(0);
      setSelectedCustomer("");
      fetchAll();
    } catch (e) {
      alert("Error processing sale");
    }
  };

  const viewDetail = async (id) => {
    const res = await API.get(`/api/sales/${id}`);
    setDetail(res.data);
  };

  return (
    <div style={{ padding: 28 }}>
      <h2
        style={{
          fontFamily: "'Josefin Sans',sans-serif",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        🛒 Sales Management
      </h2>

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
              padding: "9px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              background: tab === t ? "#00B207" : "#f0f0f0",
              color: tab === t ? "#fff" : "#555",
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
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8f8f8",
                  borderBottom: "2px solid #eee",
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
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 700,
                      color: "#555",
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
                    style={{ padding: 40, textAlign: "center", color: "#888" }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ padding: 40, textAlign: "center", color: "#888" }}
                  >
                    No sales yet
                  </td>
                </tr>
              ) : (
                sales.map((s) => (
                  <tr
                    key={s.Sale_ID}
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#00B207",
                        fontWeight: 700,
                      }}
                    >
                      #{s.Sale_ID}
                    </td>
                    <td style={{ padding: "12px 16px" }}>{s.Customer}</td>
                    <td style={{ padding: "12px 16px", color: "#888" }}>
                      {s.Items_Count} items
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700 }}>
                      ${s.Total_Amount?.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#666" }}>
                      {s.Payment_Method}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          background: "#00B20720",
                          color: "#00B207",
                        }}
                      >
                        {s.Status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 12,
                      }}
                    >
                      {new Date(s.Created_At).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={() => viewDetail(s.Sale_ID)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "1px solid #ddd",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        View
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
          {/* Left - Product Selection */}
          <div>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 14,
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
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    fontSize: 13,
                  }}
                >
                  <option value="">Select product...</option>
                  {products.map((p) => (
                    <option key={p.Product_ID} value={p.Product_ID}>
                      {p.Name} — ${p.Unit_Price}
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
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    fontSize: 13,
                  }}
                />
                <button
                  onClick={addToCart}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "none",
                    background: "#00B207",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
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
                  marginBottom: 14,
                }}
              >
                Cart Items
              </h3>
              {cart.length === 0 ? (
                <div
                  style={{ textAlign: "center", color: "#888", padding: 30 }}
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
                      padding: "10px 0",
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {item.name}
                      </div>
                      <div style={{ color: "#888", fontSize: 12 }}>
                        ${item.unit_price} × {item.quantity}
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span style={{ fontWeight: 700, color: "#00B207" }}>
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        style={{
                          border: "none",
                          background: "none",
                          color: "#EA4B48",
                          cursor: "pointer",
                          fontSize: 16,
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

          {/* Right - Summary */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              height: "fit-content",
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
              Sale Summary
            </h3>

            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
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
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontSize: 13,
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
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
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
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontSize: 13,
                }}
              >
                {["Cash", "Card", "QR Code", "ABA", "Wing"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
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
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div
              style={{
                borderTop: "2px solid #f0f0f0",
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
                    color: "#666",
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
                  fontWeight: 700,
                  marginTop: 10,
                }}
              >
                <span>Total</span>
                <span style={{ color: "#00B207" }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={processSale}
              style={{
                width: "100%",
                padding: 13,
                borderRadius: 8,
                border: "none",
                background: "#00B207",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              ✓ Process Sale
            </button>

            {saleSuccess && (
              <div
                style={{
                  marginTop: 14,
                  padding: 14,
                  background: "#F2FCF3",
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                <div
                  style={{ color: "#00B207", fontWeight: 700, fontSize: 14 }}
                >
                  ✅ Sale #{saleSuccess.Sale_ID} Complete!
                </div>
                <div style={{ color: "#555", fontSize: 13, marginTop: 4 }}>
                  Total: ${saleSuccess.Total?.toFixed(2)}
                </div>
                <button
                  onClick={() => setSaleSuccess(null)}
                  style={{
                    marginTop: 8,
                    border: "none",
                    background: "none",
                    color: "#00B207",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  New Sale →
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
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              width: 420,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Josefin Sans',sans-serif",
                marginBottom: 16,
              }}
            >
              Receipt — Sale #{detail.Sale_ID}
            </h3>
            {detail.Items?.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  padding: "6px 0",
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                <span>
                  {item.Product_Name} × {item.Quantity}
                </span>
                <span style={{ fontWeight: 600 }}>
                  ${item.Subtotal?.toFixed(2)}
                </span>
              </div>
            ))}
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "2px solid #eee",
              }}
            >
              {[
                ["Discount", `-$${detail.Discount?.toFixed(2)}`],
                ["Tax", `$${detail.Tax?.toFixed(2)}`],
                ["Total", `$${detail.Total_Amount?.toFixed(2)}`],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 6,
                    fontWeight: l === "Total" ? 700 : 400,
                  }}
                >
                  <span>{l}</span>
                  <span
                    style={{ color: l === "Total" ? "#00B207" : "inherit" }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDetail(null)}
              style={{
                width: "100%",
                marginTop: 16,
                padding: 11,
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
                fontWeight: 700,
                cursor: "pointer",
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
