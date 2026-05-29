import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const EMOJIS = {
  Produce: "🥬",
  Dairy: "🥛",
  Meat: "🥩",
  Bakery: "🍞",
  Beverages: "🧴",
  Snacks: "🍿",
  Frozen: "🧊",
  "Fruits & Vegetables": "🍎",
  "Meat & Seafood": "🥩",
  "Canned Goods": "🥫",
  "Personal Care": "💊",
  Household: "🧹",
  "Frozen Foods": "🧊",
  Seafood: "🐟",
};

export default function Cart() {
  const { cartItems, removeItem, updateQty, totalPrice } = useCart();
  const tax = totalPrice * 0.1;

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
            Home › <strong>Cart</strong>
          </span>
        </div>
      </div>
      <div className="container" style={{ padding: "40px 20px" }}>
        <h2
          style={{
            fontFamily: "'Josefin Sans',sans-serif",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          Shopping Cart{" "}
          <span style={{ fontSize: 16, color: "#7e7e7e", fontWeight: 400 }}>
            ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
          </span>
        </h2>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 80 }}>🛒</div>
            <h3
              style={{
                fontFamily: "'Josefin Sans',sans-serif",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Your cart is empty
            </h3>
            <p style={{ color: "#7e7e7e", marginBottom: 24 }}>
              Add some fresh products!
            </p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 28,
            }}
          >
            <div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr style={{ background: "#F2FCF3" }}>
                    {["Product", "Price", "Qty", "Total", ""].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
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
                  {cartItems.map((item) => (
                    <tr
                      key={item.Product_ID}
                      style={{ borderBottom: "1px solid #e8e8e8" }}
                    >
                      <td style={{ padding: 16 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              background: "#F2FCF3",
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 28,
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {item.Product_Image ? (
                              <img
                                src={item.Product_Image}
                                alt={item.Name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              EMOJIS[item.Category_Name] || "🛒"
                            )}
                          </div>
                          <div>
                            <strong
                              style={{ display: "block", marginBottom: 2 }}
                            >
                              {item.Name}
                            </strong>
                            <div style={{ fontSize: 12, color: "#7e7e7e" }}>
                              {item.Unit} · {item.Brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: 16 }}>
                        ${Number(item.Unit_Price).toFixed(2)}
                      </td>
                      <td style={{ padding: 16 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1.5px solid #e8e8e8",
                            borderRadius: 8,
                            overflow: "hidden",
                            width: "fit-content",
                          }}
                        >
                          <button
                            onClick={() =>
                              updateQty(item.Product_ID, item.qty - 1)
                            }
                            style={{
                              padding: "8px 12px",
                              background: "#f5f5f5",
                              border: "none",
                              cursor: "pointer",
                              fontSize: 16,
                            }}
                          >
                            −
                          </button>
                          <span
                            style={{
                              padding: "8px 14px",
                              fontWeight: 700,
                              minWidth: 32,
                              textAlign: "center",
                            }}
                          >
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateQty(item.Product_ID, item.qty + 1)
                            }
                            style={{
                              padding: "8px 12px",
                              background: "#f5f5f5",
                              border: "none",
                              cursor: "pointer",
                              fontSize: 16,
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: 16, fontWeight: 700 }}>
                        ${(Number(item.Unit_Price) * item.qty).toFixed(2)}
                      </td>
                      <td style={{ padding: 16 }}>
                        <button
                          onClick={() => removeItem(item.Product_ID)}
                          style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 10px",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
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
                Order Summary
              </h3>
              {[
                ["Subtotal", `$${totalPrice.toFixed(2)}`],
                ["Delivery", "FREE"],
                ["Tax 10%", `$${tax.toFixed(2)}`],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    fontSize: 14,
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  <span>{l}</span>
                  <span style={{ color: v === "FREE" ? "#00B207" : "inherit" }}>
                    {v}
                  </span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#00B207",
                }}
              >
                <span>Total</span>
                <span>${(totalPrice + tax).toFixed(2)}</span>
              </div>
              <Link
                to="/checkout"
                className="btn btn-primary btn-full"
                style={{ marginTop: 16, justifyContent: "center" }}
              >
                Proceed to Checkout →
              </Link>
              <Link
                to="/shop"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 10,
                  color: "#00B207",
                  fontSize: 13,
                }}
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
