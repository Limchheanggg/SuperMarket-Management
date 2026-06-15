import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createSale } from "../services/api";
import API from "../services/api";
import toast from "react-hot-toast";
import PaymentIcon from "../components/PaymentIcon";

const PAY_MAP = {
  'ABA':    'ABA',
  'Acleda': 'Acleda',
  'Cash':   'Cash',
};

const PAY_ICONS = {
  Card: "💳",
  "ABA / Wing": "📱",
  Cash: "💵",
  "Bank Transfer": "🏦",
};

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to cart if empty, or to login if not authenticated
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to checkout")
      navigate('/login')
      return
    }
    if (cartItems.length === 0) navigate('/cart')
  }, [])

  const [payMethod, setPayMethod] = useState("Cash");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const discount = couponResult?.discount_amount || 0;
  const grandTotal = Math.max(0, subtotal + tax - discount);

  const handlePhone = (e) => {
    setForm({ ...form, phone: e.target.value.replace(/[^0-9+\s\-()]/g, "") });
  };

  const applyCoupon = async () => {
    if (!user) {
      setCouponError("Please sign in to use coupon codes");
      return;
    }
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    setCouponResult(null);
    try {
      const res = await API.post("/api/coupons/validate", {
        code: couponCode.trim().toUpperCase(),
        total: subtotal + tax,
        tier: user?.membership_tier || user?.tier || "Bronze",
      });
      setCouponResult(res.data);
      toast.success(
        `Coupon applied! You save $${res.data.discount_amount.toFixed(2)}`,
      );
    } catch (e) {
      setCouponError(e.response?.data?.detail || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponResult(null);
    setCouponCode("");
    setCouponError("");
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to checkout")
      navigate('/login')
      return
    }
    if (cartItems.length === 0) return toast.error("Your cart is empty");

    setLoading(true);
    try {
      let cid = user?.customer_id || null
      if (!cid && user?.id) {
        try {
          const memRes = await API.get(`/api/membership/me?user_id=${user.id}`)
          cid = memRes.data?.Customer_ID || null
        } catch {}
      }
      const saleData = {
        customer_id: cid,
        cashier_id: ["cashier","employee"].includes(user?.role) ? user?.id : 527,
        items: cartItems.map((i) => ({
          Product_ID: i.Product_ID,
          qty: i.qty,
          Unit_Price: i.Unit_Price,
        })),
        total: parseFloat(grandTotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        coupon: couponResult?.code || null,
        payment_method: PAY_MAP[payMethod] || "Cash",
        customer_info: {
          name:    user?.name  || user?.full_name || "",
          email:   user?.email || "",
          phone:   user?.phone || "",
          notes:   notes,
        },
      }
      console.log("Sale data:", JSON.stringify(saleData))
      await createSale(saleData);
      clearCart();
      toast.success("Order placed successfully!");
      try {
        navigate("/order-success", {
          state: {
            order: result.data,
            items: cartItems,
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax:      parseFloat(tax.toFixed(2)),
            discount: parseFloat(discount.toFixed(2)),
            coupon:   couponResult?.code || null,
            payMethod,
          }
        });
      } catch {
        navigate("/");
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (error) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: `1.5px solid ${error ? "#ef4444" : "#e5e7eb"}`,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Plus Jakarta Sans',sans-serif",
    background: error ? "#fef2f2" : "#fff",
    transition: "border-color .2s",
  });

  return (
    <div
      className="page-enter"
      style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .checkout-grid { display:grid; grid-template-columns:1fr 380px; gap:28px; align-items:start; }
        .checkout-2col { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
        .checkout-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .checkout-pay-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        @media (max-width: 800px) {
          .checkout-grid, .checkout-2col, .checkout-info-grid, .checkout-pay-grid { grid-template-columns:1fr; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div
        style={{
          background: "#f8fafc",
          padding: "12px 0",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div className="container">
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            <Link to="/" style={{ color: "#6b7280", textDecoration: "none" }}>
              Home
            </Link>
            {" / "}
            <Link
              to="/cart"
              style={{ color: "#6b7280", textDecoration: "none" }}
            >
              Cart
            </Link>
            {" / "}
            <strong style={{ color: "#111827" }}>Checkout</strong>
          </span>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 20px" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#111827",
            marginBottom: 28,
          }}
        >
          Checkout
        </h1>

        <form onSubmit={placeOrder}>
          <div className="checkout-grid">
            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Billing Details */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 24,
                  border: "1.5px solid #e5e7eb",
                  boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: 20,
                    paddingBottom: 12,
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  Billing Details
                </h3>
                <div className="checkout-2col"></div>
                {/* System info display */}
                <div style={{ background:'#f8fafc', borderRadius:12, padding:'16px', marginBottom:14, border:'1px solid #e5e7eb' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Your Information</div>
                  <div className="checkout-info-grid">
                    {[
                      ['Full Name', user?.name || user?.full_name || 'N/A'],
                      ['Email',     user?.email || 'N/A'],
                      ['Phone',     user?.phone || 'N/A'],
                      ['Member',    user?.role  || 'customer'],
                    ].map(([l,v]) => (
                      <div key={l}>
                        <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginBottom:3 }}>{l}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:11, color:'#94a3b8', marginTop:10 }}>
                    To update your info, go to{' '}
                    <a href="/settings" style={{ color:'#c0272d', fontWeight:700, textDecoration:'none' }}>Account Settings</a>
                  </div>
                </div>
                {/* Optional notes */}
                <div>
                  <label style={{ fontSize:13, fontWeight:700, display:'block', marginBottom:6, color:'#374151' }}>
                    Order Notes <span style={{ color:'#9ca3af', fontWeight:400, fontSize:12 }}>(optional)</span>
                  </label>
                  <textarea
                    placeholder="Any special instructions, delivery notes, or requests..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    style={{ width:'100%', padding:'11px 14px', borderRadius:10,
                      border:'1.5px solid #e5e7eb', fontSize:14, resize:'vertical',
                      fontFamily:"'Plus Jakarta Sans',sans-serif", outline:'none',
                      boxSizing:'border-box', color:'#374151' }}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 24,
                  border: "1.5px solid #e5e7eb",
                  boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: 20,
                    paddingBottom: 12,
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  Payment Method
                </h3>
                <div className="checkout-pay-grid">
                  {["ABA", "Acleda", "Cash"].map(
                    (method) => (
                      <div
                        key={method}
                        onClick={() => setPayMethod(method)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "14px 16px",
                          border: `2px solid ${payMethod === method ? "#16a34a" : "#e5e7eb"}`,
                          borderRadius: 12,
                          cursor: "pointer",
                          background: payMethod === method ? "#f0fdf4" : "#fff",
                          transition: "all .2s",
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: `2px solid ${payMethod === method ? "#16a34a" : "#d1d5db"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {payMethod === method && (
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#16a34a",
                              }}
                            />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: payMethod === method ? 700 : 500,
                            color: payMethod === method ? "#15803d" : "#374151",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <PaymentIcon method={method} size={20}/>
                          {method}
                        </span>
                        {payMethod === method && (
                          <span
                            style={{
                              marginLeft: "auto",
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#16a34a",
                            }}
                          >
                            Selected
                          </span>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Coupon Code */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 24,
                  border: "1.5px solid #e5e7eb",
                  boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: 6,
                  }}
                >
                  Coupon / Promo Code
                </h3>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                  Apply a coupon code to get a discount on your order
                </p>

                {couponResult ? (
                  /* Applied state */
                  <div
                    style={{
                      background: "#f0fdf4",
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: "1.5px solid #86efac",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontWeight: 800,
                            fontSize: 15,
                            color: "#15803d",
                            background: "#dcfce7",
                            padding: "3px 10px",
                            borderRadius: 6,
                          }}
                        >
                          {couponResult.code}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#16a34a",
                            fontWeight: 600,
                          }}
                        >
                          Applied
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: "#374151" }}>
                        {couponResult.description}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: "#16a34a",
                          marginTop: 4,
                        }}
                      >
                        You save ${couponResult.discount_amount.toFixed(2)}
                        {couponResult.discount_type === "percentage"
                          ? ` (${couponResult.discount_value}% off)`
                          : ` (fixed discount)`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        border: "1.5px solid #fca5a5",
                        background: "#fee2e2",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  /* Input state */
                  <div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <input
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), applyCoupon())
                        }
                        placeholder="Enter coupon code e.g. GOLD20"
                        style={{
                          flex: 1,
                          padding: "11px 14px",
                          borderRadius: 10,
                          border: `1.5px solid ${couponError ? "#ef4444" : "#e5e7eb"}`,
                          fontSize: 14,
                          outline: "none",
                          fontFamily: "monospace",
                          fontWeight: 600,
                          letterSpacing: 1,
                          background: couponError ? "#fef2f2" : "#fff",
                          textTransform: "uppercase",
                        }}
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponLoading}
                        style={{
                          padding: "11px 22px",
                          borderRadius: 10,
                          border: "none",
                          background: couponLoading
                            ? "#e5e7eb"
                            : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                          color: couponLoading ? "#9ca3af" : "#fff",
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: couponLoading ? "not-allowed" : "pointer",
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {couponLoading ? "Checking..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 8,
                          fontSize: 12,
                          color: "#ef4444",
                          background: "#fef2f2",
                          padding: "7px 12px",
                          borderRadius: 8,
                          border: "1px solid #fecaca",
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>Invalid:</span>{" "}
                        {couponError}
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: 12,
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>
                        Available codes:
                      </span>
                      {[
                        "BRONZE10",
                        "SILVER15",
                        "GOLD20",
                        "PLAT25",
                        "SUMMER20",
                      ].map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setCouponCode(code);
                            setCouponError("");
                          }}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                            background: "#f8fafc",
                            color: "#6b7280",
                            fontSize: 11,
                            fontFamily: "monospace",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN — Order Summary */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                border: "1.5px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                position: "sticky",
                top: 100,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: 18,
                  paddingBottom: 12,
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                Order Summary
              </h3>

              {/* Items */}
              <div
                style={{ maxHeight: 220, overflowY: "auto", marginBottom: 16 }}
              >
                {cartItems.map((i) => (
                  <div
                    key={i.Product_ID}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid #f9fafb",
                      fontSize: 13,
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: 8 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#111827",
                          lineHeight: 1.3,
                        }}
                      >
                        {i.Name}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}
                      >
                        ${Number(i.Unit_Price).toFixed(2)} x {i.qty}
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: "#111827" }}>
                      ${(Number(i.Unit_Price) * i.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ borderTop: "1.5px solid #e5e7eb", paddingTop: 14 }}>
                {[
                  ["Subtotal", `$${subtotal.toFixed(2)}`, "#374151", false],
                  ["Tax (10%)", `$${tax.toFixed(2)}`, "#374151", false],
                ].map(([l, v, c]) => (
                  <div
                    key={l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      color: c,
                      marginBottom: 8,
                    }}
                  >
                    <span>{l}</span>
                    <span>{v}</span>
                  </div>
                ))}

                {/* Discount row — only shown when coupon applied */}
                {couponResult && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      marginBottom: 8,
                      color: "#16a34a",
                      background: "#f0fdf4",
                      padding: "7px 10px",
                      borderRadius: 8,
                      fontWeight: 700,
                    }}
                  >
                    <span>Discount ({couponResult.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    color: "#6b7280",
                    marginBottom: 14,
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
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#15803d",
                    paddingTop: 12,
                    borderTop: "2px solid #e5e7eb",
                  }}
                >
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>

                {couponResult && (
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: "#16a34a",
                      fontWeight: 600,
                      textAlign: "right",
                    }}
                  >
                    You saved ${discount.toFixed(2)} with coupon
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={cartItems.length === 0 || loading}
                style={{
                  width: "100%",
                  marginTop: 20,
                  padding: "14px",
                  borderRadius: 12,
                  border: "none",
                  background:
                    cartItems.length === 0 || loading
                      ? "#e5e7eb"
                      : "linear-gradient(135deg,#15803d,#22c55e)",
                  color: cartItems.length === 0 || loading ? "#9ca3af" : "#fff",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor:
                    cartItems.length === 0 || loading
                      ? "not-allowed"
                      : "pointer",
                  boxShadow:
                    cartItems.length === 0 || loading
                      ? "none"
                      : "0 4px 14px rgba(21,128,61,.3)",
                  transition: "all .2s",
                }}
              >
                {loading
                  ? "Placing order..."
                  : `Place Order — $${grandTotal.toFixed(2)}`}
              </button>
              <Link
                to="/cart"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 12,
                  color: "#6b7280",
                  fontSize: 13,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
