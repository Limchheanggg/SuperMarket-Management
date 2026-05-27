import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

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
  Household: "🧹",
  "Personal Care": "💊",
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );
  if (!product)
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 60 }}>😕</div>
        <h3 style={{ fontFamily: "'Josefin Sans',sans-serif", marginTop: 16 }}>
          Product not found
        </h3>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: 20 }}>
          Back to Shop
        </Link>
      </div>
    );

  const emoji = EMOJIS[product.Category_Name] || "🛒";
  const tabBtn = (t, l) => (
    <button
      onClick={() => setTab(t)}
      style={{
        padding: "11px 22px",
        fontFamily: "'Josefin Sans',sans-serif",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        border: "none",
        background: "none",
        borderBottom: tab === t ? "3px solid #00B207" : "3px solid transparent",
        color: tab === t ? "#00B207" : "#7e7e7e",
        marginBottom: -2,
      }}
    >
      {l}
    </button>
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
          <Link to="/" style={{ color: "#00B207" }}>
            Home
          </Link>{" "}
          ›{" "}
          <Link to="/shop" style={{ color: "#00B207" }}>
            Shop
          </Link>{" "}
          › <strong>{product.Name}</strong>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Image */}
          <div
            style={{
              background: "#F2FCF3",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 130,
              minHeight: 360,
              position: "relative",
            }}
          >
            {emoji}
            {product.Status === "Out of Stock" && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "#EA4B48",
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Out of Stock
              </div>
            )}
            {product.Status === "Low Stock" && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "#FF8C00",
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Low Stock
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p
              style={{
                color: "#00B207",
                fontWeight: 700,
                fontSize: 12,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {product.Category_Name}
            </p>
            <h1
              style={{
                fontFamily: "'Josefin Sans',sans-serif",
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              {product.Name}
            </h1>
            <div style={{ color: "#FF8C00", marginBottom: 10 }}>
              ★★★★★{" "}
              <span style={{ color: "#7e7e7e", fontSize: 13 }}>
                (124 reviews)
              </span>
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: "#00B207",
                marginBottom: 8,
              }}
            >
              ${Number(product.Unit_Price).toFixed(2)}
            </div>
            <div style={{ fontSize: 13, color: "#7e7e7e", marginBottom: 14 }}>
              Brand: <strong>{product.Brand || "—"}</strong> &nbsp;|&nbsp; Unit:{" "}
              <strong>{product.Unit}</strong> &nbsp;|&nbsp; Stock:{" "}
              <strong
                style={{
                  color:
                    product.Current_Stock === 0
                      ? "#EA4B48"
                      : product.Current_Stock <= product.Reorder_Level
                        ? "#FF8C00"
                        : "#00B207",
                }}
              >
                {product.Current_Stock} left
              </strong>
            </div>
            <p
              style={{
                color: "#7e7e7e",
                fontSize: 14,
                lineHeight: 1.8,
                marginBottom: 18,
              }}
            >
              {product.Description}
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1.5px solid #e8e8e8",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{
                    padding: "10px 16px",
                    background: "#f5f5f5",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    padding: "10px 20px",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={{
                    padding: "10px 16px",
                    background: "#f5f5f5",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-primary"
                disabled={product.Current_Stock === 0}
                onClick={() => {
                  for (let i = 0; i < qty; i++) addItem(product);
                }}
              >
                {product.Current_Stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => toast.success("Added to wishlist!")}
              >
                ♡
              </button>
            </div>

            <div
              style={{
                display: "flex",
                borderBottom: "2px solid #e8e8e8",
                marginBottom: 16,
              }}
            >
              {tabBtn("desc", "Description")}
              {tabBtn("nutrition", "Nutrition")}
              {tabBtn("reviews", "Reviews")}
            </div>
            {tab === "desc" && (
              <p style={{ color: "#7e7e7e", fontSize: 14, lineHeight: 1.8 }}>
                {product.Description || "No description available."}
              </p>
            )}
            {tab === "nutrition" && (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                {[
                  ["Calories", "45 kcal"],
                  ["Protein", "2.1g"],
                  ["Carbs", "9.4g"],
                  ["Fat", "0.3g"],
                ].map(([n, v]) => (
                  <tr key={n} style={{ borderBottom: "1px solid #e8e8e8" }}>
                    <td style={{ padding: "8px 12px" }}>{n}</td>
                    <td style={{ padding: "8px 12px", fontWeight: 600 }}>
                      {v}
                    </td>
                  </tr>
                ))}
              </table>
            )}
            {tab === "reviews" && (
              <div>
                {[
                  { n: "Lyveng C.", s: 5, t: "Very fresh!" },
                  { n: "Limchheang K.", s: 4, t: "Good value." },
                ].map((r) => (
                  <div
                    key={r.n}
                    style={{
                      background: "#F2FCF3",
                      borderRadius: 8,
                      padding: 14,
                      marginBottom: 10,
                    }}
                  >
                    <strong>{r.n}</strong>{" "}
                    <span style={{ color: "#FF8C00" }}>{"★".repeat(r.s)}</span>
                    <p style={{ fontSize: 13, color: "#7e7e7e", marginTop: 5 }}>
                      {r.t}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
