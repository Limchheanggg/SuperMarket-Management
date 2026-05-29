import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createSale } from "../services/api";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState("Cash");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const tax = totalPrice * 0.1;

  // Map frontend label to DB enum value
  const PAY_MAP = {
    Cash: "Cash",
    Card: "Card",
    "ABA / Wing": "QR Code",
    "Bank Transfer": "Bank Transfer",
  };

  const handlePhone = (e) => {
    // Only allow digits, +, spaces, dashes, parentheses
    const val = e.target.value.replace(/[^0-9+\s\-()]/g, "");
    setForm({ ...form, phone: val });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Your cart is empty");
    if (form.phone.length < 6)
      return toast.error("Please enter a valid phone number");
    setLoading(true);
    try {
      await createSale({
        customer_id: null,
        cashier_id: user?.id || null,
        items: cartItems.map((i) => ({
          Product_ID: i.Product_ID,
          qty: i.qty,
          Unit_Price: i.Unit_Price,
        })),
        total: parseFloat((totalPrice + tax).toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        discount: 0,
        payment_method: PAY_MAP[payMethod] || "Cash",
      });
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate("/orders");
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            Home › Cart › <strong>Checkout</strong>
          </span>
        </div>
      </div>
      <div className="container" style={{ padding: "40px 20px" }}>
        <form onSubmit={placeOrder}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: 28,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Billing */}
              <div className="card">
                <h3
                  style={{
                    fontFamily: "'Josefin Sans',sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 18,
                  }}
                >
                  Billing Details
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      className="form-input"
                      required
                      placeholder="e.g. Limchheang"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      className="form-input"
                      required
                      placeholder="e.g. Khun"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    className="form-input"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Phone *{" "}
                    <span
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                        fontWeight: 400,
                      }}
                    >
                      (numbers only)
                    </span>
                  </label>
                  <input
                    className="form-input"
                    required
                    placeholder="e.g. +855 12 345 678"
                    value={form.phone}
                    onChange={handlePhone}
                    inputMode="tel"
                    style={{
                      borderColor:
                        form.phone && form.phone.length < 6
                          ? "#EA4B48"
                          : undefined,
                    }}
                  />
                  {form.phone && form.phone.length < 6 && (
                    <small style={{ color: "#EA4B48", fontSize: 12 }}>
                      Please enter a valid phone number
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Address *</label>
                  <input
                    className="form-input"
                    required
                    placeholder="e.g. Street 271, Phnom Penh"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="card">
                <h3
                  style={{
                    fontFamily: "'Josefin Sans',sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 18,
                  }}
                >
                  Payment Method
                </h3>
                {[
                  ["💳", "Card"],
                  ["📱", "ABA / Wing"],
                  ["💵", "Cash"],
                  ["🏦", "Bank Transfer"],
                ].map(([icon, method]) => (
                  <div
                    key={method}
                    onClick={() => setPayMethod(method)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "13px 14px",
                      border: `1.5px solid ${payMethod === method ? "#00B207" : "#e8e8e8"}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      marginBottom: 10,
                      background: payMethod === method ? "#F2FCF3" : "#fff",
                      transition: "all .2s",
                    }}
                  >
                    <input
                      type="radio"
                      readOnly
                      checked={payMethod === method}
                      style={{ accentColor: "#00B207" }}
                    />
                    {icon} {method}
                    {payMethod === method && (
                      <span
                        style={{
                          marginLeft: "auto",
                          color: "#00B207",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        ✓ Selected
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div
              className="card"
              style={{ height: "fit-content", position: "sticky", top: 100 }}
            >
              <h3
                style={{
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 18,
                  paddingBottom: 12,
                  borderBottom: "1px solid #e8e8e8",
                }}
              >
                Your Order
              </h3>
              {cartItems.map((i) => (
                <div
                  key={i.Product_ID}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    fontSize: 13,
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <span>
                    {i.Name} ×{i.qty}
                  </span>
                  <span>${(Number(i.Unit_Price) * i.qty).toFixed(2)}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  fontSize: 14,
                  borderTop: "1px solid #e8e8e8",
                  marginTop: 8,
                }}
              >
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  fontSize: 14,
                }}
              >
                <span>Tax 10%</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  fontSize: 13,
                  color: "#6b7280",
                }}
              >
                <span>Payment</span>
                <span style={{ fontWeight: 600, color: "#374151" }}>
                  {payMethod}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#00B207",
                }}
              >
                <span>Total</span>
                <span>${(totalPrice + tax).toFixed(2)}</span>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ marginTop: 16 }}
                disabled={cartItems.length === 0 || loading}
              >
                {loading ? "⏳ Placing order…" : "✅ Place Order"}
              </button>
              <Link
                to="/cart"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 10,
                  color: "#00B207",
                  fontSize: 13,
                }}
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
